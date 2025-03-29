
import React from 'react';
import { Button } from '@/components/ui/button';
import { QuestionCategory } from './types';

interface FAQCategoriesProps {
  selectedCategory: QuestionCategory;
  setSelectedCategory: (category: QuestionCategory) => void;
}

const FAQCategories: React.FC<FAQCategoriesProps> = ({ selectedCategory, setSelectedCategory }) => {
  // Categories to display
  const displayCategories: Exclude<QuestionCategory, 'all'>[] = [
    'getting-started',
    'transactions',
    'account',
    'payments',
    'security'
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      <Button 
        variant={selectedCategory === 'all' ? 'default' : 'outline'} 
        className="rounded-full"
        onClick={() => setSelectedCategory('all')}
      >
        All
      </Button>
      
      {displayCategories.map(category => (
        <Button 
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'} 
          className="rounded-full"
          onClick={() => setSelectedCategory(category)}
        >
          {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </Button>
      ))}
    </div>
  );
};

export default FAQCategories;
