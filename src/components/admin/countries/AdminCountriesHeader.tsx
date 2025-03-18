
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { CountrySearch } from '.';

interface AdminCountriesHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onRefresh: () => void;
  onAddCountry: () => void;
  isRefreshing: boolean;
}

const AdminCountriesHeader: React.FC<AdminCountriesHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  onRefresh,
  onAddCountry,
  isRefreshing
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Countries Management</h1>
      <div className="flex flex-wrap gap-2">
        <CountrySearch 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange}
          onClearSearch={onClearSearch}
        />
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button onClick={onAddCountry}>
          <Plus className="mr-2 h-4 w-4" />
          Add Country
        </Button>
      </div>
    </div>
  );
};

export default AdminCountriesHeader;
