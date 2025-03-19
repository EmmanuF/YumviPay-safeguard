
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";

// Import our new components
import PromotionForm from './promotions/PromotionForm';
import PromotionList from './promotions/PromotionList';
import PromotionSearch from './promotions/PromotionSearch';
import { Promotion, NewPromotion } from './promotions/types';

const PromotionsManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  
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
  const [promotions, setPromotions] = useState<Promotion[]>([
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
  
  const [newPromotion, setNewPromotion] = useState<NewPromotion>({
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
            <PromotionForm 
              newPromotion={newPromotion}
              setNewPromotion={setNewPromotion}
              handleAddPromotion={handleAddPromotion}
              isAddDialogOpen={isAddDialogOpen}
              setIsAddDialogOpen={setIsAddDialogOpen}
              startDateRange={startDateRange}
              setStartDateRange={setStartDateRange}
              endDateRange={endDateRange}
              setEndDateRange={setEndDateRange}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
            />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <PromotionSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <PromotionList 
            promotions={filteredPromotions} 
            handleToggleActive={handleToggleActive} 
            handleDeletePromotion={handleDeletePromotion} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionsManager;
