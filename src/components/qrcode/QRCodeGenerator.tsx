
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share, Download, Copy, Check } from 'lucide-react';
import { isPlatform } from '@/utils/platformUtils';
import { Share as CapacitorShare } from '@capacitor/share';
import { useToast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  data: string;
  title?: string;
  description?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  data, 
  title = 'Your QR Code', 
  description = 'Scan this code to view transaction details' 
}) => {
  const [size, setSize] = useState<number>(200);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const handleDownload = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `yumvi-pay-qrcode-${new Date().getTime()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: 'QR Code Downloaded',
      description: 'The QR code image has been saved to your device'
    });
  };
  
  const handleShare = async () => {
    if (isPlatform('capacitor')) {
      try {
        // Convert QR code to base64 for sharing
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        if (!canvas) return;
        
        const imageData = canvas.toDataURL('image/png');
        
        await CapacitorShare.share({
          title: 'Yumvi Pay QR Code',
          text: 'Scan this QR code to access transaction details',
          url: imageData,
          dialogTitle: 'Share QR Code'
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
        toast({
          title: 'Share Failed',
          description: 'Could not share the QR code',
          variant: 'destructive'
        });
      }
    } else {
      // Fallback for web
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Yumvi Pay QR Code',
            text: 'Scan this QR code to access transaction details',
            url: window.location.href
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        handleCopy();
      }
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    
    toast({
      title: 'Copied to Clipboard',
      description: 'The QR code data has been copied to your clipboard'
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 text-center">{description}</p>
      
      <div className="bg-white p-4 rounded-lg shadow-inner">
        <QRCodeSVG
          id="qr-code-svg"
          value={data}
          size={size}
          level="H" // High error correction
          includeMargin={true}
          imageSettings={{
            src: '/logo-sm.png',
            excavate: true,
            height: size * 0.2,
            width: size * 0.2,
          }}
        />
        <canvas 
          id="qr-canvas" 
          style={{ display: 'none' }}
          width={size} 
          height={size}
        />
      </div>
      
      <div className="mt-4 mb-2 w-full">
        <label className="text-sm text-gray-500 mb-1 block">QR Code Size</label>
        <Select
          value={size.toString()}
          onValueChange={(value) => setSize(Number(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="150">Small</SelectItem>
            <SelectItem value="200">Medium</SelectItem>
            <SelectItem value="250">Large</SelectItem>
            <SelectItem value="300">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 w-full">
        <Button 
          onClick={handleShare}
          className="flex-1"
          variant="outline"
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Button 
          onClick={handleDownload}
          className="flex-1"
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        <Button 
          onClick={handleCopy}
          className="flex-1"
          variant={copied ? "default" : "outline"}
        >
          {copied ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
