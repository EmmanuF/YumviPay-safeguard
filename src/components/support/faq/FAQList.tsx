
import React from 'react';
import { motion } from 'framer-motion';
import FAQItem from './FAQItem';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQListProps {
  faqs: FAQItem[];
  expandedQuestions: string[];
  toggleQuestion: (question: string) => void;
}

const FAQList: React.FC<FAQListProps> = ({ 
  faqs, 
  expandedQuestions, 
  toggleQuestion 
}) => {
  if (faqs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No results found for your search. Please try a different query.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-1">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isExpanded={expandedQuestions.includes(faq.question)}
          toggleQuestion={toggleQuestion}
          isLast={index === faqs.length - 1}
        />
      ))}
    </div>
  );
};

export default FAQList;
