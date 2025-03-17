
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Star, User } from 'lucide-react';
import { useRecipients } from '@/hooks/useRecipients';

interface FavoriteRecipientsProps {
  transactionData: {
    recipientName?: string;
    recipient?: string | null;
  };
  updateTransactionData: (data: Partial<any>) => void;
}

const FavoriteRecipients: React.FC<FavoriteRecipientsProps> = ({
  transactionData,
  updateTransactionData,
}) => {
  const { recipients, loading } = useRecipients();
  const [favoriteRecipients, setFavoriteRecipients] = useState<any[]>([]);
  
  useEffect(() => {
    if (recipients && recipients.length > 0) {
      // Filter favorites
      const favorites = recipients.filter(r => r.isFavorite);
      setFavoriteRecipients(favorites);
    }
  }, [recipients]);

  if (loading) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Favorite Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="h-20 flex items-center">
              <p className="text-gray-500">Loading favorites...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (favoriteRecipients.length === 0) {
    return null;
  }

  const handleSelectRecipient = (recipient: any) => {
    updateTransactionData({
      recipient: recipient.id,
      recipientName: recipient.name,
      recipientContact: recipient.contact,
      recipientCountry: recipient.country
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Star className="w-4 h-4 text-yellow-500 mr-2" /> 
          Favorite Recipients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-x-auto gap-3 pb-2">
          {favoriteRecipients.map((recipient) => (
            <motion.div
              key={recipient.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={transactionData.recipient === recipient.id ? "default" : "outline"}
                className={`h-auto py-3 px-4 flex flex-col items-center min-w-[120px] ${
                  transactionData.recipient === recipient.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "border-gray-200"
                }`}
                onClick={() => handleSelectRecipient(recipient)}
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium truncate w-full text-center">
                  {recipient.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {recipient.country}
                </p>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteRecipients;
