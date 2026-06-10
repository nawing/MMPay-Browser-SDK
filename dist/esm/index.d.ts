import { MMPayAPI } from './api';
import { DeprecatedMMPayAPI } from './deprecated/api';
import { ICreatePaymentRequestParams, IModalEventResult, IPollingRequest, SDKOptions } from './types';
import { MMPayUI } from './ui';
export declare class MMPaySDK {
    private POLL_INTERVAL_MS;
    private readonly TIMEOUT_SECONDS;
    private readonly CACHE_KEY;
    private environment;
    protected merchantName: string;
    private onCompleteCallback;
    private pollIntervalId;
    private countdownIntervalId;
    private pendingApiResponse;
    private pendingPaymentPayload;
    protected api: MMPayAPI;
    protected legacyApi: DeprecatedMMPayAPI | null;
    protected ui: MMPayUI;
    constructor(publishableKey: string, options?: SDKOptions);
    /**
     * Backward-Compatible UI Trigger
     */
    showPaymentModal(params: ICreatePaymentRequestParams, onComplete: (result: IModalEventResult) => void): Promise<void>;
    /**
     * Modern Tokenized Payload Flow
     */
    pay(orderId: string, onComplete: (result: IModalEventResult) => void): Promise<void>;
    protected _getGlobalHandlers(isTerminal?: boolean): {
        MMPayToggleLang: (lang: string) => void;
        MMPayReRenderModal: () => void;
        MMPayCloseModal: (forceClose?: boolean) => Promise<void>;
    };
    protected _triggerEvent(eventData: IModalEventResult): void;
    protected _cleanup(): void;
    protected _clearCache(): void;
    private _checkAndAutoResume;
    private _resumePaymentState;
    protected _startPolling(payload: IPollingRequest): Promise<void>;
    protected _startCountdown(orderId: string, expireAt: number): void;
}
