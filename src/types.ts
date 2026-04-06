export interface Product {
  id: number;
  name: string;
  nameEn?: string;
  priceUsd: number;
  duration?: string;
  image: string;
  category: 'rent' | 'credit' | 'server';
  minQty?: number;
  maxQty?: number;
  sizeOptions?: string[];
  sizePrices?: { [key: string]: number };
  tooltip?: string;
  requiresSN?: boolean;
  downloadLink?: string;
}

export type Language = 'ar' | 'en';
export type Currency = 'USD' | 'EGP';
export type OrderStatus = 'pending' | 'accepted' | 'rejected';
export type RemoteTool = 'ultra' | 'anydesk';
export type PaymentType = 'vodafone' | 'binance' | 'instapay';
