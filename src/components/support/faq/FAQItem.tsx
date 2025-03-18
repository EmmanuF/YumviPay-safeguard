
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  toggleQuestion: (question: string) => void;
  isLast: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({ 
  question, 
  answer, 
  isExpanded, 
  toggleQuestion,
  isLast 
}) => {
  return (
    <React.Fragment>
      <div className="py-2 px-4">
        <button
          onClick={() => toggleQuestion(question)}
          className="flex justify-between items-center w-full text-left py-3"
        >
          <h3 className="font-medium text-gray-900">{question}</h3>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-primary-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600 pb-3 pt-1"
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </div>
      {!isLast && <Separator className="my-1" />}
    </React.Fragment>
  );
};

export default FAQItem;
