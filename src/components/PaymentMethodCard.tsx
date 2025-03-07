
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethodCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  onClick: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  name,
  description,
  icon,
  isSelected = false,
  onClick,
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "glass-effect w-full rounded-xl p-4 flex items-center justify-between cursor-pointer",
        "transition-all duration-200 mb-3",
        isSelected 
          ? "ring-2 ring-primary-500 shadow-md" 
          : "hover:bg-white/90 hover:shadow-md"
      )}
    >
      <div className="flex items-center">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mr-4",
          isSelected ? "bg-primary-100" : "bg-gray-100"
        )}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-foreground">{name}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight className={cn(
        "w-5 h-5 transition-colors",
        isSelected ? "text-primary-500" : "text-gray-400"
      )} />
    </motion.div>
  );
};

export default PaymentMethodCard;
