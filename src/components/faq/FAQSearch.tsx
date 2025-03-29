
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FAQSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FAQSearch: React.FC<FAQSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-10 max-w-lg mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for questions..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default FAQSearch;
