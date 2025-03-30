
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExchangeRateCalculator } from '@/hooks/useExchangeRateCalculator';
import { RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ExchangeRateCalculator: React.FC = () => {
  const {
    sendAmount,
    setSendAmount,
    receiveAmount,
    sourceCurrency,
    setSourceCurrency,
    targetCurrency,
    setTargetCurrency,
    exchangeRate,
    handleContinue,
    isProcessing,
    sourceCurrencies,
    targetCurrencies,
    isLoadingRate,
    lastRateUpdate,
    refreshRate,
    rateLimitReached
  } = useExchangeRateCalculator();

  // Format last updated time
  const formattedLastUpdate = lastRateUpdate 
    ? formatDistanceToNow(lastRateUpdate, { addSuffix: true }) 
    : 'never';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Currency Exchange</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">You send</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                className="flex-1"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />
              <Select value={sourceCurrency} onValueChange={setSourceCurrency}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder={sourceCurrency} />
                </SelectTrigger>
                <SelectContent>
                  {sourceCurrencies.map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">They receive</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0.00"
                className="flex-1"
                value={receiveAmount}
                readOnly
              />
              <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder={targetCurrency} />
                </SelectTrigger>
                <SelectContent>
                  {targetCurrencies.map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isLoadingRate && !rateLimitReached ? (
                <span className="flex items-center">
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  Updating rate...
                </span>
              ) : (
                <>1 {sourceCurrency} = {exchangeRate.toFixed(4)} {targetCurrency}</>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshRate}
              disabled={isLoadingRate && !rateLimitReached}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingRate && !rateLimitReached ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {lastRateUpdate && (
            <div className="text-xs text-center text-muted-foreground">
              {rateLimitReached ? (
                "Rate fixed - API quota reached"
              ) : (
                `Last updated: ${formattedLastUpdate}`
              )}
            </div>
          )}
          
          <Button className="w-full" onClick={handleContinue} disabled={isProcessing}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExchangeRateCalculator;
