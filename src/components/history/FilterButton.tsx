
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionStatus } from '@/types/transaction';

interface FilterButtonProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  hasActiveFilters: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({ 
  showFilters, 
  setShowFilters, 
  hasActiveFilters 
}) => {
  return (
    <Button 
      variant="outline" 
      size="icon"
      className={hasActiveFilters ? "bg-primary text-primary-foreground" : ""}
      onClick={() => setShowFilters(!showFilters)}
    >
      <Filter className="h-4 w-4" />
    </Button>
  );
};

export default FilterButton;
