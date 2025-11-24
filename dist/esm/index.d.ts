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
    private readonly QR_SIZE;
    constructor(publishableKey: string, options?: SDKOptions);
    private _callApi;
    createPaymentRequest(payload: PaymentData): Promise<CreatePaymentResponse>;
    showPaymentModal(payload: PaymentData, onComplete: (result: PolliongResult) => void): Promise<void>;
    private _showTerminalMessage;
    private _cleanupModal;
    private _injectQrScript;
    private _renderModalContent;
    /**
     * _startPolling
     * @param _id
     * @param onComplete
     */
    private _startPolling;
}
