
import React, { useState, useRef, useEffect } from 'react';
import { Camera } from '@capacitor/camera';
import { isPlatform } from '@/utils/platformUtils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, QrCode } from 'lucide-react';
import jsQR from 'jsqr';

interface QRCodeScannerProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ 
  onScanSuccess, 
  onClose,
  isOpen 
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Start scanning when component mounts or isOpen changes to true
  useEffect(() => {
    if (isOpen) {
      startScanner();
    }
    
    return () => {
      stopScanner();
    };
  }, [isOpen]);
  
  const startScanner = async () => {
    setError(null);
    setIsScanning(true);
    
    try {
      if (isPlatform('capacitor')) {
        // On native mobile, use the Camera API
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: 'base64',
          source: 'CAMERA'
        });
        
        if (image.base64String) {
          processImageData(image.base64String);
        } else {
          throw new Error('No image data received');
        }
      } else {
        // On web, use the web camera API
        startWebCamera();
      }
    } catch (err: any) {
      console.error('QR Scanner error:', err);
      setError(err.message || 'Failed to start camera');
      setIsScanning(false);
      
      toast({
        title: 'Camera Error',
        description: 'Could not access the camera. Please check permissions.',
        variant: 'destructive'
      });
    }
  };
  
  const stopScanner = () => {
    setIsScanning(false);
    
    // Stop web camera if active
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  const startWebCamera = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 } 
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      
      // Start scanning frames
      requestAnimationFrame(scanFrame);
    } catch (err: any) {
      setError(err.message || 'Camera access denied');
      setIsScanning(false);
    }
  };
  
  const scanFrame = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      
      if (code) {
        // QR code detected
        stopScanner();
        onScanSuccess(code.data);
        return;
      }
    }
    
    // Continue scanning
    requestAnimationFrame(scanFrame);
  };
  
  const processImageData = (base64Data: string) => {
    try {
      const image = new Image();
      image.onload = () => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          
          if (code) {
            onScanSuccess(code.data);
          } else {
            setError('No QR code found in image');
            toast({
              title: 'No QR Code Found',
              description: 'Please try again with a clearer image',
              variant: 'destructive'
            });
          }
        }
        
        setIsScanning(false);
      };
      
      image.onerror = () => {
        setError('Failed to load image');
        setIsScanning(false);
      };
      
      image.src = `data:image/jpeg;base64,${base64Data}`;
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
      setIsScanning(false);
    }
  };
  
  const handleTryAgain = () => {
    startScanner();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-primary-500" />
            Scan QR Code
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          {isScanning ? (
            <div className="flex flex-col items-center">
              {!isPlatform('capacitor') && (
                <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                  />
                  <div className="absolute inset-0 border-2 border-primary-500 rounded-md opacity-50" />
                </div>
              )}
              
              {isPlatform('capacitor') && (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                  <p className="ml-2 text-sm">Processing camera input...</p>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={handleTryAgain}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-4">Camera will be used to scan QR codes</p>
              <Button onClick={startScanner}>
                Start Scanner
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-xs text-gray-500">
            Align the QR code within the scanner frame to capture it automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
