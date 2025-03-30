
import { CurrencyCode } from "@/types/currency";

export interface RateCalculationProps {
  sendAmount: string;
  sourceCurrency: string;
  targetCurrency: string;
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

export interface UseExchangeRateCalculatorReturn {
  sendAmount: string;
  setSendAmount: (value: string) => void;
  receiveAmount: string;
  sourceCurrency: string;
  setSourceCurrency: (value: string) => void;
  targetCurrency: string;
  setTargetCurrency: (value: string) => void;
  exchangeRate: number;
  isProcessing: boolean;
  authLoading: boolean;
  countriesLoading: boolean;
  sourceCurrencies: string[];
  targetCurrencies: string[];
  handleContinue: () => void;
  isLoadingRate: boolean;
  lastRateUpdate: Date | null;
  refreshRate: () => void;
  rateLimitReached: boolean;
}
