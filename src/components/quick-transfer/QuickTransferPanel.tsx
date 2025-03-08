
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Send, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecipients } from '@/hooks/useRecipients';
import { Recipient } from '@/types/recipient';

const QuickTransferPanel: React.FC = () => {
  const navigate = useNavigate();
  const { recipients } = useRecipients();
  
  // Sort recipients by favorite and lastUsed
  const sortedRecipients = [...recipients].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    
    // If both have lastUsed, sort by most recently used
    if (a.lastUsed && b.lastUsed) {
      return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
    }
    
    // If only one has lastUsed, put that one first
    if (a.lastUsed && !b.lastUsed) return -1;
    if (!a.lastUsed && b.lastUsed) return 1;
    
    return 0;
  });
  
  // Get top 3 recipients for quick transfer
  const quickTransferRecipients = sortedRecipients.slice(0, 3);
  
  const handleQuickTransfer = (recipient: Recipient) => {
    navigate('/send', { state: { selectedRecipient: recipient } });
  };
  
  const handleViewAllRecipients = () => {
    navigate('/recipients');
  };
  
  if (quickTransferRecipients.length === 0) {
    return null;
  }
  
  return (
    <div className="glass-effect p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-medium">Quick Transfer</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={handleViewAllRecipients}
        >
          View All
        </Button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {quickTransferRecipients.map((recipient) => (
          <motion.div
            key={recipient.id}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-24 flex flex-col items-center"
            onClick={() => handleQuickTransfer(recipient)}
          >
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-xs text-center font-medium truncate w-full">
              {recipient.name}
            </p>
            <p className="text-[10px] text-gray-500 truncate w-full text-center">
              {recipient.contact}
            </p>
          </motion.div>
        ))}
        
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 w-24 flex flex-col items-center justify-center"
          onClick={handleViewAllRecipients}
        >
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-2">
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-xs text-center font-medium text-gray-500">
            More
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickTransferPanel;
