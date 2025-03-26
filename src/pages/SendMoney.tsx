
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useCountries } from '@/hooks/useCountries';
import { createTransaction } from '@/services/transaction';
import { paymentService } from '@/services/kadoService';
import { ArrowRight } from 'lucide-react';

const SendMoney = () => {
  const { countries } = useCountries();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [amount, setAmount] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('CM'); // Default to Cameroon
  const [recipientName, setRecipientName] = useState('');
  const [recipientContact, setRecipientContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [isLoading, setIsLoading] = useState(false);
  
  // Payment methods based on country
  const paymentMethods = [
    { id: 'mobile_money', name: 'Mobile Money' },
    { id: 'bank_transfer', name: 'Bank Transfer' }
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !selectedCountry || !recipientName || !recipientContact || !paymentMethod) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create a transaction record
      await createTransaction({
        id: transactionId,
        amount,
        recipientName,
        recipientContact,
        country: selectedCountry,
        paymentMethod,
        provider: paymentMethod === 'mobile_money' ? 'MTN Mobile Money' : 'Bank Transfer',
        status: 'pending'
      });
      
      // Process the payment
      await paymentService.processPayment({
        amount,
        recipientName,
        recipientContact,
        country: selectedCountry,
        paymentMethod,
        transactionId
      });
      
      // Navigate to transaction status page
      navigate(`/transaction/${transactionId}`);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-xl">
      <Card className="w-full shadow-lg border-purple-100">
        <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold">Send Money</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Send (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Recipient Country</Label>
              <Select
                value={selectedCountry}
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flagUrl && (
                        <img
                          src={country.flagUrl}
                          alt={country.name}
                          className="w-4 h-4 mr-2 inline-block"
                        />
                      )}
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                placeholder="Enter recipient's full name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientContact">
                Recipient Contact (Phone/Account)
              </Label>
              <Input
                id="recipientContact"
                placeholder="Enter phone number or account"
                value={recipientContact}
                onChange={(e) => setRecipientContact(e.target.value)}
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <SelectTrigger className="border-purple-200 focus:border-purple-500">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? 'Processing...' : 'Send Money'}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SendMoney;
