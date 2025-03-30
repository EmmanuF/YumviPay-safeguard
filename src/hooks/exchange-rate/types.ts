
export interface RateCalculationProps {
  sendAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
}

export interface UseExchangeRateCalculatorReturn {
  sendAmount: string;
  setSendAmount: (amount: string) => void;
  receiveAmount: string;
  sourceCurrency: string;
  setSourceCurrency: (currency: string) => void;
  targetCurrency: string;
  setTargetCurrency: (currency: string) => void;
  exchangeRate: number;
  isProcessing: boolean;
  authLoading: boolean;
  countriesLoading: boolean;
  sourceCurrencies: string[];
  targetCurrencies: string[];
  handleContinue: () => void;
  isLoadingRate?: boolean;
  lastRateUpdate?: Date | null;
}

export interface ExchangeRateCalculatorOptions {
  onContinue?: (data: {
    sendAmount: string;
    receiveAmount: string;
    sourceCurrency: string;
    targetCurrency: string;
    exchangeRate: number;
  }) => void;
}
