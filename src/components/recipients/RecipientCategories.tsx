
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Heart, UserPlus, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { id: 'favorites', label: 'Favorites', icon: <Star size={16} />, color: 'bg-primary-100 text-primary-800 hover:bg-primary-200' },
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
          
          // Enhanced styling with glass morphism for selected items
          const defaultClasses = isSelected 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md backdrop-blur-sm border border-primary-300/20' 
            : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent';
          
          const categoryClasses = category.color && !isSelected 
            ? `${category.color} border border-transparent` 
            : defaultClasses;
          
          return (
            <motion.div
              key={category.id}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.1 }}
            >
              <Badge 
                variant="outline"
                className={`${baseClasses} ${categoryClasses} ${isSelected ? 'glass-medium' : ''}`}
                onClick={() => onChange(category.id)}
              >
                {category.icon}
                <span>{category.label}</span>
              </Badge>
            </motion.div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default RecipientCategories;
