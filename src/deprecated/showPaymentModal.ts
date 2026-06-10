import {MMPaySDK} from '../index';
import {ICreatePaymentRequestParams, IModalEventResult} from '../types';
import {DeprecatedMMPayAPI} from './api';

export class DeprecatedMMPaySDK extends MMPaySDK {
  private legacyApi: DeprecatedMMPayAPI;

  constructor(publishableKey: string, options: any = {}) {
    super(publishableKey, options);
    const env = publishableKey.includes('pk_test') ? 'sandbox' : 'production';
    this.legacyApi = new DeprecatedMMPayAPI(env, publishableKey);
  }

  public async showPaymentModal(
    params: ICreatePaymentRequestParams,
    onComplete: (result: IModalEventResult) => void
  ): Promise<void> {
    console.warn("[MMPaySDK] showPaymentModal() is deprecated. Please migrate to pay().");

    this.ui.renderPreloadScreen(this._getGlobalHandlers());

    try {
      const nonce = new Date().getTime().toString() + '_mmp';

      // 1. LEGACY AUTH & CREATION
      const tokenResponse = await this.legacyApi.createToken({
        amount: params.amount,
        orderId: params.orderId,
        nonce
      });
      this.legacyApi.setToken(tokenResponse.token);
      const apiResponse: any = await this.legacyApi.createPayment({...params, nonce});


      // 2. MODERN AUTH (Bridge to new server for polling)
      const modernTokenResponse = await this.api.createToken({
        amount: params.amount,
        orderId: params.orderId,
        nonce: nonce + '_bridge'
      });
      this.api.setToken(modernTokenResponse.token);

      // 3. Normalization & Render
      const actualRefId = apiResponse?.vendorQrRefId || apiResponse?.transactionRefId;
      apiResponse.vendorQrRefId = actualRefId;

      if (apiResponse && apiResponse.qr && actualRefId) {
        this.ui.renderQrModalContent(apiResponse, params.orderId, this.merchantName, this._getGlobalHandlers());

        this._startPolling({orderId: params.orderId, nonce: nonce + '_poll'});
        this._startCountdown(params.orderId, Date.now() + 300000);

        this._triggerEvent({created: true, orderId: params.orderId, vendorQrRefId: actualRefId});
      } else {
        throw new Error("Invalid API Response: Missing QR Data.");
      }
    } catch (error: any) {
      this.legacyApi.setToken(null);
      this.ui.showTerminalMessage(params.orderId, 'FAILED', `<span class="en-text">${error?.message}</span>`, this._getGlobalHandlers(true));
      this._triggerEvent({failed: true, orderId: params.orderId});
    }
  }
}
