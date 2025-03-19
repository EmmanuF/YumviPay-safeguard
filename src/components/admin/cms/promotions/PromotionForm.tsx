
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { DatePicker } from "@/components/ui/date-picker";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PromotionFormProps } from './types';

const PromotionForm = ({
  newPromotion,
  setNewPromotion,
  handleAddPromotion,
  setIsAddDialogOpen,
  startDateRange,
  endDateRange,
  handleStartDateChange,
  handleEndDateChange
}: PromotionFormProps) => {
  return (
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
  );
};

export default PromotionForm;
