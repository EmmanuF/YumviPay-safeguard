
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { AdminCountry } from '@/services/admin/countries/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CountryStatusBadge from './CountryStatusBadge';
import PaymentMethodsList from './PaymentMethodsList';
import { parsePaymentMethods } from '@/utils/paymentMethodUtils';

interface CountryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: AdminCountry | null;
  onEditPaymentMethods: () => void;
}

const CountryDetailsDialog: React.FC<CountryDetailsDialogProps> = ({
  open,
  onOpenChange,
  country,
  onEditPaymentMethods
}) => {
  if (!country) return null;
  
  // Parse payment methods safely
  const parsedPaymentMethods = parsePaymentMethods(country.payment_methods);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{country.flag_emoji || '🌐'}</span>
            <span>{country.name}</span>
          </DialogTitle>
          <DialogDescription>
            Country code: {country.code}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2" variant="pills">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="font-medium">{country.currency_symbol} {country.currency}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="font-medium">{country.code}</p>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex flex-col gap-2">
                <CountryStatusBadge 
                  enabled={country.is_sending_enabled} 
                  type="sending" 
                />
                <CountryStatusBadge 
                  enabled={country.is_receiving_enabled} 
                  type="receiving" 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Payment Methods</h3>
              <Button size="sm" onClick={onEditPaymentMethods}>
                Edit Payment Methods
              </Button>
            </div>
            
            <PaymentMethodsList methods={parsedPaymentMethods} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CountryDetailsDialog;
