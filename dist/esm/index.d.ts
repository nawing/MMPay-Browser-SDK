import { ICreatePaymentRequestParams, ICreatePaymentResponse, IModalEventResult, SDKOptions } from './types';
export declare class MMPaySDK {
    private POLL_INTERVAL_MS;
    private readonly TIMEOUT_SECONDS;
    private readonly CACHE_KEY;
    private environment;
    private merchantName;
    private onCompleteCallback;
    private pollIntervalId;
    private countdownIntervalId;
    private pendingApiResponse;
    private pendingPaymentPayload;
    private api;
    private ui;
    constructor(publishableKey: string, options?: SDKOptions);
    private _getGlobalHandlers;
    private _triggerEvent;
    private _cleanup;
    private _clearCache;
    private _checkAndAutoResume;
    private _resumePaymentState;
    createPayment(params: ICreatePaymentRequestParams): Promise<ICreatePaymentResponse>;
    showPaymentModal(params: ICreatePaymentRequestParams, onComplete: (result: IModalEventResult) => void): Promise<void>;
    pay(orderId: string, onComplete: (result: IModalEventResult) => void): Promise<void>;
    private _startPolling;
    private _startCountdown;
}
