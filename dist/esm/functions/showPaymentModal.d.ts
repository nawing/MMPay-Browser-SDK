import { ICreatePaymentRequestParams, IModalEventResult } from '../types';
export declare function showPaymentModal(this: any, params: ICreatePaymentRequestParams, onComplete: (result: IModalEventResult) => void): Promise<void>;
