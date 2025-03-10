
import React, { useState, useEffect } from 'react';
import { Fingerprint } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { BiometricService } from '@/services/biometric';

const BiometricSettings: React.FC = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        setIsLoading(true);
        const available = await BiometricService.isAvailable();
        setIsBiometricAvailable(available);
        
        if (available) {
          const enabled = await BiometricService.isEnabled();
          setIsBiometricEnabled(enabled);
        }
      } catch (error) {
        console.error('Error checking biometric status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBiometrics();
  }, []);

  const handleToggleBiometric = async (checked: boolean) => {
    try {
      await BiometricService.setEnabled(checked);
      setIsBiometricEnabled(checked);
      toast.success(`Biometric authentication ${checked ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling biometric authentication:', error);
      toast.error('Failed to update biometric settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between py-2 opacity-50">
        <div className="flex items-center">
          <Fingerprint className="text-primary-500" />
          <div className="ml-3">
            <p className="text-sm font-medium">Biometric Authentication</p>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Switch disabled checked={false} />
      </div>
    );
  }

  if (!isBiometricAvailable) {
    return null; // Don't show the option if biometrics aren't available
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <Fingerprint className="text-primary-500" />
        <div className="ml-3">
          <p className="text-sm font-medium">Biometric Authentication</p>
          <p className="text-sm text-muted-foreground">
            Use Touch ID or Face ID for login
          </p>
        </div>
      </div>
      <Switch 
        checked={isBiometricEnabled} 
        onCheckedChange={handleToggleBiometric}
      />
    </div>
  );
};

export default BiometricSettings;
