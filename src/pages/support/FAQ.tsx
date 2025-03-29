
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  FAQSearch, 
  FAQCategories, 
  FAQList, 
  FAQHelpSection, 
  faqItems,
  QuestionCategory
} from '@/components/faq';

const FAQ = () => {
  // State for search query and selected category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('all');
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>FAQ | Yumvi-Pay</title>
        <meta name="description" content="Frequently asked questions about Yumvi-Pay's money transfer services." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Frequently Asked Questions</h1>
      
      {/* Search Box */}
      <FAQSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      {/* FAQ Categories */}
      <FAQCategories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      
      {/* Accordion FAQ Items */}
      <FAQList 
        faqItems={faqItems} 
        selectedCategory={selectedCategory} 
        searchQuery={searchQuery} 
      />
      
      {/* Still Need Help Section */}
      <FAQHelpSection />
    </div>
  );
};

export default FAQ;
