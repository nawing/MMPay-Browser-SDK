export interface SDKOptions {
    pollInterval?: number;
    environment?: 'sandbox' | 'production';
    baseUrl?: string;
    merchantName?: string;
}
export interface ICreateTokenRequestParams {
    amount: number;
    orderId: string;
    nonce?: string;
}
export interface ICreateTokenResponse {
    orderId: string;
    token: string;
}
export interface ICreatePaymentRequestParams {
    amount: number;
    orderId: string;
    callbackUrl?: string;
    nonce?: string;
    customMessage?: string;
}
export interface ICreatePaymentResponse {
    _id: string;
    amount: number;
    orderId: string;
    currency?: string;
    transactionRefId: string;
    qr: string;
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
export declare class MMPaySDK {
    private POLL_INTERVAL_MS;
    private tokenKey;
    private publishableKey;
    private baseUrl;
    private merchantName;
    private environment;
    private pollIntervalId;
    private countdownIntervalId;
    private onCompleteCallback;
    private overlayElement;
    private pendingApiResponse;
    private pendingPaymentPayload;
    private readonly QR_SIZE;
    private readonly TIMEOUT_SECONDS;
    constructor(publishableKey: string, options?: SDKOptions);
    private _callApi;
    private _callApiTokenRequest;
    private _callApiPaymentRequest;
    createPayment(params: ICreatePaymentRequestParams): Promise<ICreatePaymentResponse>;
    showPaymentModal(params: ICreatePaymentRequestParams, onComplete: (result: PolliongResult) => void): Promise<void>;
    private _createAndRenderModal;
    private _renderQrModalContent;
    private _showTerminalMessage;
    private _showCancelConfirmationModal;
    private _reRenderPendingModalInstance;
    private _cleanupModal;
    private _injectQrScript;
    private _startPolling;
    private _startCountdown;
}
