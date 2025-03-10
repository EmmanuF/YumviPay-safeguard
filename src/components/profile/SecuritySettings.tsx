
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Fingerprint, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettingsProps {
  onChangePassword: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onChangePassword }) => {
  const { toast } = useToast();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const handleBiometricToggle = (checked: boolean) => {
    setBiometricEnabled(checked);
    toast({
      title: checked ? "Biometric authentication enabled" : "Biometric authentication disabled",
      description: checked 
        ? "You can now use fingerprint or face ID to authenticate" 
        : "You'll need to use your password to authenticate",
    });
  };
  
  const handleTwoFactorToggle = (checked: boolean) => {
    if (checked) {
      // In a real app, this would trigger the 2FA setup process
      toast({
        title: "2FA Setup Required",
        description: "Please complete the setup process to enable two-factor authentication",
      });
      // Don't actually enable it yet since setup isn't complete
    } else {
      setTwoFactorEnabled(false);
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account is now protected with just your password",
      });
    }
  };
  
  const handleSetupTwoFactor = () => {
    // This would launch the 2FA setup flow
    toast({
      title: "Setting up two-factor authentication",
      description: "Follow the instructions to complete setup",
    });
    
    // Simulate successful setup after 2 seconds
    setTimeout(() => {
      setTwoFactorEnabled(true);
      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now protected with an additional layer of security",
      });
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-muted-foreground">Change your account password</p>
            </div>
          </div>
          <Button variant="outline" onClick={onChangePassword}>
            Change
          </Button>
        </div>
        
        {/* Biometric Authentication */}
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Fingerprint className="w-5 h-5 text-primary-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Biometric Authentication</h3>
              <p className="text-sm text-muted-foreground">Use Touch ID or Face ID to log in</p>
            </div>
          </div>
          <Switch 
            checked={biometricEnabled} 
            onCheckedChange={handleBiometricToggle} 
          />
        </div>
        
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-primary-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
          </div>
          {twoFactorEnabled ? (
            <Switch 
              checked={twoFactorEnabled} 
              onCheckedChange={handleTwoFactorToggle} 
            />
          ) : (
            <Button variant="outline" onClick={handleSetupTwoFactor}>
              Setup
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
