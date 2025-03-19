
// Define types used across exchange rate calculator hooks
export interface ExchangeRateCalculatorState {
  sendAmount: string;
  receiveAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  isProcessing: boolean;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
}
