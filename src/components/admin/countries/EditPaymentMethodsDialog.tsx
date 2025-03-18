
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { AdminCountry } from '@/services/admin/adminCountryService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import PaymentMethodsList from './PaymentMethodsList';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fees: string;
  processingTime: string;
}

interface EditPaymentMethodsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: AdminCountry | null;
  onSave: (countryCode: string, methods: PaymentMethod[]) => Promise<void>;
}

const PAYMENT_ICONS = [
  { label: 'Credit Card', value: 'credit-card' },
  { label: 'Mobile Phone', value: 'smartphone' },
  { label: 'Bank', value: 'bank' },
  { label: 'Wallet', value: 'wallet' },
];

const EditPaymentMethodsDialog: React.FC<EditPaymentMethodsDialogProps> = ({
  open,
  onOpenChange,
  country,
  onSave
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    country?.payment_methods || []
  );
  
  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
    id: '',
    name: '',
    description: '',
    icon: 'credit-card',
    fees: '',
    processingTime: ''
  });
  
  const resetNewMethod = () => {
    setNewMethod({
      id: '',
      name: '',
      description: '',
      icon: 'credit-card',
      fees: '',
      processingTime: ''
    });
  };
  
  const handleAddMethod = () => {
    if (!newMethod.id || !newMethod.name) return;
    
    setPaymentMethods([
      ...paymentMethods,
      {
        id: newMethod.id as string,
        name: newMethod.name as string,
        description: newMethod.description || '',
        icon: newMethod.icon || 'credit-card',
        fees: newMethod.fees || '1%',
        processingTime: newMethod.processingTime || 'Instant'
      }
    ]);
    
    resetNewMethod();
  };
  
  const handleRemoveMethod = (index: number) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods.splice(index, 1);
    setPaymentMethods(updatedMethods);
  };
  
  const handleSave = async () => {
    if (!country) return;
    
    await onSave(country.code, paymentMethods);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {country?.flag_emoji} Edit Payment Methods for {country?.name}
          </DialogTitle>
          <DialogDescription>
            Configure available payment methods for {country?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 my-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Current Payment Methods</h3>
            {paymentMethods.length > 0 ? (
              <div className="space-y-2">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex-1">
                      <div className="font-medium">{method.name}</div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveMethod(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payment methods configured yet</p>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add New Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Method ID</label>
                <Input 
                  placeholder="mobile_money"
                  value={newMethod.id || ''}
                  onChange={(e) => setNewMethod({...newMethod, id: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Method Name</label>
                <Input 
                  placeholder="Mobile Money"
                  value={newMethod.name || ''}
                  onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Input 
                  placeholder="Send to mobile wallets"
                  value={newMethod.description || ''}
                  onChange={(e) => setNewMethod({...newMethod, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <Select 
                  value={newMethod.icon || 'credit-card'} 
                  onValueChange={(value) => setNewMethod({...newMethod, icon: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_ICONS.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fees</label>
                <Input 
                  placeholder="1.5%"
                  value={newMethod.fees || ''}
                  onChange={(e) => setNewMethod({...newMethod, fees: e.target.value})}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Processing Time</label>
                <Input 
                  placeholder="Instant"
                  value={newMethod.processingTime || ''}
                  onChange={(e) => setNewMethod({...newMethod, processingTime: e.target.value})}
                />
              </div>
            </div>
            
            <Button onClick={handleAddMethod} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentMethodsDialog;
