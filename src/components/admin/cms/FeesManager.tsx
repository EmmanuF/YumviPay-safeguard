
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Trash2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const FeesManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFee, setNewFee] = useState({
    country: '',
    paymentMethod: '',
    fixedFee: '',
    percentageFee: '',
    isActive: true
  });
  
  // Sample fees data - in a real app, this would be fetched from the database
  const [fees, setFees] = useState([
    { id: 1, country: 'Cameroon', paymentMethod: 'Mobile Money', fixedFee: '2.00', percentageFee: '1.5', currency: 'USD', isActive: true },
    { id: 2, country: 'Cameroon', paymentMethod: 'Bank Transfer', fixedFee: '5.00', percentageFee: '1.0', currency: 'USD', isActive: true },
    { id: 3, country: 'Nigeria', paymentMethod: 'Mobile Money', fixedFee: '1.50', percentageFee: '1.2', currency: 'USD', isActive: true },
    { id: 4, country: 'Nigeria', paymentMethod: 'Bank Transfer', fixedFee: '4.00', percentageFee: '0.8', currency: 'USD', isActive: true },
    { id: 5, country: 'Ghana', paymentMethod: 'Mobile Money', fixedFee: '2.50', percentageFee: '1.3', currency: 'USD', isActive: false },
    { id: 6, country: 'Ghana', paymentMethod: 'Bank Transfer', fixedFee: '4.50', percentageFee: '0.9', currency: 'USD', isActive: true },
    { id: 7, country: 'Kenya', paymentMethod: 'Mobile Money', fixedFee: '2.00', percentageFee: '1.4', currency: 'USD', isActive: true },
    { id: 8, country: 'Kenya', paymentMethod: 'Bank Transfer', fixedFee: '3.50', percentageFee: '0.7', currency: 'USD', isActive: true },
  ]);
  
  const handleAddFee = () => {
    if (!newFee.country || !newFee.paymentMethod || !newFee.fixedFee || !newFee.percentageFee) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...fees.map(fee => fee.id)) + 1;
    
    setFees(prev => [
      ...prev,
      {
        id: newId,
        country: newFee.country,
        paymentMethod: newFee.paymentMethod,
        fixedFee: newFee.fixedFee,
        percentageFee: newFee.percentageFee,
        currency: 'USD',
        isActive: newFee.isActive
      }
    ]);
    
    setNewFee({
      country: '',
      paymentMethod: '',
      fixedFee: '',
      percentageFee: '',
      isActive: true
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Fee Added",
      description: "New fee structure has been added successfully.",
    });
  };
  
  const handleUpdateFee = (id: number, field: string, value: string | boolean) => {
    setFees(prev => 
      prev.map(fee => 
        fee.id === id 
          ? { ...fee, [field]: value } 
          : fee
      )
    );
  };
  
  const handleSaveFees = () => {
    // In a real app, this would call an API to save the fee structures
    toast({
      title: "Fees Saved",
      description: "Fee structures have been updated successfully.",
    });
  };
  
  const handleDeleteFee = (id: number) => {
    setFees(prev => prev.filter(fee => fee.id !== id));
    
    toast({
      title: "Fee Deleted",
      description: "Fee structure has been deleted successfully.",
    });
  };
  
  const filteredFees = fees.filter(fee => 
    fee.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sample countries and payment methods for the dropdowns
  const countries = ['Cameroon', 'Nigeria', 'Ghana', 'Kenya', 'Uganda', 'Tanzania', 'South Africa', 'Ethiopia'];
  const paymentMethods = ['Mobile Money', 'Bank Transfer', 'Cash Pickup', 'Debit Card', 'Credit Card'];
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg text-primary-700">Fee Manager</CardTitle>
            <CardDescription>
              Configure transaction fees and charges
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Fee</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Fee Structure</DialogTitle>
                  <DialogDescription>
                    Create a new fee structure for a specific country and payment method
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fee-country">Country</Label>
                    <Select 
                      value={newFee.country} 
                      onValueChange={(value) => setNewFee({...newFee, country: value})}
                    >
                      <SelectTrigger id="fee-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fee-payment-method">Payment Method</Label>
                    <Select 
                      value={newFee.paymentMethod} 
                      onValueChange={(value) => setNewFee({...newFee, paymentMethod: value})}
                    >
                      <SelectTrigger id="fee-payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fixed-fee">Fixed Fee (USD)</Label>
                      <Input 
                        id="fixed-fee" 
                        type="number"
                        step="0.01"
                        placeholder="e.g. 2.00"
                        value={newFee.fixedFee}
                        onChange={(e) => setNewFee({...newFee, fixedFee: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="percentage-fee">Percentage Fee (%)</Label>
                      <Input 
                        id="percentage-fee" 
                        type="number"
                        step="0.1"
                        placeholder="e.g. 1.5"
                        value={newFee.percentageFee}
                        onChange={(e) => setNewFee({...newFee, percentageFee: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="is-active"
                      checked={newFee.isActive}
                      onCheckedChange={(checked) => setNewFee({...newFee, isActive: checked})}
                    />
                    <Label htmlFor="is-active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddFee}>Add Fee</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button size="sm" variant="outline" onClick={handleSaveFees} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by country or payment method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="w-[120px]">Fixed Fee</TableHead>
                  <TableHead className="w-[120px]">Percentage</TableHead>
                  <TableHead className="w-[100px]">Active</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                      No fee structures found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.country}</TableCell>
                      <TableCell>{fee.paymentMethod}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-sm mr-1">{fee.currency}</span>
                          <Input
                            value={fee.fixedFee}
                            onChange={(e) => handleUpdateFee(fee.id, 'fixedFee', e.target.value)}
                            className="max-w-[60px] h-8"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Input
                            value={fee.percentageFee}
                            onChange={(e) => handleUpdateFee(fee.id, 'percentageFee', e.target.value)}
                            className="max-w-[60px] h-8"
                          />
                          <span className="text-sm ml-1">%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={fee.isActive}
                          onCheckedChange={(checked) => handleUpdateFee(fee.id, 'isActive', checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDeleteFee(fee.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredFees.length} of {fees.length} fee structures
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeesManager;
