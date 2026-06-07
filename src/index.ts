import {_getContentAfterModal, _getContentCancelModal, _getContentCoreCss, _getContentQRDisplay, _getPreloadScreen} from './templates';
import {
  ICancelPaymentRequestParams,
  ICancelPaymentResponse,
  ICreatePaymentRequestParams,
  ICreatePaymentResponse,
  ICreateTokenRequestParams,
  ICreateTokenResponse,
  IDesignOptions,
  IModalEventResult,
  IPollingRequest,
  IPollingResponse,
  SDKOptions
} from './types';

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
  private tokenKey: string | any;
  private publishableKey: string;
  private baseUrl: string;
  private merchantName: string;
  private environment: 'sandbox' | 'production';
  private pollIntervalId: number | undefined = undefined;
  private countdownIntervalId: number | undefined = undefined;
  private onCompleteCallback: ((result: IModalEventResult) => void) | null = null;
  private overlayElement: HTMLDivElement | null = null;
  private design: IDesignOptions;

  private pendingApiResponse: ICreatePaymentResponse | null = null;
  private pendingPaymentPayload: ICreatePaymentRequestParams | null = null;

  private readonly QR_SIZE: number = 290;
  private readonly TIMEOUT_SECONDS: number = 300;
  private readonly CACHE_KEY: string = 'mmpay_pending_tx';

  constructor(publishableKey: string, options: SDKOptions = {}) {
    if (!publishableKey) {
      throw new Error("A Publishable Key is required to initialize [MMPaySDK].");
    }
    this.publishableKey = publishableKey;

    if (publishableKey.includes('pk_test')) {
      this.environment = 'sandbox';
    } else if (publishableKey.includes('pk_live')) {
      this.environment = 'production';
    } else {
      this.environment = options.environment || 'production';
    }

    this.baseUrl = options.baseUrl || 'https://api.mm-pay.com';
    this.merchantName = options.merchantName || 'Your Merchant';
    this.POLL_INTERVAL_MS = options.pollInterval || 5000;

    this.design = {
      mode: options.design?.mode || 'light',
      color: options.design?.color || '#000000'
    };

    if (typeof window !== 'undefined') {
      this._checkAndAutoResume();
    }
  }

  private _triggerEvent(eventData: IModalEventResult): void {
    if (this.onCompleteCallback) {
      try {
        this.onCompleteCallback(eventData);
      } catch (e) {
        console.error("[MMPay SDK] Consumer callback error:", e);
      }
    }
  }

  private _checkAndAutoResume(): void {
    const cachedData = localStorage.getItem(this.CACHE_KEY);
    if (!cachedData) return;

    try {
      const parsed = JSON.parse(cachedData);

      if (parsed.environment !== this.environment) {
        this._clearCache();
        return;
      }

      if (Date.now() >= parsed.expireAt) {
        this.tokenKey = parsed.token;
        this._clearCache();
        return;
      }

      this.tokenKey = parsed.token;
      this.pendingPaymentPayload = parsed.payload;
      this.pendingApiResponse = parsed.apiResponse;

      this._renderQrModalContent(this.pendingApiResponse as ICreatePaymentResponse, this.pendingPaymentPayload as ICreatePaymentRequestParams, this.merchantName);
      this._startPolling(this.pendingPaymentPayload as IPollingRequest);
      this._startCountdown(this.pendingPaymentPayload!.orderId, parsed.expireAt);
    } catch (e) {
      this._clearCache();
    }
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
      throw new Error(`API Error (${response.status}): ${response.statusText}. Details: ${errorText}`);
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
      throw error;
    }
  }

  private async _callApiCancelPayment(payload: ICancelPaymentRequestParams): Promise<ICancelPaymentResponse> {
    const endpoint = this.environment === 'sandbox'
      ? '/xpayments/sandbox-payment-cancel'
      : '/xpayments/production-payment-cancel';
    return await this._callApi<ICancelPaymentResponse>(endpoint, payload);
  }

  private _clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
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
      throw error;
    }
  }

  public async showPaymentModal(
    params: ICreatePaymentRequestParams,
    onComplete: (result: IModalEventResult) => void
  ): Promise<void> {
    this.onCompleteCallback = onComplete;

    const cachedData = localStorage.getItem(this.CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);

        if (parsed.environment === this.environment && Date.now() < parsed.expireAt) {
          this.tokenKey = parsed.token;
          this.pendingPaymentPayload = parsed.payload;
          this.pendingApiResponse = parsed.apiResponse;

          this._renderQrModalContent(this.pendingApiResponse as ICreatePaymentResponse, this.pendingPaymentPayload as ICreatePaymentRequestParams, this.merchantName);
          this._startPolling(this.pendingPaymentPayload as IPollingRequest);
          this._startCountdown(this.pendingPaymentPayload!.orderId, parsed.expireAt);

          this._triggerEvent({
            created: true,
            orderId: this.pendingPaymentPayload!.orderId,
            transactionId: this.pendingApiResponse!.transactionRefId,
            transactionRefId: this.pendingApiResponse!.transactionRefId
          });
          return;
        } else {
          this.tokenKey = parsed.token;
          this._clearCache();
        }
      } catch (e) {
        this._clearCache();
      }
    }

    this._createAndRenderModal(_getPreloadScreen(this.design), false);

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

    const expireAt = Date.now() + (this.TIMEOUT_SECONDS * 1000);

    try {
      const apiCallSequence = async () => {
        const tokenResponse = await this._callApiTokenRequest(tokenPayload);
        this.tokenKey = tokenResponse.token as string;
        return await this._callApiPaymentRequest(paymentPayload);
      };

      const startTime = Date.now();
      let apiResponse: ICreatePaymentResponse | undefined;
      let apiError: any;

      try {
        apiResponse = await apiCallSequence();
      } catch (e) {
        apiError = e;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) {
        await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
      }

      if (apiError) {
        throw apiError;
      }

      if (apiResponse && apiResponse.qr && apiResponse.transactionRefId) {
        this.pendingApiResponse = apiResponse;
        this.pendingPaymentPayload = paymentPayload;

        localStorage.setItem(this.CACHE_KEY, JSON.stringify({
          payload: paymentPayload,
          apiResponse: apiResponse,
          expireAt: expireAt,
          token: this.tokenKey,
          environment: this.environment
        }));

        this._renderQrModalContent(apiResponse, paymentPayload, this.merchantName);
        this._startPolling(paymentPayload);
        this._startCountdown(paymentPayload.orderId, expireAt);

        this._triggerEvent({
          created: true,
          orderId: paymentPayload.orderId,
          transactionId: apiResponse.transactionRefId,
          transactionRefId: apiResponse.transactionRefId
        });
      } else {
        throw new Error("Invalid API Response: Missing QR Data or Reference ID.");
      }
    } catch (error: any) {
      this.tokenKey = null;
      console.error("[MMPay SDK Error]:", error);

      const errMessage = error?.message || 'Error occurred while starting payment.';
      const terminalMsg = `<span class="en-text">${errMessage}</span><span class="mm-text">ငွေပေးချေမှု စတင်စဉ် အမှားအယွင်း ဖြစ်ပွားသည်။</span>`;

      this._showTerminalMessage(paymentPayload.orderId || 'N/A', 'FAILED', terminalMsg);

      this._triggerEvent({
        failed: true,
        orderId: paymentPayload.orderId
      });
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
    style.innerHTML = _getContentCoreCss(this.design);
    overlay.appendChild(style);
    window.MMPayToggleLang = (lang) => {
      const modal = document.getElementById('mmpay-full-modal');
      if (modal) modal.className = 'mmpay-lang-' + lang;
    };

    window.MMPayCloseModal = async (forceClose = false) => {
      if (isTerminal || forceClose) {
        if (forceClose && !isTerminal && this.pendingPaymentPayload) {
          try {
            await this._callApiCancelPayment({
              orderId: this.pendingPaymentPayload.orderId,
              nonce: new Date().getTime().toString() + '_cancel'
            });

            this._triggerEvent({
              cancelled: true,
              orderId: this.pendingPaymentPayload.orderId
            });
          } catch (e) {

          }
          this._clearCache();
        }

        if (isTerminal) {
          this._clearCache();
        }

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
      }
    }
    const qrContentHtml = _getContentQRDisplay(qrContainerId, merchantName, formattedAmount, apiResponse, this.design);
    this._cleanupModal(false);
    this._createAndRenderModal(qrContentHtml, false);
    this._injectQrScript(qrData, qrContainerId);
  }

  private _showTerminalMessage(orderId: string, status: 'SUCCESS' | 'FAILED' | 'EXPIRED', messageHtml: string): void {
    this._cleanupModal(true);
    const isSuccess = status === 'SUCCESS';
    const content = _getContentAfterModal(isSuccess, orderId, messageHtml, this.design)
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
    const content = _getContentCancelModal(this.design);
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
        container.innerHTML = '';

        const safeUtf8Data = unescape(encodeURIComponent(qrData));

        new QRCode(container, {
          text: safeUtf8Data,
          width: this.QR_SIZE,
          height: this.QR_SIZE,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L
        });
      } else {
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

  private async _startPolling(payload: IPollingRequest): Promise<void> {
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

          if (this.countdownIntervalId !== undefined) {
            window.clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = undefined;
          }

          this._clearCache();

          const success = status === 'SUCCESS';
          const messageHtml = success ?
            `<span class="en-text">Payment successful.<br>Ref: ${response.transactionRefId || 'N/A'}</span>
             <span class="mm-text">ငွေပေးချေမှု အောင်မြင်ပါပြီ။<br>ရည်ညွှန်းနံပါတ်: ${response.transactionRefId || 'N/A'}</span>` :
            `<span class="en-text">Payment ${status === 'FAILED' ? 'failed' : 'expired'}.</span>
             <span class="mm-text">ငွေပေးချေမှု ${status === 'FAILED' ? 'မအောင်မြင်ပါ' : 'သက်တမ်းကုန်သွားပါပြီ'}။</span>`;

          this._showTerminalMessage(response.orderId || 'N/A', status as 'SUCCESS' | 'FAILED' | 'EXPIRED', messageHtml);

          this.tokenKey = null;
          this._triggerEvent({
            success: status === 'SUCCESS',
            failed: status === 'FAILED',
            expired: status === 'EXPIRED',
            orderId: response.orderId,
            transactionId: response.transactionRefId,
            transactionRefId: response.transactionRefId
          });
          return;
        }
      } catch (error) {
      }
    };
    checkStatus();
    this.pollIntervalId = window.setInterval(checkStatus, this.POLL_INTERVAL_MS);
  }

  private _startCountdown(orderId: string, expireAt: number): void {
    if (this.countdownIntervalId !== undefined) {
      window.clearInterval(this.countdownIntervalId);
    }

    const updateDisplay = () => {
      const timerElement = document.getElementById('mmpay-countdown-text');
      const remaining = Math.max(0, Math.floor((expireAt - Date.now()) / 1000));

      if (timerElement) {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      return remaining;
    }

    let currentRemaining = updateDisplay();

    this.countdownIntervalId = window.setInterval(async () => {
      currentRemaining = updateDisplay();

      if (currentRemaining <= 0) {
        window.clearInterval(this.countdownIntervalId);
        this.countdownIntervalId = undefined;
        if (this.pollIntervalId !== undefined) {
          window.clearInterval(this.pollIntervalId);
          this.pollIntervalId = undefined;
        }

        this._clearCache();
        this._showTerminalMessage(orderId, 'EXPIRED', '<span class="en-text">Time expired.</span><span class="mm-text">သတ်မှတ်ချိန်ကုန်သွားပါပြီ။</span>');

        this._triggerEvent({
          expired: true,
          orderId: orderId
        });
      }
    }, 1000);
  }
}

(window as any).MMPaySDK = MMPaySDK;
