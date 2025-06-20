
import React, { useState } from 'react';
import { Barcode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface BarcodeGeneratorProps {
  onGenerate: (dataUrl: string) => void;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [barcodeValue, setBarcodeValue] = useState('');
  const [barcodeType, setBarcodeType] = useState('code128');
  const [barcodeImage, setBarcodeImage] = useState<string | null>(null);
  
  const generateBarcode = async () => {
    if (!barcodeValue) {
      toast({
        title: "Cannot generate barcode",
        description: "Please enter a valid value",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create barcode using barcodeapi.org (simple approach)
      // In production, you'd want to use a library like jsbarcode
      const barcodeApiUrl = `https://barcodeapi.org/api/${barcodeType}/${encodeURIComponent(barcodeValue)}`;
      
      setBarcodeImage(barcodeApiUrl);
      onGenerate(barcodeApiUrl);
      
      toast({
        title: "Barcode generated",
        description: "Add it to your stamp design",
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast({
        title: "Failed to generate barcode",
        description: "Please try again with different parameters",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800">Barcode Generator</h3>
      
      <div className="space-y-2">
        <div className="grid gap-2">
          <Label htmlFor="barcode-value">Barcode Value</Label>
          <Input
            id="barcode-value"
            value={barcodeValue}
            onChange={(e) => setBarcodeValue(e.target.value)}
            placeholder="Enter text or numbers"
            className="w-full"
          />
        </div>
        
        <div className="grid gap-2 mt-2">
          <Label htmlFor="barcode-type">Barcode Type</Label>
          <Select value={barcodeType} onValueChange={setBarcodeType}>
            <SelectTrigger id="barcode-type">
              <SelectValue placeholder="Select barcode type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="code128">Code 128</SelectItem>
              <SelectItem value="code39">Code 39</SelectItem>
              <SelectItem value="ean13">EAN-13</SelectItem>
              <SelectItem value="upc">UPC</SelectItem>
              <SelectItem value="itf14">ITF-14</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        onClick={generateBarcode}
        className="w-full flex items-center gap-2"
      >
        <Barcode size={16} />
        Generate Barcode
      </Button>
      
      {barcodeImage && (
        <div className="mt-4 p-2 bg-gray-50 rounded-md flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <img 
            src={barcodeImage} 
            alt="Generated Barcode" 
            className="border rounded-md max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default BarcodeGenerator;
