
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CountrySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch?: () => void;
}

const CountrySearch: React.FC<CountrySearchProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search countries..."
        className="pl-8 w-[250px]"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && onClearSearch && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
          onClick={onClearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CountrySearch;
