
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Save, Info, User, DollarSign, Gift, Settings, Sliders } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

const ReferralsManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');
  
  // Sample referral settings
  const [referralSettings, setReferralSettings] = useState({
    enabled: true,
    rewardType: 'both', // 'referrer_only', 'referee_only', 'both'
    referrerReward: '10',
    referrerRewardType: 'fixed', // 'fixed', 'percentage'
    refereeReward: '5',
    refereeRewardType: 'fixed', // 'fixed', 'percentage'
    minimumTransactionAmount: '50',
    expiryDays: '30',
    maxReferralsPerUser: '10',
    referralLevels: '1',
  });
  
  // Sample referral list
  const [referrals, setReferrals] = useState([
    { id: 1, referrer: 'John Doe', referee: 'Jane Smith', date: '2023-10-05', status: 'Completed', amount: '$25.00' },
    { id: 2, referrer: 'Alice Johnson', referee: 'Bob Williams', date: '2023-10-03', status: 'Pending', amount: '$0.00' },
    { id: 3, referrer: 'Michael Brown', referee: 'Sarah Davis', date: '2023-09-28', status: 'Completed', amount: '$25.00' },
    { id: 4, referrer: 'Emily Wilson', referee: 'David Lee', date: '2023-09-25', status: 'Expired', amount: '$0.00' },
    { id: 5, referrer: 'James Taylor', referee: 'Jessica White', date: '2023-09-20', status: 'Completed', amount: '$25.00' },
  ]);
  
  const handleSettingChange = (field: string, value: string | boolean) => {
    setReferralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would call an API to save the referral settings
    toast({
      title: "Settings Saved",
      description: "Referral program settings have been updated successfully.",
    });
  };
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <CardTitle className="text-lg text-primary-700">Referral Program Manager</CardTitle>
        <CardDescription>
          Configure and manage your referral program
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Program Settings
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Referral History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <Switch 
                id="referral-enabled"
                checked={referralSettings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              />
              <Label htmlFor="referral-enabled" className="font-medium">
                Enable Referral Program
              </Label>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Reward Structure
                </h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reward-type">Who Receives Rewards</Label>
                      <Select 
                        value={referralSettings.rewardType} 
                        onValueChange={(value) => handleSettingChange('rewardType', value)}
                      >
                        <SelectTrigger id="reward-type">
                          <SelectValue placeholder="Select who receives rewards" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="referrer_only">Referrer Only</SelectItem>
                          <SelectItem value="referee_only">New User Only</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="min-transaction">Minimum Transaction Amount ($)</Label>
                      <Input 
                        id="min-transaction" 
                        value={referralSettings.minimumTransactionAmount}
                        onChange={(e) => handleSettingChange('minimumTransactionAmount', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(referralSettings.rewardType === 'referrer_only' || referralSettings.rewardType === 'both') && (
                      <div className="grid gap-2">
                        <Label>Referrer Reward</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={referralSettings.referrerReward}
                            onChange={(e) => handleSettingChange('referrerReward', e.target.value)}
                            className="flex-1"
                          />
                          <Select 
                            value={referralSettings.referrerRewardType} 
                            onValueChange={(value) => handleSettingChange('referrerRewardType', value)}
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">$ Fixed</SelectItem>
                              <SelectItem value="percentage">% Percent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                    
                    {(referralSettings.rewardType === 'referee_only' || referralSettings.rewardType === 'both') && (
                      <div className="grid gap-2">
                        <Label>New User Reward</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={referralSettings.refereeReward}
                            onChange={(e) => handleSettingChange('refereeReward', e.target.value)}
                            className="flex-1"
                          />
                          <Select 
                            value={referralSettings.refereeRewardType} 
                            onValueChange={(value) => handleSettingChange('refereeRewardType', value)}
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">$ Fixed</SelectItem>
                              <SelectItem value="percentage">% Percent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium mb-2 flex items-center">
                  <Sliders className="h-4 w-4 mr-1" />
                  Advanced Settings
                </h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry-days">Referral Link Expiry (Days)</Label>
                    <Input 
                      id="expiry-days" 
                      type="number"
                      min="0"
                      value={referralSettings.expiryDays}
                      onChange={(e) => handleSettingChange('expiryDays', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter 0 for no expiry
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="max-referrals">Maximum Referrals Per User</Label>
                    <Input 
                      id="max-referrals" 
                      type="number"
                      min="0"
                      value={referralSettings.maxReferralsPerUser}
                      onChange={(e) => handleSettingChange('maxReferralsPerUser', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter 0 for unlimited referrals
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="referral-levels">Multi-Level Referrals</Label>
                    <Select 
                      value={referralSettings.referralLevels} 
                      onValueChange={(value) => handleSettingChange('referralLevels', value)}
                    >
                      <SelectTrigger id="referral-levels">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Level (Direct only)</SelectItem>
                        <SelectItem value="2">2 Levels</SelectItem>
                        <SelectItem value="3">3 Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                <span>Save Settings</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="referrals" className="space-y-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Referrer</TableHead>
                    <TableHead>New User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reward Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">{referral.referrer}</TableCell>
                      <TableCell>{referral.referee}</TableCell>
                      <TableCell className="text-sm">{referral.date}</TableCell>
                      <TableCell>
                        <div className={`
                          px-2 py-1 rounded-full text-xs inline-flex items-center
                          ${referral.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                            referral.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                            'bg-gray-100 text-gray-700'}
                        `}>
                          {referral.status}
                        </div>
                      </TableCell>
                      <TableCell>{referral.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReferralsManager;
