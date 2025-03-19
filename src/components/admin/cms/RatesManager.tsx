
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Search, ArrowUpDown, Download, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

const RatesManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRate, setNewRate] = useState({ fromCurrency: '', toCurrency: '', rate: '', source: 'manual' });
  
  // Sample exchange rates data - in a real app, this would be fetched from the database
  const [exchangeRates, setExchangeRates] = useState([
    { id: 1, fromCurrency: 'USD', toCurrency: 'XAF', rate: '620.50', lastUpdated: '2023-10-15T14:30:00Z', source: 'api' },
    { id: 2, fromCurrency: 'EUR', toCurrency: 'XAF', rate: '712.75', lastUpdated: '2023-10-15T14:30:00Z', source: 'api' },
    { id: 3, fromCurrency: 'GBP', toCurrency: 'XAF', rate: '830.20', lastUpdated: '2023-10-15T14:30:00Z', source: 'api' },
    { id: 4, fromCurrency: 'CAD', toCurrency: 'XAF', rate: '465.80', lastUpdated: '2023-10-15T14:30:00Z', source: 'api' },
    { id: 5, fromCurrency: 'AUD', toCurrency: 'XAF', rate: '420.30', lastUpdated: '2023-10-15T14:30:00Z', source: 'api' },
    { id: 6, fromCurrency: 'USD', toCurrency: 'NGN', rate: '1520.00', lastUpdated: '2023-10-15T14:30:00Z', source: 'manual' },
    { id: 7, fromCurrency: 'EUR', toCurrency: 'NGN', rate: '1750.50', lastUpdated: '2023-10-15T14:30:00Z', source: 'manual' },
    { id: 8, fromCurrency: 'GBP', toCurrency: 'NGN', rate: '2050.75', lastUpdated: '2023-10-15T14:30:00Z', source: 'manual' },
  ]);
  
  const handleRefreshRates = () => {
    // In a real app, this would fetch the latest rates from an external API
    toast({
      title: "Rates Refreshed",
      description: "Exchange rates have been updated to the latest values.",
    });
  };
  
  const handleExportRates = () => {
    // In a real app, this would export rates to CSV or JSON
    toast({
      title: "Rates Exported",
      description: "Exchange rates have been exported successfully.",
    });
  };
  
  const handleEditRate = (id: number, newValue: string) => {
    setExchangeRates(prev => 
      prev.map(rate => 
        rate.id === id 
          ? { ...rate, rate: newValue, lastUpdated: new Date().toISOString(), source: 'manual' } 
          : rate
      )
    );
    
    toast({
      title: "Rate Updated",
      description: "Exchange rate has been updated successfully.",
    });
  };
  
  const handleAddRate = () => {
    if (!newRate.fromCurrency || !newRate.toCurrency || !newRate.rate) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...exchangeRates.map(rate => rate.id)) + 1;
    
    setExchangeRates(prev => [
      ...prev,
      {
        id: newId,
        fromCurrency: newRate.fromCurrency.toUpperCase(),
        toCurrency: newRate.toCurrency.toUpperCase(),
        rate: newRate.rate,
        lastUpdated: new Date().toISOString(),
        source: 'manual'
      }
    ]);
    
    setNewRate({ fromCurrency: '', toCurrency: '', rate: '', source: 'manual' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Rate Added",
      description: "New exchange rate has been added successfully.",
    });
  };
  
  const filteredRates = exchangeRates.filter(rate => 
    rate.fromCurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rate.toCurrency.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg text-primary-700">Exchange Rates Manager</CardTitle>
            <CardDescription>
              Update and manage currency exchange rates
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleRefreshRates} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportRates} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Rate</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Exchange Rate</DialogTitle>
                  <DialogDescription>
                    Add a new currency exchange rate pair
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="from-currency">From Currency (e.g. USD)</Label>
                    <Input 
                      id="from-currency" 
                      value={newRate.fromCurrency}
                      onChange={(e) => setNewRate({...newRate, fromCurrency: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="to-currency">To Currency (e.g. XAF)</Label>
                    <Input 
                      id="to-currency" 
                      value={newRate.toCurrency}
                      onChange={(e) => setNewRate({...newRate, toCurrency: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rate-value">Exchange Rate</Label>
                    <Input 
                      id="rate-value" 
                      type="number"
                      step="0.01"
                      value={newRate.rate}
                      onChange={(e) => setNewRate({...newRate, rate: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddRate}>Add Rate</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search currency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">From</TableHead>
                  <TableHead className="w-[100px]">To</TableHead>
                  <TableHead className="w-[150px]">Rate</TableHead>
                  <TableHead className="w-[180px]">Last Updated</TableHead>
                  <TableHead className="w-[100px]">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                      No exchange rates found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.fromCurrency}</TableCell>
                      <TableCell>{rate.toCurrency}</TableCell>
                      <TableCell>
                        <Input
                          value={rate.rate}
                          onChange={(e) => handleEditRate(rate.id, e.target.value)}
                          className="max-w-[100px] h-8"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(rate.lastUpdated).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {rate.source === 'api' ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">API</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Manual</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredRates.length} of {exchangeRates.length} exchange rates
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatesManager;
