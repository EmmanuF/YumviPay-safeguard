
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from '@/components/ui/badge';
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const PromotionsManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  
  // State for date ranges
  const [startDateRange, setStartDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined
  });
  
  const [endDateRange, setEndDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    to: undefined
  });
  
  // Sample promotions data
  const [promotions, setPromotions] = useState([
    { 
      id: 1, 
      name: 'Welcome Bonus', 
      code: 'WELCOME10', 
      discount: '10%', 
      startDate: '2023-10-01', 
      endDate: '2023-12-31', 
      isActive: true,
      usageLimit: 1,
      minAmount: '100',
      isFirstTimeOnly: true
    },
    { 
      id: 2, 
      name: 'Holiday Special', 
      code: 'HOLIDAY25', 
      discount: '25%', 
      startDate: '2023-12-15', 
      endDate: '2024-01-15', 
      isActive: true,
      usageLimit: 0,
      minAmount: '250',
      isFirstTimeOnly: false
    },
    { 
      id: 3, 
      name: 'Summer Deal', 
      code: 'SUMMER15', 
      discount: '15%', 
      startDate: '2024-06-01', 
      endDate: '2024-08-31', 
      isActive: false,
      usageLimit: 0,
      minAmount: '150',
      isFirstTimeOnly: false
    },
    { 
      id: 4, 
      name: 'Refer a Friend', 
      code: 'FRIEND20', 
      discount: '20%', 
      startDate: '2023-01-01', 
      endDate: '2024-12-31', 
      isActive: true,
      usageLimit: 5,
      minAmount: '50',
      isFirstTimeOnly: false
    },
  ]);
  
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    code: '',
    discount: '',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true,
    usageLimit: 0,
    minAmount: '',
    isFirstTimeOnly: false
  });
  
  const handleAddPromotion = () => {
    if (!newPromotion.name || !newPromotion.code || !newPromotion.discount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(...promotions.map(promo => promo.id)) + 1;
    
    setPromotions(prev => [
      ...prev,
      {
        id: newId,
        name: newPromotion.name,
        code: newPromotion.code.toUpperCase(),
        discount: newPromotion.discount,
        startDate: newPromotion.startDate.toISOString().split('T')[0],
        endDate: newPromotion.endDate.toISOString().split('T')[0],
        isActive: newPromotion.isActive,
        usageLimit: newPromotion.usageLimit,
        minAmount: newPromotion.minAmount,
        isFirstTimeOnly: newPromotion.isFirstTimeOnly
      }
    ]);
    
    setNewPromotion({
      name: '',
      code: '',
      discount: '',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      isActive: true,
      usageLimit: 0,
      minAmount: '',
      isFirstTimeOnly: false
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Promotion Added",
      description: "New promotion has been added successfully.",
    });
  };
  
  const handleToggleActive = (id: number) => {
    setPromotions(prev => 
      prev.map(promo => 
        promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
      )
    );
    
    toast({
      title: "Promotion Status Updated",
      description: "Promotion status has been updated successfully.",
    });
  };
  
  const handleDeletePromotion = (id: number) => {
    setPromotions(prev => prev.filter(promo => promo.id !== id));
    
    toast({
      title: "Promotion Deleted",
      description: "Promotion has been deleted successfully.",
    });
  };
  
  const filteredPromotions = promotions.filter(promo => 
    promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle start date change
  const handleStartDateChange = (range: DateRange | undefined) => {
    setStartDateRange(range);
    if (range?.from) {
      setNewPromotion(prev => ({
        ...prev,
        startDate: range.from as Date
      }));
    }
  };
  
  // Handle end date change
  const handleEndDateChange = (range: DateRange | undefined) => {
    setEndDateRange(range);
    if (range?.from) {
      setNewPromotion(prev => ({
        ...prev,
        endDate: range.from as Date
      }));
    }
  };
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg text-primary-700">Promotions Manager</CardTitle>
            <CardDescription>
              Create and manage promotional offers and discount codes
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Promotion</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Promotion</DialogTitle>
                <DialogDescription>
                  Create a new promotional offer or discount code
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="promo-name">Promotion Name</Label>
                  <Input 
                    id="promo-name" 
                    placeholder="e.g. Summer Discount"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="promo-code">Promo Code</Label>
                  <Input 
                    id="promo-code" 
                    placeholder="e.g. SUMMER25"
                    value={newPromotion.code}
                    onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="promo-discount">Discount Amount</Label>
                  <Input 
                    id="promo-discount" 
                    placeholder="e.g. 25%"
                    value={newPromotion.discount}
                    onChange={(e) => setNewPromotion({...newPromotion, discount: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <DatePicker 
                      value={startDateRange}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <DatePicker 
                      value={endDateRange}
                      onChange={handleEndDateChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="usage-limit">Usage Limit (0 = unlimited)</Label>
                    <Input 
                      id="usage-limit" 
                      type="number"
                      min="0"
                      value={newPromotion.usageLimit}
                      onChange={(e) => setNewPromotion({...newPromotion, usageLimit: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="min-amount">Minimum Amount (USD)</Label>
                    <Input 
                      id="min-amount" 
                      placeholder="e.g. 100"
                      value={newPromotion.minAmount}
                      onChange={(e) => setNewPromotion({...newPromotion, minAmount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="promo-active"
                      checked={newPromotion.isActive}
                      onCheckedChange={(checked) => setNewPromotion({...newPromotion, isActive: checked})}
                    />
                    <Label htmlFor="promo-active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="first-time-only"
                      checked={newPromotion.isFirstTimeOnly}
                      onCheckedChange={(checked) => setNewPromotion({...newPromotion, isFirstTimeOnly: checked})}
                    />
                    <Label htmlFor="first-time-only">First-time users only</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddPromotion}>Add Promotion</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                      No promotions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPromotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">
                        {promo.name}
                        {promo.isFirstTimeOnly && 
                          <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-300 text-xs">First-time</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{promo.code}</Badge>
                      </TableCell>
                      <TableCell>{promo.discount}</TableCell>
                      <TableCell className="text-sm">
                        {promo.startDate} to {promo.endDate}
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={promo.isActive}
                          onCheckedChange={() => handleToggleActive(promo.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleDeletePromotion(promo.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionsManager;
