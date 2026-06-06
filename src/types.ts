export interface SDKOptions {
  pollInterval?: number;
  environment?: 'sandbox' | 'production';
  baseUrl?: string;
  merchantName?: string;
}

export interface ICreateTokenRequestParams {
  amount: number;
  orderId: string;
  nonce?: string;
}
export interface ICreateTokenResponse {
  orderId: string;
  token: string;
}
export interface ICreatePaymentRequestParams {
  amount: number;
  orderId: string;
  callbackUrl?: string;
  nonce?: string;
  customMessage?: string;
}
export interface ICreatePaymentResponse {
  amount: number;
  orderId: string;
  currency?: string;
  transactionRefId: string;
  qr: string;
}

export interface ICancelPaymentRequestParams {
  orderId: string;
  nonce?: string;
}
export interface ICancelPaymentResponse {
  amount: number;
  orderId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'EXPIRED';
  vendorQrRefId: string;
}

export interface IExpiryPaymentRequestParams {
  orderId: string;
  nonce?: string;
}
export interface IExpiryPaymentResponse {
  amount: number;
  orderId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'EXPIRED';
  vendorQrRefId: string;
}



export interface IPollingRequest {
  amount: number;
  currency?: string;
  orderId: string;
  callbackUrl?: string;
  nonce?: string;
}
export interface IPollingResponse {
  orderId: string;
  transactionRefId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'EXPIRED';
}
export interface PolliongResult {
  success: boolean;
  transaction: IPollingResponse;
}
