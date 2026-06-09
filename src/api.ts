import {
  ICancelPaymentRequestParams,
  ICancelPaymentResponse,
  ICreateTokenRequestParams,
  ICreateTokenResponse,
  IPaymentShowRequestParams,
  IPaymentShowResponse,
  IPollingRequest,
  IPollingResponse
} from './types';

export class MMPayAPI {
  private baseUrl: string;
  private environment: 'sandbox' | 'production';
  private publishableKey: string;
  private tokenKey: string | null = null;

  constructor(baseUrl: string, environment: 'sandbox' | 'production', publishableKey: string) {
    this.baseUrl = baseUrl;
    this.environment = environment;
    this.publishableKey = publishableKey;
  }

  public setToken(token: string | null): void {
    this.tokenKey = token;
  }

  public getToken(): string | null {
    return this.tokenKey;
  }

  private async call<T>(endpoint: string, data: object = {}): Promise<T> {
    let headers: any = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.publishableKey}`
    };

    if (this.tokenKey) {
      headers['X-MMPay-Btoken'] = this.tokenKey;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${response.statusText}. Details: ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  public async createToken(payload: ICreateTokenRequestParams): Promise<ICreateTokenResponse> {
    const endpoint = `/xpayments/${this.environment}-token-request`;
    return this.call<ICreateTokenResponse>(endpoint, payload);
  }

  public async showPayment(payload: IPaymentShowRequestParams): Promise<IPaymentShowResponse> {
    const endpoint = `/xpayments/${this.environment}-payment-show`;
    return this.call<IPaymentShowResponse>(endpoint, payload);
  }

  public async cancelPayment(payload: ICancelPaymentRequestParams): Promise<ICancelPaymentResponse> {
    const endpoint = `/xpayments/${this.environment}-payment-cancel`;
    return this.call<ICancelPaymentResponse>(endpoint, payload);
  }

  public async pollPayment(payload: IPollingRequest): Promise<IPollingResponse> {
    const endpoint = `/xpayments/${this.environment}-payment-polling`;
    return this.call<IPollingResponse>(endpoint, payload);
  }
}
