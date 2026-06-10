import {ICreatePaymentRequestParams, ICreatePaymentResponse, ICreateTokenRequestParams, ICreateTokenResponse} from '../types';

export class XMMPayAPI {
  private baseUrl = 'https://ezapi.myanmyanpay.com';
  private environment: 'sandbox' | 'production';
  private publishableKey: string;
  private tokenKey: string | null = null;

  constructor(environment: 'sandbox' | 'production', publishableKey: string) {
    this.environment = environment;
    this.publishableKey = publishableKey;
  }

  public setToken(token: string | null): void {this.tokenKey = token;}

  private async call<T>(endpoint: string, data: object = {}): Promise<T> {
    const headers: any = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.publishableKey}`
    };
    if (this.tokenKey) headers['X-MMPay-Btoken'] = this.tokenKey;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST', headers, body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`Legacy API Error: ${await response.text()}`);
    return response.json() as Promise<T>;
  }

  public async createToken(payload: ICreateTokenRequestParams): Promise<ICreateTokenResponse> {
    return this.call<ICreateTokenResponse>(`/xpayments/${this.environment}-token-request`, payload);
  }

  public async createPayment(payload: ICreatePaymentRequestParams): Promise<ICreatePaymentResponse> {
    return this.call<ICreatePaymentResponse>(`/xpayments/${this.environment}-payment-create`, payload);
  }
}
