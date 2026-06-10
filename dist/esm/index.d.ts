import { MMPayAPI } from './api';
import { IModalEventResult, IPollingRequest, SDKOptions } from './types';
import { MMPayUI } from './ui';
export declare class MMPaySDK {
    protected POLL_INTERVAL_MS: number;
    protected readonly TIMEOUT_SECONDS: number;
    protected readonly CACHE_KEY: string;
    protected environment: 'sandbox' | 'production';
    protected merchantName: string;
    protected onCompleteCallback: ((result: IModalEventResult) => void) | null;
    protected pollIntervalId: number | undefined;
    protected countdownIntervalId: number | undefined;
    protected pendingApiResponse: any | null;
    protected pendingPaymentPayload: any | null;
    protected api: MMPayAPI;
    protected ui: MMPayUI;
    constructor(publishableKey: string, options?: SDKOptions);
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
