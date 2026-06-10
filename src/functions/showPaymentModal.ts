import {ICreatePaymentRequestParams, IModalEventResult} from '../types';

export async function showPaymentModal(
  this: any,
  params: ICreatePaymentRequestParams,
  onComplete: (result: IModalEventResult) => void
): Promise<void> {
  this.onCompleteCallback = onComplete;

  this.ui.renderPreloadScreen(this._getGlobalHandlers());

  try {
    const nonce = new Date().getTime().toString() + '_mmp';

    const tokenResponse = await this.xApi.createToken({
      amount: params.amount,
      orderId: params.orderId,
      nonce
    });
    this.xApi.setToken(tokenResponse.token);

    const apiResponse: any = await this.xApi.createPayment({...params, nonce});

    const modernTokenResponse = await this.api.createToken({
      amount: params.amount,
      orderId: params.orderId,
      nonce: nonce + '_bridge'
    });
    this.api.setToken(modernTokenResponse.token);

    const actualRefId = apiResponse?.vendorQrRefId || apiResponse?.transactionRefId;

    if (apiResponse && apiResponse.qr && actualRefId) {
      apiResponse.vendorQrRefId = actualRefId;

      this.pendingPaymentPayload = {...params, nonce};
      this.pendingApiResponse = apiResponse;
      const expireAt = Date.now() + 300000;

      this.ui.renderQrModalContent(apiResponse, params.orderId, this.merchantName, this._getGlobalHandlers());

      this._startPolling({orderId: params.orderId, nonce: nonce + '_poll'});
      this._startCountdown(params.orderId, expireAt);

      this._triggerEvent({
        created: true,
        orderId: params.orderId,
        vendorQrRefId: actualRefId,
        amount: params.amount
      });
    } else {
      throw new Error("Invalid API Response: Missing QR Data.");
    }
  } catch (error: any) {
    if (this.xApi) this.xApi.setToken(null);
    const terminalMsg = `<span class="en-text">${error?.message || 'Error occurred.'}</span>`;
    this.ui.showTerminalMessage(params.orderId, 'FAILED', terminalMsg, this._getGlobalHandlers(true));
    this._triggerEvent({
      failed: true,
      orderId: params.orderId,
      amount: params.amount
    });
  }
}
