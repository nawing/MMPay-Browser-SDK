import {_getContentAfterModal, _getContentCancelModal, _getContentCoreCss, _getContentQRDisplay} from './templates';
import {ICreatePaymentRequestParams, ICreatePaymentResponse, ICreateTokenRequestParams, ICreateTokenResponse, IPollingRequest, IPollingResponse, PolliongResult, SDKOptions} from './types';


declare const QRCode: any;
declare const window: Window & {
  MMPayDownloadQR: () => void;
  MMPayCloseModal: (forceClose?: boolean) => void;
  MMPayReRenderModal: () => void;
  MMPayToggleLang: (lang: string) => void;
  setInterval: (handler: TimerHandler, timeout?: number) => number;
  clearInterval: (id: number) => void;
};

export class MMPaySDK {

  private POLL_INTERVAL_MS: number;
  private tokenKey: string;
  private publishableKey: string;
  private baseUrl: string;
  private merchantName: string;
  private environment: 'sandbox' | 'production';
  private pollIntervalId: number | undefined = undefined;
  private countdownIntervalId: number | undefined = undefined;
  private onCompleteCallback: ((result: PolliongResult) => void) | null = null;
  private overlayElement: HTMLDivElement | null = null;

  private pendingApiResponse: ICreatePaymentResponse | null = null;
  private pendingPaymentPayload: ICreatePaymentRequestParams | null = null;

  private readonly QR_SIZE: number = 290;
  private readonly TIMEOUT_SECONDS: number = 300;

  constructor(publishableKey: string, options: SDKOptions = {}) {
    if (!publishableKey) {
      throw new Error("A Publishable Key is required to initialize [MMPaySDK].");
    }
    this.publishableKey = publishableKey;
    this.environment = options.environment || 'production';
    this.baseUrl = options.baseUrl || 'https://api.mm-pay.com';
    this.merchantName = options.merchantName || 'Your Merchant';
    this.POLL_INTERVAL_MS = options.pollInterval || 5000;
  }

  private async _callApi<T>(endpoint: string, data: object = {}): Promise<T> {
    let config: any = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.publishableKey}`
    }
    if (this.tokenKey) {
      config = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.publishableKey}`,
        'X-MMPay-Btoken': `${this.tokenKey}`
      }
    }
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: config,
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${response.statusText}. Details: ${errorText}`);
    }
    return response.json() as Promise<T>;
  }

  private async _callApiTokenRequest(payload: ICreateTokenRequestParams): Promise<ICreateTokenResponse> {
    try {
      const endpoint = this.environment === 'sandbox'
        ? '/xpayments/sandbox-token-request'
        : '/xpayments/production-token-request';
      return await this._callApi<ICreateTokenResponse>(endpoint, payload);
    } catch (error) {
      console.error("Token request failed:", error);
      throw error;
    }
  }

  private async _callApiPaymentRequest(payload: ICreatePaymentRequestParams): Promise<ICreatePaymentResponse> {
    try {
      const endpoint = this.environment === 'sandbox'
        ? '/xpayments/sandbox-payment-create'
        : '/xpayments/production-payment-create';
      return await this._callApi<ICreatePaymentResponse>(endpoint, payload);
    } catch (error) {
      console.error("Payment request failed:", error);
      throw error;
    }
  }

  public async createPayment(params: ICreatePaymentRequestParams): Promise<ICreatePaymentResponse> {
    const tokenPayload: ICreateTokenRequestParams = {
      amount: params.amount,
      orderId: params.orderId,
      nonce: new Date().getTime().toString() + '_mmp'
    }
    const paymentPayload: ICreatePaymentRequestParams = {
      amount: params.amount,
      orderId: params.orderId,
      callbackUrl: params.callbackUrl,
      customMessage: params.customMessage,
      nonce: new Date().getTime().toString() + '_mmp'
    }
    try {
      const tokenResponse = await this._callApiTokenRequest(tokenPayload);
      this.tokenKey = tokenResponse.token as string;
      return await this._callApiPaymentRequest(paymentPayload);
    } catch (error) {
      console.error("Payment request failed:", error);
      throw error;
    }
  }

  public async showPaymentModal(
    params: ICreatePaymentRequestParams,
    onComplete: (result: PolliongResult) => void
  ): Promise<void> {
    const initialContent = `
      <div class="mmpay-card" style="padding: 64px 20px; justify-content: center;">
          <div style="text-align: center; color: #1d1d1f; font-weight: 500; font-size: 1.1rem;">
            <span class="en-text">Starting payment...</span>
            <span class="mm-text">ငွေပေးချေမှု စတင်နေသည်...</span>
          </div>
      </div>`;
    this._createAndRenderModal(initialContent, false);
    this.onCompleteCallback = onComplete;

    const tokenPayload: ICreateTokenRequestParams = {
      amount: params.amount,
      orderId: params.orderId,
      nonce: new Date().getTime().toString() + '_mmp'
    }
    const paymentPayload: ICreatePaymentRequestParams = {
      amount: params.amount,
      orderId: params.orderId,
      callbackUrl: params.callbackUrl,
      customMessage: params.customMessage,
      nonce: new Date().getTime().toString() + '_mmp'
    }

    try {
      const tokenResponse = await this._callApiTokenRequest(tokenPayload);
      this.tokenKey = tokenResponse.token as string;
      const apiResponse = await this._callApiPaymentRequest(paymentPayload);
      if (apiResponse && apiResponse.qr && apiResponse.transactionRefId) {
        this.pendingApiResponse = apiResponse;
        this.pendingPaymentPayload = paymentPayload;
        this._renderQrModalContent(apiResponse, paymentPayload, this.merchantName);
        this._startPolling(paymentPayload, onComplete);
        this._startCountdown(paymentPayload.orderId);
      } else {
        this._showTerminalMessage(apiResponse.orderId || 'N/A', 'FAILED', '<span class="en-text">Failed to start payment. No QR data.</span><span class="mm-text">ငွေပေးချေမှု စတင်ရန် မအောင်မြင်ပါ။ QR ဒေတာ မရရှိပါ။</span>');
      }
    } catch (error) {
      this.tokenKey = null;
      this._showTerminalMessage(paymentPayload.orderId || 'N/A', 'FAILED', '<span class="en-text">Error occurred while starting payment.</span><span class="mm-text">ငွေပေးချေမှု စတင်စဉ် အမှားအယွင်း ဖြစ်ပွားသည်။</span>');
    }
  }

  private _createAndRenderModal(contentHtml: string, isTerminal: boolean = false): HTMLDivElement {
    this._cleanupModal(false);
    const overlay = document.createElement('div');
    overlay.id = 'mmpay-full-modal';
    overlay.className = 'mmpay-lang-en';
    document.body.appendChild(overlay);
    this.overlayElement = overlay;

    const style = document.createElement('style');
    style.innerHTML = _getContentCoreCss();
    overlay.appendChild(style);
    window.MMPayToggleLang = (lang) => {
      const modal = document.getElementById('mmpay-full-modal');
      if (modal) modal.className = 'mmpay-lang-' + lang;
    };

    window.MMPayCloseModal = (forceClose = false) => {
      if (isTerminal || forceClose) {
        this._cleanupModal(true);
      } else {
        this._showCancelConfirmationModal();
      }
    };
    window.MMPayReRenderModal = () => this._reRenderPendingModalInstance();

    overlay.innerHTML += `
      <div class="mmpay-overlay-content">${contentHtml}</div>
    `;

    document.body.style.overflow = 'hidden';
    return overlay;
  }

  private _renderQrModalContent(apiResponse: ICreatePaymentResponse, payload: ICreatePaymentRequestParams, merchantName: string): void {
    const qrData = apiResponse.qr;
    const formattedAmount = apiResponse.amount.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    const qrContainerId = 'mmpayQrContainerBox';
    const orderId = payload.orderId;
    window.MMPayDownloadQR = function () {
      const container = document.getElementById(qrContainerId);
      if (!container) return;
      const canvas = container.querySelector('canvas');
      const img = container.querySelector('img');
      try {
        let dataURL = '';
        if (canvas) {
          dataURL = canvas.toDataURL('image/png');
        } else if (img) {
          dataURL = img.src;
        }

        if (dataURL) {
          const link = document.createElement('a');
          link.href = dataURL;
          link.download = `MMPay-QR-${orderId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (e) {
        console.error("Failed to download QR image:", e);
      }
    }
    const qrContentHtml = _getContentQRDisplay(qrContainerId, merchantName, formattedAmount, apiResponse);
    this._cleanupModal(false);
    this._createAndRenderModal(qrContentHtml, false);
    this._injectQrScript(qrData, qrContainerId);
  }

  private _showTerminalMessage(orderId: string, status: 'SUCCESS' | 'FAILED' | 'EXPIRED', messageHtml: string): void {
    this._cleanupModal(true);
    const isSuccess = status === 'SUCCESS';
    const content = _getContentAfterModal(isSuccess, orderId, messageHtml)
    this._createAndRenderModal(content, true);
  }

  private _showCancelConfirmationModal(): void {
    const overlayContent = this.overlayElement?.querySelector('.mmpay-overlay-content');
    if (!overlayContent) return;
    const qrView = overlayContent.querySelector('.mmpay-qr-view') as HTMLElement;
    if (qrView) {
      qrView.style.display = 'none';
    }
    let cancelView = document.getElementById('mmpay-cancel-view-container');
    if (cancelView) {
      cancelView.style.display = 'flex';
      return;
    }
    const content = _getContentCancelModal();
    overlayContent.insertAdjacentHTML('beforeend', content);
  }

  private _reRenderPendingModalInstance(): void {
    const cancelView = document.getElementById('mmpay-cancel-view-container');
    if (cancelView) {
      cancelView.style.display = 'none';
    }
    const overlayContent = this.overlayElement?.querySelector('.mmpay-overlay-content');
    if (overlayContent) {
      const qrView = overlayContent.querySelector('.mmpay-qr-view') as HTMLElement;
      if (qrView) {
        qrView.style.display = 'flex';
      }
    }
  }

  private _cleanupModal(restoreBodyScroll: boolean): void {
    if (this.pollIntervalId !== undefined) {
      window.clearInterval(this.pollIntervalId);
      this.pollIntervalId = undefined;
    }
    if (this.countdownIntervalId !== undefined) {
      window.clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = undefined;
    }
    if (this.overlayElement && this.overlayElement.parentNode) {
      this.overlayElement.parentNode.removeChild(this.overlayElement);
      this.overlayElement = null;
    }
    if (restoreBodyScroll) {
      document.body.style.overflow = '';
    }
    delete window.MMPayCloseModal;
    delete window.MMPayReRenderModal;
  }

  private _injectQrScript(qrData: string, qrContainerId: string): void {
    const initQR = () => {
      const container = document.getElementById(qrContainerId);
      if (typeof QRCode !== 'undefined' && container) {
        container.innerHTML = ''; // clear any existing content
        new QRCode(container, {
          text: qrData,
          width: this.QR_SIZE,
          height: this.QR_SIZE,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        console.error('Failed to load qrcode.js or find container.');
      }
    };

    if (typeof QRCode !== 'undefined') {
      setTimeout(initQR, 50);
    } else {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.onload = () => setTimeout(initQR, 50);
      document.head.appendChild(script);
    }
  }

  private async _startPolling(payload: IPollingRequest, onComplete: (result: PolliongResult) => void): Promise<void> {
    if (this.pollIntervalId !== undefined) {
      window.clearInterval(this.pollIntervalId);
    }
    const checkStatus = async () => {
      try {
        const endpoint = this.environment === 'sandbox'
          ? '/xpayments/sandbox-payment-polling'
          : '/xpayments/production-payment-polling';

        const response = await this._callApi<IPollingResponse>(endpoint, payload);
        const status = (response.status || '').toUpperCase();

        if (status === 'SUCCESS' || status === 'FAILED' || status === 'EXPIRED') {
          window.clearInterval(this.pollIntervalId);
          this.pollIntervalId = undefined;

          const success = status === 'SUCCESS';
          const messageHtml = success ?
            `<span class="en-text">Payment successful.<br>Ref: ${response.transactionRefId || 'N/A'}</span>
             <span class="mm-text">ငွေပေးချေမှု အောင်မြင်ပါပြီ။<br>ရည်ညွှန်းနံပါတ်: ${response.transactionRefId || 'N/A'}</span>` :
            `<span class="en-text">Payment ${status === 'FAILED' ? 'failed' : 'expired'}.</span>
             <span class="mm-text">ငွေပေးချေမှု ${status === 'FAILED' ? 'မအောင်မြင်ပါ' : 'သက်တမ်းကုန်သွားပါပြီ'}။</span>`;

          this._showTerminalMessage(response.orderId || 'N/A', status as 'SUCCESS' | 'FAILED' | 'EXPIRED', messageHtml);

          if (onComplete) {
            this.tokenKey = null;
            onComplete({success: success, transaction: response as IPollingResponse});
          }
          return;
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };
    checkStatus();
    this.pollIntervalId = window.setInterval(checkStatus, this.POLL_INTERVAL_MS);
  }

  private _startCountdown(orderId: string): void {
    if (this.countdownIntervalId !== undefined) {
      window.clearInterval(this.countdownIntervalId);
    }

    let remaining = this.TIMEOUT_SECONDS;
    const timerElement = document.getElementById('mmpay-countdown-text');

    const updateDisplay = () => {
      if (!timerElement) return;
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    this.countdownIntervalId = window.setInterval(() => {
      remaining--;
      updateDisplay();

      if (remaining <= 0) {
        window.clearInterval(this.countdownIntervalId);
        this.countdownIntervalId = undefined;
        this._showTerminalMessage(orderId, 'EXPIRED', '<span class="en-text">Time expired.</span><span class="mm-text">သတ်မှတ်ချိန်ကုန်သွားပါပြီ။</span>');
      }
    }, 1000);
  }
}

(window as any).MMPaySDK = MMPaySDK;
