import { MMPaySDK } from '../index';
import { ICreatePaymentRequestParams, IModalEventResult } from '../types';
export declare class DeprecatedMMPaySDK extends MMPaySDK {
    private legacyApi;
    constructor(publishableKey: string, options?: any);
    showPaymentModal(params: ICreatePaymentRequestParams, onComplete: (result: IModalEventResult) => void): Promise<void>;
}
