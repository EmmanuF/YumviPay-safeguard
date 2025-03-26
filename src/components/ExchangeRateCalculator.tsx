
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ExchangeRateCalculator: React.FC = () => {
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
                disabled
              />
              <Select disabled>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">They receive</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                className="flex-1"
                disabled
              />
              <Select disabled>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="XAF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xaf">XAF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="w-full" disabled>
            Continue
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            This feature is currently being reimplemented.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExchangeRateCalculator;
