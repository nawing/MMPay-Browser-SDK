import {ICreatePaymentRequestParams, IModalEventResult} from '../types';

/**
 * @showPaymentModal
 */
export async function showPaymentModal(
  this: any, // Binds the parent MMPaySDK instance context
  params: ICreatePaymentRequestParams,
  onComplete: (result: IModalEventResult) => void
): Promise<void> {

  this.ui.renderPreloadScreen(this._getGlobalHandlers());

  try {
    const nonce = new Date().getTime().toString() + '_mmp';

    // 1. Authenticate & Create on the Legacy Server
    const tokenResponse = await this.xApi.createToken({
      amount: params.amount,
      orderId: params.orderId,
      nonce
    });
    this.xApi.setToken(tokenResponse.token);
    const apiResponse: any = await this.xApi.createPayment({...params, nonce});

    // 2. Authenticate on the Modern Server (Fetch token for polling)
    const modernTokenResponse = await this.api.createToken({
      amount: params.amount,
      orderId: params.orderId,
      nonce: nonce + '_bridge'
    });
    this.api.setToken(modernTokenResponse.token);

    // 3. Normalization & Interface Guarding
    const actualRefId = apiResponse?.vendorQrRefId || apiResponse?.transactionRefId;
    if (apiResponse && apiResponse.qr && actualRefId) {
      apiResponse.vendorQrRefId = actualRefId;

      this.pendingPaymentPayload = {...params, nonce};
      this.pendingApiResponse = apiResponse;

      const expireAt = Date.now() + 300000; // 5 minutes

      this.ui.renderQrModalContent(apiResponse, params.orderId, this.merchantName, this._getGlobalHandlers());

      // Hand over to the parent modern polling machine
      this._startPolling({orderId: params.orderId, nonce: nonce + '_poll'});
      this._startCountdown(params.orderId, expireAt);

      this._triggerEvent({
        created: true,
        orderId: params.orderId,
        vendorQrRefId: actualRefId
      });
    } else {
      throw new Error("Invalid API Response: Missing QR Data.");
    }
  } catch (error: any) {
    if (this.xApi) this.xApi.setToken(null);
    const terminalMsg = `<span class="en-text">${error?.message || 'Error occurred.'}</span>`;
    this.ui.showTerminalMessage(params.orderId, 'FAILED', terminalMsg, this._getGlobalHandlers(true));
    this._triggerEvent({failed: true, orderId: params.orderId});
  }
}
