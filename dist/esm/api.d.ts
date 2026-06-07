import { ICancelPaymentRequestParams, ICancelPaymentResponse, ICreatePaymentRequestParams, ICreatePaymentResponse, ICreateTokenRequestParams, ICreateTokenResponse, IPaymentShowRequestParams, IPaymentShowResponse, IPollingRequest, IPollingResponse } from './types';
export declare class MMPayAPI {
    private baseUrl;
    private environment;
    private publishableKey;
    private tokenKey;
    constructor(baseUrl: string, environment: 'sandbox' | 'production', publishableKey: string);
    setToken(token: string | null): void;
    getToken(): string | null;
    private call;
    createToken(payload: ICreateTokenRequestParams): Promise<ICreateTokenResponse>;
    createPayment(payload: ICreatePaymentRequestParams): Promise<ICreatePaymentResponse>;
    showPayment(payload: IPaymentShowRequestParams): Promise<IPaymentShowResponse>;
    cancelPayment(payload: ICancelPaymentRequestParams): Promise<ICancelPaymentResponse>;
    pollPayment(payload: IPollingRequest): Promise<IPollingResponse>;
}
