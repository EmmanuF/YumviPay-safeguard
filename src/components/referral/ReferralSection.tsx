
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Copy, UserPlus, Check } from 'lucide-react';

const ReferralSection: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // This would come from your auth context in a real implementation
  const referralCode = "YUMVI" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://yumvi-pay.app/signup?ref=${referralCode}`;
  
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard",
          variant: "success"
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast({
          title: "Failed to copy",
          description: "Please try manually selecting the link",
          variant: "destructive"
        });
      });
  };
  
  const handleShareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Yumvi-Pay!',
          text: 'I use Yumvi-Pay to send money to Africa. Join using my referral code!',
          url: referralLink,
        });
        toast({
          title: "Shared successfully!",
          description: "Thanks for sharing Yumvi-Pay",
          variant: "success"
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Sharing failed",
            description: "Please try copying the link instead",
            variant: "destructive"
          });
        }
      }
    } else {
      handleCopyReferralLink();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto my-8"
    >
      <Card className="border border-primary-100 bg-white shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 pb-2">
          <div className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-primary-600" />
            <CardTitle className="text-xl text-primary-800">Refer Friends & Earn</CardTitle>
          </div>
          <CardDescription>
            Invite friends to Yumvi-Pay and both of you will receive benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Your Referral Code</p>
            <p className="text-2xl font-bold text-primary-800 tracking-wider">{referralCode}</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="referral-link" className="text-sm font-medium text-gray-700">
              Share your referral link
            </label>
            <div className="flex items-center space-x-2">
              <Input 
                id="referral-link"
                value={referralLink} 
                readOnly 
                className="bg-gray-50 border-gray-200"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyReferralLink}
                className="flex-shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="bg-secondary-50 rounded-lg p-4">
            <h4 className="font-medium text-secondary-800 mb-2">How it works:</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="bg-secondary-100 text-secondary-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span>Share your unique referral code with friends</span>
              </li>
              <li className="flex items-start">
                <span className="bg-secondary-100 text-secondary-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span>They sign up using your code</span>
              </li>
              <li className="flex items-start">
                <span className="bg-secondary-100 text-secondary-700 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span>Both of you receive transaction fee discounts</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-lg">
          <Button 
            className="w-full bg-primary hover:bg-primary-600"
            onClick={handleShareReferral}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share with Friends
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ReferralSection;
