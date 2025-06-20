
import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface QrCodeGeneratorProps {
  onGenerate: (dataUrl: string) => void;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [qrValue, setQrValue] = useState('https://');
  const [qrSize, setQrSize] = useState(200);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [withLogo, setWithLogo] = useState(false);
  
  const generateQrCode = async () => {
    if (!qrValue || qrValue === 'https://') {
      toast({
        title: "Cannot generate QR code",
        description: "Please enter a valid URL or text",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create QR code using Google Charts API (simple approach)
      // In production, you'd want to use a library like qrcode.react
      const googleChartsUrl = 'https://chart.googleapis.com/chart?cht=qr' + 
        `&chs=${qrSize}x${qrSize}` +
        `&chl=${encodeURIComponent(qrValue)}` +
        `&chco=${darkColor.substring(1)}` +
        `&chf=bg,s,${lightColor.substring(1)}`;
      
      setQrImage(googleChartsUrl);
      onGenerate(googleChartsUrl);
      
      toast({
        title: "QR code generated",
        description: "Add it to your stamp design",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Failed to generate QR code",
        description: "Please try again with different parameters",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">QR Code Generator</h3>
      
      <div className="space-y-2">
        <div className="grid gap-2">
          <Label htmlFor="qr-url">URL or Text</Label>
          <Input
            id="qr-url"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            placeholder="https://example.com"
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label htmlFor="qr-foreground">Foreground Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="qr-foreground"
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-16 h-8"
              />
              <span className="text-xs">{darkColor}</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="qr-background">Background Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="qr-background"
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-16 h-8"
              />
              <span className="text-xs">{lightColor}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <Switch id="with-logo" checked={withLogo} onCheckedChange={setWithLogo} />
          <Label htmlFor="with-logo">Add logo to center (coming soon)</Label>
        </div>
      </div>
      
      <Button 
        onClick={generateQrCode}
        className="w-full flex items-center gap-2"
      >
        <QrCode size={16} />
        Generate QR Code
      </Button>
      
      {qrImage && (
        <div className="mt-4 p-2 bg-gray-50 rounded-md flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <img 
            src={qrImage} 
            alt="Generated QR Code" 
            className="border rounded-md max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
