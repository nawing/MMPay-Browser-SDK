import { ICreatePaymentRequestParams, IModalEventResult } from '../types';
/**
 * @deprecated This method is deprecated. Please migrate to the .pay() method.
 */
export declare function legacyShowPaymentModal(this: any, // Binds the parent MMPaySDK instance context
params: ICreatePaymentRequestParams, onComplete: (result: IModalEventResult) => void): Promise<void>;
