export interface PaymentData {
    amount: number;
    currency: string;
    orderId: string;
    callbackUrl?: string;
}
export interface CreatePaymentResponse {
    _id: string;
    amount: number;
    orderId: string;
    currency: string;
    transactionId: string;
    qr: string;
    url: string;
}
export interface PollingResponse {
    _id: string;
    appId: string;
    orderId: string;
    amount: number;
    currency: string;
    method?: string;
    vendor?: string;
    callbackUrl?: string;
    callbackUrlStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
    callbackAt?: Date;
    disbursementStatus?: 'NONE' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    disburseAt?: Date;
    items: {
        name: string;
        amount: number;
        quantity: number;
    }[];
    merchantId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
    createdAt: Date;
    transactionRefId?: string;
    qr?: string;
    redirectUrl?: string;
}
export interface PolliongResult {
    success: boolean;
    transaction: PollingResponse;
}
export interface SDKOptions {
    pollInterval?: number;
    environment?: 'sandbox' | 'production';
    baseUrl?: string;
    merchantName?: string;
}
export declare class MMPaySDK {
    private POLL_INTERVAL_MS;
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
    constructor(publishableKey: string, options?: SDKOptions);
    /**
     * _callApi
     * @param endpoint
     * @param data
     * @returns
     */
    private _callApi;
    /**
     * createPaymentRequest
     * @param {PaymentData} payload
     * @returns
     */
    createPaymentRequest(payload: PaymentData): Promise<CreatePaymentResponse>;
    /**
     * _createAndRenderModal
     * @param {string} contentHtml
     * @param isTerminal
     * @returns
     */
    private _createAndRenderModal;
    /**
     * showPaymentModal
     * @param {PaymentData} payload
     * @param {Function} onComplete
     */
    showPaymentModal(payload: PaymentData, onComplete: (result: PolliongResult) => void): Promise<void>;
    /**
     * _renderQrModalContent
     * @param {CreatePaymentResponse} apiResponse
     * @param {PaymentData} payload
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
     * @param restoreBodyScroll
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
     * @param {string} _id
     * @param {Function} onComplete
     */
    private _startPolling;
}
