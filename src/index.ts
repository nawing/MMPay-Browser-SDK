import {MMPayAPI} from './api';
import {DeprecatedMMPayAPI} from './deprecated/api';
import {legacyShowPaymentModal} from './deprecated/showPaymentModal';
import {
  ICreatePaymentRequestParams,
  ICreatePaymentResponse,
  IModalEventResult,
  IPaymentShowRequestParams,
  IPollingRequest,
  SDKOptions
} from './types';
import {MMPayUI} from './ui';

export class MMPaySDK {
  private POLL_INTERVAL_MS: number;
  private readonly TIMEOUT_SECONDS: number = 300;
  private readonly CACHE_KEY: string = 'mmpay_pending_tx';

  private environment: 'sandbox' | 'production';
  protected merchantName: string;
  private onCompleteCallback: ((result: IModalEventResult) => void) | null = null;

  private pollIntervalId: number | undefined = undefined;
  private countdownIntervalId: number | undefined = undefined;

  private pendingApiResponse: any | null = null;
  private pendingPaymentPayload: any | null = null;

  // Clean Infrastructure Dependencies
  protected api: MMPayAPI;
  protected legacyApi: DeprecatedMMPayAPI | null = null;
  protected ui: MMPayUI;

  constructor(publishableKey: string, options: SDKOptions = {}) {
    if (!publishableKey) {
      throw new Error("A Publishable Key is required to initialize [MMPaySDK].");
    }

    if (publishableKey.includes('pk_test')) {
      this.environment = 'sandbox';
    } else if (publishableKey.includes('pk_live')) {
      this.environment = 'production';
    } else {
      this.environment = options.environment || 'production';
    }

    const baseUrl = options.baseUrl || 'https://browser-engine-production.up.railway.app';
    this.merchantName = options.merchantName || 'MyanMyanPay';
    this.POLL_INTERVAL_MS = options.pollInterval || 5000;

    // Standard Core Injections
    this.api = new MMPayAPI(baseUrl, this.environment, publishableKey);
    this.ui = new MMPayUI({
      mode: options.design?.mode || 'light',
      color: options.design?.color
    });

    this.legacyApi = new DeprecatedMMPayAPI(this.environment, publishableKey);

    if (typeof window !== 'undefined') {
      this._checkAndAutoResume();
    }
  }

  /**
   * Backward-Compatible UI Trigger
   */
  public async showPaymentModal(
    params: ICreatePaymentRequestParams,
    onComplete: (result: IModalEventResult) => void
  ): Promise<void> {
    if (!this.legacyApi) {
      throw new Error("showPaymentModal() is discontinued on the modern infrastructure. Use .pay(orderId, callback) instead.");
    }
    return legacyShowPaymentModal.call(this, params, onComplete);
  }

  /**
   * Modern Tokenized Payload Flow
   */
  public async pay(orderId: string, onComplete: (result: IModalEventResult) => void): Promise<void> {
    this.onCompleteCallback = onComplete;
    const cachedData = localStorage.getItem(this.CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.environment === this.environment && Date.now() < parsed.expireAt && parsed.payload.orderId === orderId) {
          this.api.setToken(parsed.token);
          this._resumePaymentState(parsed.apiResponse, parsed.payload, parsed.expireAt);
          return;
        } else {
          this._clearCache();
        }
      } catch (e) {
        this._clearCache();
      }
    }

    this.ui.renderPreloadScreen(this._getGlobalHandlers());
    const showPayload: IPaymentShowRequestParams = {orderId, nonce: new Date().getTime().toString() + '_show'};
    const expireAt = Date.now() + (this.TIMEOUT_SECONDS * 1000);

    try {
      const startTime = Date.now();
      const tokenNonce = new Date().getTime().toString() + '_token';
      const tokenResponse = await this.api.createToken({orderId, nonce: tokenNonce});
      this.api.setToken(tokenResponse.token);

      const apiResponse: any = await this.api.showPayment(showPayload);
      const elapsed = Date.now() - startTime;
      if (elapsed < 1500) await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));

      if (apiResponse) {
        const status = (apiResponse.status || '').toUpperCase();
        const actualRefId = apiResponse.vendorQrRefId || apiResponse.transactionRefId;

        if (status !== 'PENDING') {
          this._clearCache();
          let terminalStatus: 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED' = 'FAILED';
          let terminalMsg = '';

          if (status === 'SUCCESS') {
            terminalStatus = 'SUCCESS';
            terminalMsg = `<span class="en-text">Payment successful.<br>Ref: ${actualRefId || 'N/A'}</span>`;
          } else if (status === 'CANCELLED') {
            terminalStatus = 'CANCELLED';
            terminalMsg = `<span class="en-text">Payment cancelled.</span>`;
          } else if (status === 'EXPIRED') {
            terminalStatus = 'EXPIRED';
            terminalMsg = `<span class="en-text">Payment expired.</span>`;
          } else {
            terminalMsg = `<span class="en-text">Payment failed.</span>`;
          }

          this.ui.showTerminalMessage(apiResponse.orderId || orderId, terminalStatus, terminalMsg, this._getGlobalHandlers(true));
          this._triggerEvent({
            success: status === 'SUCCESS',
            failed: status === 'FAILED',
            expired: status === 'EXPIRED',
            cancelled: status === 'CANCELLED',
            orderId: apiResponse.orderId || orderId,
            vendorQrRefId: actualRefId
          });
          return;
        }

        if (apiResponse.qr && actualRefId) {
          const mappedPaymentResponse: ICreatePaymentResponse = {...apiResponse, vendorQrRefId: actualRefId};
          const mappedPaymentPayload = {amount: apiResponse.amount, orderId: apiResponse.orderId, nonce: showPayload.nonce};

          localStorage.setItem(this.CACHE_KEY, JSON.stringify({
            payload: mappedPaymentPayload,
            apiResponse: mappedPaymentResponse,
            expireAt: expireAt,
            token: this.api.getToken(),
            environment: this.environment
          }));
          this._resumePaymentState(mappedPaymentResponse, mappedPaymentPayload, expireAt);
          return;
        }
      }
      throw new Error("Invalid API Response: Missing QR Data.");
    } catch (error: any) {
      this.api.setToken(null);
      const terminalMsg = `<span class="en-text">${error?.message || 'Error occurred.'}</span>`;
      this.ui.showTerminalMessage(orderId || 'N/A', 'FAILED', terminalMsg, this._getGlobalHandlers(true));
      this._triggerEvent({failed: true, orderId: orderId});
    }
  }

  // --- Protected Infrastructure Mappers ---
  protected _getGlobalHandlers(isTerminal: boolean = false) {
    return {
      MMPayToggleLang: (lang: string) => {
        const modal = document.getElementById('mmpay-full-modal');
        if (modal) modal.className = 'mmpay-lang-' + lang;
      },
      MMPayReRenderModal: () => this.ui.reRenderPendingModalInstance(),
      MMPayCloseModal: async (forceClose = false) => {
        if (isTerminal || forceClose) {
          if (forceClose && !isTerminal && this.pendingPaymentPayload) {
            try {
              await this.api.cancelPayment({
                orderId: this.pendingPaymentPayload.orderId,
                nonce: new Date().getTime().toString() + '_cancel'
              });
              this._triggerEvent({cancelled: true, orderId: this.pendingPaymentPayload.orderId});
            } catch (e) { }
            this._clearCache();
          }
          if (isTerminal) this._clearCache();
          this._cleanup();
        } else {
          this.ui.showCancelConfirmationModal();
        }
      }
    };
  }

  protected _triggerEvent(eventData: IModalEventResult): void {
    if (this.onCompleteCallback) {
      try {this.onCompleteCallback(eventData);} catch (e) { }
    }
  }

  protected _cleanup(): void {
    if (this.pollIntervalId !== undefined) {window.clearInterval(this.pollIntervalId); this.pollIntervalId = undefined;}
    if (this.countdownIntervalId !== undefined) {window.clearInterval(this.countdownIntervalId); this.countdownIntervalId = undefined;}
    this.ui.cleanupModal(true);
  }

  protected _clearCache(): void {localStorage.removeItem(this.CACHE_KEY);}

  private _checkAndAutoResume(): void {
    const cachedData = localStorage.getItem(this.CACHE_KEY);
    if (!cachedData) return;
    try {
      const parsed = JSON.parse(cachedData);
      if (parsed.environment !== this.environment || Date.now() >= parsed.expireAt) {
        this._clearCache();
        return;
      }
      this.api.setToken(parsed.token);
      this._resumePaymentState(parsed.apiResponse, parsed.payload, parsed.expireAt);
    } catch (e) {
      this._clearCache();
    }
  }

  private _resumePaymentState(apiResponse: any, payload: any, expireAt: number): void {
    this.pendingPaymentPayload = payload;
    this.pendingApiResponse = apiResponse;
    const actualRefId = apiResponse.vendorQrRefId || apiResponse.transactionRefId;
    apiResponse.vendorQrRefId = actualRefId;

    this.ui.renderQrModalContent(apiResponse, payload.orderId, this.merchantName, this._getGlobalHandlers());
    this._startPolling(payload);
    this._startCountdown(payload.orderId, expireAt);

    this._triggerEvent({created: true, orderId: payload.orderId, vendorQrRefId: actualRefId});
  }

  protected async _startPolling(payload: IPollingRequest): Promise<void> {
    if (this.pollIntervalId !== undefined) window.clearInterval(this.pollIntervalId);
    const checkStatus = async () => {
      try {
        const response: any = await this.api.pollPayment(payload);
        const status = (response.status || '').toUpperCase();
        const actualRefId = response.vendorQrRefId || response.transactionRefId;

        if (status === 'SUCCESS' || status === 'FAILED' || status === 'EXPIRED' || status === 'CANCELLED') {
          this._cleanup();
          this._clearCache();

          let messageHtml = '';
          if (status === 'SUCCESS') {
            messageHtml = `<span class="en-text">Payment successful.<br>Ref: ${actualRefId || 'N/A'}</span>`;
          } else if (status === 'CANCELLED') {
            messageHtml = `<span class="en-text">Payment cancelled.</span>`;
          } else {
            messageHtml = `<span class="en-text">Payment ${status === 'FAILED' ? 'failed' : 'expired'}.</span>`;
          }

          this.ui.showTerminalMessage(response.orderId || 'N/A', status as any, messageHtml, this._getGlobalHandlers(true));
          this.api.setToken(null);
          this._triggerEvent({
            success: status === 'SUCCESS',
            failed: status === 'FAILED',
            expired: status === 'EXPIRED',
            cancelled: status === 'CANCELLED',
            orderId: response.orderId,
            vendorQrRefId: actualRefId
          });
        }
      } catch (error) { }
    };
    checkStatus();
    this.pollIntervalId = window.setInterval(checkStatus, this.POLL_INTERVAL_MS);
  }

  protected _startCountdown(orderId: string, expireAt: number): void {
    if (this.countdownIntervalId !== undefined) window.clearInterval(this.countdownIntervalId);
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
        this._cleanup();
        this._clearCache();
        this.ui.showTerminalMessage(orderId, 'EXPIRED', '<span class="en-text">Time expired.</span>', this._getGlobalHandlers(true));
        this._triggerEvent({expired: true, orderId});
      }
    }, 1000);
  }
}

if (typeof window !== 'undefined') {
  (window as any).MMPaySDK = MMPaySDK;
}
