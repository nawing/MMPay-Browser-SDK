export interface IDesignOptions {
  mode?: 'light' | 'dark' | 'light-translucent' | 'dark-translucent';
  color?: string;
}

export interface SDKOptions {
  baseUrl?: string;
  environment?: 'sandbox' | 'production';
  merchantName?: string;
  pollInterval?: number;
  design?: IDesignOptions;
}

export interface ICreateTokenRequestParams {
  amount?: number;
  orderId: string;
  nonce: string;
}

export interface ICreateTokenResponse {
  token: string;
}

export interface ICreatePaymentRequestParams {
  amount: number;
  orderId: string;
  callbackUrl?: string;
  customMessage?: string;
  nonce: string;
}

export interface ICreatePaymentResponse {
  orderId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'EXPIRED';
  currency: string;
  vendorQrRefId: string;
  qr: string;
  createdAt: string;
}

export interface IPaymentShowRequestParams {
  orderId: string;
  nonce: string;
}

export interface IPaymentShowResponse {
  orderId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'EXPIRED';
  currency: string;
  vendorQrRefId: string;
  qr: string;
  createdAt: string;
}

export interface ICancelPaymentRequestParams {
  orderId: string;
  nonce: string;
}

export interface ICancelPaymentResponse {
  success: boolean;
}

export interface IPollingRequest {
  orderId: string;
  nonce: string;
}

export interface IPollingResponse {
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'EXPIRED';
  vendorQrRefId?: string;
  orderId?: string;
}

export interface IModalEventResult {
  success?: boolean;
  created?: boolean;
  cancelled?: boolean;
  expired?: boolean;
  failed?: boolean;
  orderId?: string;
  vendorQrRefId?: string;
}
