
import React from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  fees?: string;
  processingTime?: string;
}

interface PaymentMethodsListProps {
  methods: PaymentMethod[];
}

const getIcon = (iconName: string | undefined) => {
  switch (iconName) {
    case 'credit-card':
      return <CreditCard className="h-4 w-4 mr-2" />;
    case 'smartphone':
      return <Smartphone className="h-4 w-4 mr-2" />;
    case 'bank':
      return <Building2 className="h-4 w-4 mr-2" />;
    default:
      return <Wallet className="h-4 w-4 mr-2" />;
  }
};

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({ methods }) => {
  if (!methods || methods.length === 0) {
    return <p className="text-sm text-muted-foreground">No payment methods configured</p>;
  }

  return (
    <div className="space-y-3">
      {methods.map((method, index) => (
        <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-gray-50">
          <div className="mt-1">{getIcon(method.icon)}</div>
          <div className="flex-1">
            <div className="font-medium">{method.name}</div>
            {method.description && (
              <p className="text-sm text-muted-foreground">{method.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {method.fees && (
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                  Fees: {method.fees}
                </Badge>
              )}
              {method.processingTime && (
                <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                  {method.processingTime}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodsList;
