
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExchangeRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: { from: string, to: string, rate: number }[];
}

const ExchangeRatesModal: React.FC<ExchangeRatesModalProps> = ({ isOpen, onClose, rates }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl animate-in fade-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Exchange Rates</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <ScrollArea className="p-4 max-h-[calc(80vh-100px)]">
          <div className="space-y-2">
            {rates.map((rate, index) => (
              <div 
                key={index} 
                className="flex justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">1 {rate.from}</span>
                  <span className="text-gray-500">→</span>
                  <span className="font-medium">{rate.rate.toFixed(2)} {rate.to}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRatesModal;
