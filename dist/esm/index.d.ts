export interface ICorePayParams {
    amount: number;
    orderId: string;
    callbackUrl?: string;
}
export interface ICreatePaymentRequestParams {
    amount: number;
    currency?: string;
    orderId: string;
    callbackUrl?: string;
    nonce?: string;
}
export interface ICreatePaymentResponse {
    _id: string;
    amount: number;
    orderId: string;
    currency?: string;
    transactionRefId: string;
    qr: string;
}
export interface ICreateTokenRequestParams {
    amount: number;
    currency?: string;
    orderId: string;
    callbackUrl?: string;
    nonce?: string;
}
export interface ICreateTokenResponse {
    orderId: string;
    token: string;
}
export interface IPollingRequest {
    amount: number;
    currency?: string;
    orderId: string;
    callbackUrl?: string;
    nonce?: string;
}
export interface IPollingResponse {
    orderId: string;
    transactionRefId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
}
export interface PolliongResult {
    success: boolean;
    transaction: IPollingResponse;
}
export interface SDKOptions {
    pollInterval?: number;
    environment?: 'sandbox' | 'production';
    baseUrl?: string;
    merchantName?: string;
}
export declare class MMPaySDK {
    private POLL_INTERVAL_MS;
    private tokenKey;
    private publishableKey;
    private baseUrl;
    private merchantName;
    private environment;
    private pollIntervalId;
    private onCompleteCallback;
    private overlayElement;
    private pendingApiResponse;
    private pendingPaymentPayload;
    private readonly QR_SIZE;
    /**
     * constructor
     * @param publishableKey
     * @param options
     */
    constructor(publishableKey: string, options?: SDKOptions);
    /**
     * _callApi
     * @param endpoint
     * @param data
     * @returns
     */
    private _callApi;
    /**
     * _callApiTokenRequest
     * @param {ICreateTokenRequestParams} payload
     * @param {number} payload.amount
     * @param {string} payload.currency
     * @param {string} payload.orderId
     * @param {string} payload.nonce
     * @param {string} payload.callbackUrl
     * @returns {Promise<ICreateTokenResponse>}
     */
    private _callApiTokenRequest;
    /**
     * _callApiPaymentRequest
     * @param {ICreatePaymentRequestParams} payload
     * @param {number} payload.amount
     * @param {string} payload.currency
     * @param {string} payload.orderId
     * @param {string} payload.nonce
     * @param {string} payload.callbackUrl
     * @returns {Promise<ICreatePaymentResponse>}
     */
    private _callApiPaymentRequest;
    /**
     * createPayment
     * @param {ICorePayParams} params
     * @param {number} params.amount
     * @param {string} params.orderId
     * @param {string} params.callbackUrl
     * @returns {Promise<ICreatePaymentResponse>}
     */
    createPayment(params: ICorePayParams): Promise<ICreatePaymentResponse>;
    /**
     * showPaymentModal
     * @param {ICorePayParams} params
     * @param {number} params.amount
     * @param {string} params.orderId
     * @param {string} params.callbackUrl
     * @param {Function} onComplete
     */
    showPaymentModal(params: ICorePayParams, onComplete: (result: PolliongResult) => void): Promise<void>;
    /**
     * _createAndRenderModal
     * @param {string} contentHtml
     * @param {boolean} isTerminal
     * @returns
     */
    private _createAndRenderModal;
    /**
     * _renderQrModalContent
     * @param {ICreatePaymentResponse} apiResponse
     * @param {CreatePaymentRequest} payload
     * @param {string} merchantName
     */
    private _renderQrModalContent;
    /**
     * _showTerminalMessage
     * @param {string} orderId
     * @param {string} status
     * @param {string} message
     */
    private _showTerminalMessage;
    /**
     * _showCancelConfirmationModal
     */
    private _showCancelConfirmationModal;
    /**
     * _reRenderPendingModalInstance
     */
    private _reRenderPendingModalInstance;
    /**
     * Cleans up the modal and stops polling.
     * @param {boolean} restoreBodyScroll
     */
    private _cleanupModal;
    /**
     * _injectQrScript
     * @param {string} qrData
     * @param {string} qrCanvasId
     */
    private _injectQrScript;
    /**
     * _startPolling
     * @param {IPollingRequest} payload
     * @param {number} payload.amount
     * @param {string} payload.currency
     * @param {string} payload.orderId
     * @param {string} payload.nonce
     * @param {string} payload.callbackUrl
     * @param {Function} onComplete
     */
    private _startPolling;
}
