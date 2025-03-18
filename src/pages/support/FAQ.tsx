
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import { 
  FAQHeader, 
  FAQSearch, 
  FAQList, 
  FAQContactCTA 
} from '@/components/support/faq';
import { faqItems, faqCategories } from '@/data/faqData';

const FAQ: React.FC = () => {
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Toggle question expansion
  const toggleQuestion = (question: string) => {
    if (expandedQuestions.includes(question)) {
      setExpandedQuestions(expandedQuestions.filter(q => q !== question));
    } else {
      setExpandedQuestions([...expandedQuestions, question]);
    }
  };
  
  // Filter FAQs based on search query and selected category
  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Frequently Asked Questions | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <FAQHeader />
        
        <FAQSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={faqCategories}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <FAQList 
            faqs={filteredFAQs} 
            expandedQuestions={expandedQuestions}
            toggleQuestion={toggleQuestion}
          />
          
          <FAQContactCTA />
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default FAQ;
