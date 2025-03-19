
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PromotionSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const PromotionSearch = ({ searchTerm, setSearchTerm }: PromotionSearchProps) => {
  return (
    <div className="flex items-center gap-2">
      <Search className="w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search promotions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs"
      />
    </div>
  );
};

export default PromotionSearch;
