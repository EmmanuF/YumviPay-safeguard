
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Promotion } from './types';

interface PromotionListProps {
  promotions: Promotion[];
  handleToggleActive: (id: number) => void;
  handleDeletePromotion: (id: number) => void;
}

const PromotionList = ({ 
  promotions, 
  handleToggleActive, 
  handleDeletePromotion 
}: PromotionListProps) => {
  return (
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
          {promotions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                No promotions found
              </TableCell>
            </TableRow>
          ) : (
            promotions.map((promo) => (
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
  );
};

export default PromotionList;
