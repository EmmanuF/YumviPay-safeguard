
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Heart, UserPlus, Star, Clock } from 'lucide-react';

interface CategoryOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface RecipientCategoriesProps {
  selectedCategory: string;
  onChange: (category: string) => void;
}

const RecipientCategories: React.FC<RecipientCategoriesProps> = ({ 
  selectedCategory, 
  onChange 
}) => {
  const categories: CategoryOption[] = [
    { id: 'all', label: 'All', icon: <Users size={16} /> },
    { id: 'favorites', label: 'Favorites', icon: <Star size={16} />, color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    { id: 'family', label: 'Family', icon: <Heart size={16} />, color: 'bg-red-100 text-red-800 hover:bg-red-200' },
    { id: 'business', label: 'Business', icon: <Briefcase size={16} />, color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { id: 'frequent', label: 'Frequent', icon: <Clock size={16} />, color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  ];
  
  return (
    <ScrollArea className="pb-3 w-full">
      <div className="flex space-x-2 pb-1 px-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const baseClasses = 'flex items-center gap-1 cursor-pointer transition-all py-1 px-3';
          const defaultClasses = isSelected 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
            : 'bg-muted text-muted-foreground hover:bg-muted/80';
          const categoryClasses = category.color && !isSelected 
            ? category.color 
            : defaultClasses;
          
          return (
            <Badge 
              key={category.id}
              variant="outline"
              className={`${baseClasses} ${categoryClasses}`}
              onClick={() => onChange(category.id)}
            >
              {category.icon}
              <span>{category.label}</span>
            </Badge>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default RecipientCategories;
