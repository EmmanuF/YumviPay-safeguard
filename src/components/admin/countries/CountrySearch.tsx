
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CountrySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CountrySearch: React.FC<CountrySearchProps> = ({
  searchTerm,
  onSearchChange
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
    </div>
  );
};

export default CountrySearch;
