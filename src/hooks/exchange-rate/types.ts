
// Types and interfaces for the exchange rate calculator
export interface ExchangeRateCalculatorState {
  sendAmount: string;
  receiveAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  isProcessing: boolean;
}

export interface UseExchangeRateCalculatorReturn extends ExchangeRateCalculatorState {
  setSendAmount: (amount: string) => void;
  setSourceCurrency: (currency: string) => void;
  setTargetCurrency: (currency: string) => void;
  isProcessing: boolean;
  authLoading: boolean;
  countriesLoading: boolean;
  sourceCurrencies: string[];
  targetCurrencies: string[];
  handleContinue: () => void;
}

export interface ExchangeRateCalculatorOptions {
  onContinue?: () => void;
}
