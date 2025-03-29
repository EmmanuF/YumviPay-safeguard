
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { FAQItem as FAQItemType } from './types';

interface FAQItemProps {
  item: FAQItemType;
}

const FAQItem: React.FC<FAQItemProps> = ({ item }) => {
  return (
    <AccordionItem key={item.id} value={item.id} className="bg-white rounded-lg shadow-sm mb-3">
      <AccordionTrigger className="px-4 py-3 hover:bg-primary-50/50 rounded-t-lg">
        {item.question}
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FAQItem;
