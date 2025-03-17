
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraPermissionState } from '@capacitor/camera';
import { isPlatform } from '@/utils/platformUtils';

interface UseQRCodeOptions {
  onScan?: (data: string) => void;
  validateQrData?: (data: string) => boolean | Promise<boolean>;
}

export const useQRCode = (options: UseQRCodeOptions = {}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { onScan, validateQrData } = options;
  const { toast } = useToast();

  // Check for camera permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      if (isPlatform('capacitor')) {
        try {
          const permissionStatus = await Camera.checkPermissions();
          if (permissionStatus.camera !== 'granted') {
            console.log('Camera permission not granted. Will request when needed.');
          }
        } catch (err) {
          console.error('Error checking camera permissions:', err);
        }
      }
    };
    
    checkPermissions();
  }, []);

  // Handle successful QR code scan
  const handleScanSuccess = useCallback(async (data: string) => {
    setQrData(data);
    setIsScanning(false);
    
    try {
      // Validate QR data if validation function provided
      if (validateQrData) {
        const isValid = await validateQrData(data);
        
        if (!isValid) {
          setError('Invalid QR code format');
          toast({
            title: 'Invalid QR Code',
            description: 'The scanned QR code is not valid for this application',
            variant: 'destructive'
          });
          return;
        }
      }
      
      // Call onScan callback if provided
      if (onScan) {
        onScan(data);
      }
      
      toast({
        title: 'QR Code Scanned',
        description: 'QR code successfully read',
      });
      
    } catch (err: any) {
      setError(err.message || 'Error processing QR code');
      toast({
        title: 'QR Code Error',
        description: err.message || 'Error processing QR code',
        variant: 'destructive'
      });
    }
  }, [onScan, validateQrData, toast]);

  // Toggle scanner state
  const toggleScanner = useCallback(() => {
    setIsScanning(prev => !prev);
    if (error) setError(null);
  }, [error]);

  // Generate a QR code data string for transactions
  const generateTransactionQR = useCallback((transactionData: any): string => {
    // Create a structured object for QR code data
    const qrData = {
      type: 'yumvi-pay-transaction',
      id: transactionData.id || '',
      amount: transactionData.amount || 0,
      currency: transactionData.targetCurrency || '',
      recipient: transactionData.recipientName || '',
      timestamp: new Date().toISOString(),
    };
    
    // Convert to JSON string for QR code
    return JSON.stringify(qrData);
  }, []);

  // Parse transaction QR code data
  const parseTransactionQR = useCallback((qrString: string): any | null => {
    try {
      const data = JSON.parse(qrString);
      
      // Validate expected structure
      if (data.type !== 'yumvi-pay-transaction' || !data.id) {
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error parsing QR data:', err);
      return null;
    }
  }, []);

  return {
    isScanning,
    qrData,
    error,
    toggleScanner,
    handleScanSuccess,
    generateTransactionQR,
    parseTransactionQR,
    setIsScanning,
  };
};
