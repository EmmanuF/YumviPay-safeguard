
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  setShowAdvanced: (value: boolean) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ 
  showAdvanced,
  setShowAdvanced
}) => {
  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="advanced" 
            checked={showAdvanced} 
            onCheckedChange={setShowAdvanced}
          />
          <Label htmlFor="advanced">Show advanced options</Label>
        </div>
      </div>
      
      {showAdvanced && (
        <div className="space-y-4 mt-4 p-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-1" />
            <p className="text-sm text-muted-foreground">
              Advanced options are for testing purposes only and may affect transaction processing.
            </p>
          </div>
          
          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              value="https://api.yumvi-pay.com/webhooks/kado"
              readOnly
              className="mt-1 font-mono text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="delay">Simulated Response Delay (ms)</Label>
            <Input
              id="delay"
              type="number"
              defaultValue="1000"
              min="0"
              max="10000"
              className="mt-1"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedOptions;
