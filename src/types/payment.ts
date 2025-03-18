
export interface PaymentProvider {
  id: string;
  name: string;
  logo?: string;
  processingTime?: string;
  fees?: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  limits?: {
    min: number;
    max: number;
    currency: string;
  };
  supportPhone?: string;
  instructions?: string[];
}
