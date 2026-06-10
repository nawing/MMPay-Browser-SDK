import { ICreatePaymentRequestParams, ICreatePaymentResponse, ICreateTokenRequestParams, ICreateTokenResponse } from '../types';
export declare class DeprecatedMMPayAPI {
    private baseUrl;
    private environment;
    private publishableKey;
    private tokenKey;
    constructor(environment: 'sandbox' | 'production', publishableKey: string);
    setToken(token: string | null): void;
    private call;
    createToken(payload: ICreateTokenRequestParams): Promise<ICreateTokenResponse>;
    createPayment(payload: ICreatePaymentRequestParams): Promise<ICreatePaymentResponse>;
}
