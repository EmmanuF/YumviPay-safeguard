
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import FAQItem from './FAQItem';
import { FAQItem as FAQItemType, QuestionCategory } from './types';

interface FAQListProps {
  faqItems: FAQItemType[];
  selectedCategory: QuestionCategory;
  searchQuery: string;
}

const FAQList: React.FC<FAQListProps> = ({ faqItems, selectedCategory, searchQuery }) => {
  // Filter FAQ items based on selected category and search query
  const filteredFAQItems = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Group filtered items by category for display
  const getItemsByCategory = (category: Exclude<QuestionCategory, 'all'>) => {
    return filteredFAQItems.filter(item => item.category === category);
  };

  // Categories to display
  const displayCategories: Exclude<QuestionCategory, 'all'>[] = [
    'getting-started', 
    'transactions', 
    'account', 
    'payments', 
    'security'
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {/* Show all filtered items if 'all' is selected, otherwise show categorized sections */}
        {selectedCategory === 'all' ? (
          <>
            {displayCategories.map(category => {
              const categoryItems = getItemsByCategory(category);
              if (categoryItems.length === 0) return null;
              
              return (
                <React.Fragment key={category}>
                  <h2 className="text-xl font-semibold mb-3 text-primary-700 mt-8">
                    {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </h2>
                  
                  {categoryItems.map(item => (
                    <FAQItem key={item.id} item={item} />
                  ))}
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-3 text-primary-700">
              {selectedCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
            
            {filteredFAQItems.length > 0 ? (
              filteredFAQItems.map(item => (
                <FAQItem key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No questions found. Please try a different search term or category.</p>
              </div>
            )}
          </>
        )}
      </Accordion>
    </div>
  );
};

export default FAQList;
