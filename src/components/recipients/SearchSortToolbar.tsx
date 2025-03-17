
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, SortAsc } from 'lucide-react';
import { SortOption } from '@/utils/recipientUtils';

interface SearchSortToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const SearchSortToolbar: React.FC<SearchSortToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search recipients..."
          className="pl-9 pr-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="absolute right-2.5 top-2.5"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      
      <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
        <SelectTrigger className="w-auto">
          <SortAsc className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Favorites & Recent</SelectItem>
          <SelectItem value="latest">Latest Used</SelectItem>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="frequent">Most Frequent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchSortToolbar;
