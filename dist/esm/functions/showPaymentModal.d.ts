import { ICreatePaymentRequestParams, IModalEventResult } from '../types';
/**
 * @showPaymentModal
 */
export declare function showPaymentModal(this: any, // Binds the parent MMPaySDK instance context
params: ICreatePaymentRequestParams, onComplete: (result: IModalEventResult) => void): Promise<void>;
