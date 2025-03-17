
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe, Search, ChevronDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useCountries } from '@/hooks/useCountries';
import { useToast } from '@/hooks/use-toast';

interface FavoriteCountry {
  code: string;
  name: string;
}

const CountryPreferences: React.FC = () => {
  const { countries, isLoading } = useCountries();
  const { toast } = useToast();
  const [selectedCountries, setSelectedCountries] = useState<FavoriteCountry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Mock loading saved preferences (would connect to Supabase in production)
  useEffect(() => {
    // Default to Cameroon (our MVP focus) if no saved preferences
    if (!isLoading && countries.length > 0) {
      const cameroon = countries.find(c => c.code === 'CM');
      if (cameroon && selectedCountries.length === 0) {
        setSelectedCountries([{ code: 'CM', name: 'Cameroon' }]);
      }
    }
  }, [isLoading, countries]);

  const toggleCountry = (code: string, name: string) => {
    setSelectedCountries(prev => {
      const isSelected = prev.some(c => c.code === code);
      
      if (isSelected) {
        // Don't remove if it's the last country (at least one must be selected)
        if (prev.length <= 1) {
          toast({
            title: "Cannot remove all countries",
            description: "You must have at least one preferred country.",
            variant: "destructive",
          });
          return prev;
        }
        return prev.filter(c => c.code !== code);
      } else {
        return [...prev, { code, name }];
      }
    });
  };

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePreferences = () => {
    // Here we would save to Supabase
    toast({
      title: "Preferences saved",
      description: `Your preferred countries have been updated.`,
    });
  };

  const handleSharePreferences = () => {
    // Mock share functionality
    const countryNames = selectedCountries.map(c => c.name).join(', ');
    toast({
      title: "Countries shared",
      description: `Shared preferences for: ${countryNames}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Country Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Default to Cameroon (MVP)</p>
            <p className="text-xs text-muted-foreground">Show Cameroon as the primary focus</p>
          </div>
          <Switch 
            checked={selectedCountries.some(c => c.code === 'CM')}
            onCheckedChange={(checked) => {
              if (checked && !selectedCountries.some(c => c.code === 'CM')) {
                setSelectedCountries(prev => [...prev, { code: 'CM', name: 'Cameroon' }]);
              } else if (!checked && selectedCountries.length > 1) {
                setSelectedCountries(prev => prev.filter(c => c.code !== 'CM'));
              } else {
                toast({
                  title: "Cannot remove all countries",
                  description: "You must have at least one preferred country.",
                  variant: "destructive",
                });
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Preferred Countries</p>
          <p className="text-xs text-muted-foreground">Select countries you frequently send money to</p>
          
          <ScrollArea className="h-12 w-full">
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map(country => (
                <Badge key={country.code} variant="outline" className="h-8 px-3 py-1">
                  <img 
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    alt={country.name}
                    className="mr-2 h-3 w-4 object-cover"
                  />
                  {country.name}
                  <button 
                    className="ml-2 rounded-full hover:bg-muted p-0.5"
                    onClick={() => toggleCountry(country.code, country.name)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3"
                    onClick={() => setIsPopoverOpen(true)}
                  >
                    Add Country <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search countries..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <ScrollArea className="h-48">
                      {isLoading ? (
                        <div className="py-2 text-center text-sm">Loading countries...</div>
                      ) : filteredCountries.length > 0 ? (
                        <div className="space-y-1 py-1">
                          {filteredCountries.map(country => {
                            const isSelected = selectedCountries.some(c => c.code === country.code);
                            return (
                              <button
                                key={country.code}
                                className={`w-full flex items-center gap-2 p-2 text-sm text-left rounded hover:bg-muted ${isSelected ? 'bg-muted' : ''}`}
                                onClick={() => toggleCountry(country.code, country.name)}
                              >
                                <img 
                                  src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                                  alt={country.name}
                                  className="h-3 w-4 object-cover"
                                />
                                <span>{country.name}</span>
                                {isSelected && (
                                  <span className="ml-auto text-primary">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-2 text-center text-sm">No countries found</div>
                      )}
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </ScrollArea>
        </div>
        
        <div className="pt-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleSharePreferences}
          >
            Share
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleSavePreferences}
          >
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryPreferences;
