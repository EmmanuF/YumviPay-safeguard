
import React, { useEffect, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Check, Share2, Receipt, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TransactionSuccessStepProps {
  transactionId: string;
  recipientName?: string;
  amount?: number;
  currency?: string;
}

const TransactionSuccessStep: React.FC<TransactionSuccessStepProps> = ({
  transactionId,
  recipientName = "your recipient",
  amount = 0,
  currency = "USD"
}) => {
  const navigate = useNavigate();
  const [scope, animate] = useAnimate();
  const [showReferral, setShowReferral] = useState(false);
  
  // Launch confetti effect
  useEffect(() => {
    setTimeout(() => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }
      
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }, 300);
  }, []);
  
  // Animate checkmark and show referral section
  useEffect(() => {
    const sequence = async () => {
      // Animate checkmark
      await animate(scope.current, { scale: [0, 1.2, 1] }, { duration: 0.6, ease: "easeOut" });
      
      // Pulse animation
      animate(scope.current, 
        { scale: [1, 1.05, 1] }, 
        { duration: 2, ease: "easeInOut", repeat: Infinity }
      );
      
      // Show referral section after delay
      setTimeout(() => setShowReferral(true), 1500);
    };
    
    sequence();
  }, [animate, scope]);
  
  const handleViewReceipt = () => {
    navigate(`/transaction/${transactionId}`);
  };
  
  const handleSendAgain = () => {
    navigate('/send-money');
  };
  
  const handleShare = () => {
    // Native sharing if available
    if (navigator.share) {
      navigator.share({
        title: 'Earn $20 with Yumvi-Pay!',
        text: 'I just used Yumvi-Pay to send money to Africa with no fees. Join me and we both get $20!',
        url: window.location.origin
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Copy referral link
      navigator.clipboard.writeText(`${window.location.origin}?ref=share`);
      alert('Referral link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-lg bg-white overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-primary/80 to-primary flex justify-center items-center">
          <motion.div 
            ref={scope} 
            className="absolute w-16 h-16 rounded-full bg-white flex items-center justify-center"
          >
            <Check className="h-8 w-8 text-primary" />
          </motion.div>
        </div>
        
        <CardHeader className="pb-0 mt-8 text-center">
          <CardTitle className="text-2xl text-primary font-bold">Transfer Complete!</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center pt-2">
          <p className="text-muted-foreground mb-4">
            Your payment of {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
            }).format(amount)} has been sent to {recipientName}.
          </p>
          
          <div className="my-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full flex-1"
              onClick={handleViewReceipt}
            >
              <Receipt className="mr-2 h-4 w-4" /> View Receipt
            </Button>
            
            <Button
              size="lg"
              className="rounded-full flex-1"
              onClick={handleSendAgain}
            >
              Send Again
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {showReferral && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-r from-emerald-50 to-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">Invite friends & earn $20</h3>
                  <p className="text-sm text-muted-foreground">
                    For every friend who sends money
                  </p>
                </div>
                
                <Button 
                  onClick={handleShare}
                  className="rounded-full bg-green-600 hover:bg-green-700"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionSuccessStep;
