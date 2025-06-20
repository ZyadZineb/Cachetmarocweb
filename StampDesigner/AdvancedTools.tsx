
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QrCodeGenerator from './QrCodeGenerator';
import BarcodeGenerator from './BarcodeGenerator';
import ExportDesign from './ExportDesign';
import { useTranslation } from 'react-i18next';

interface AdvancedToolsProps {
  svgRef: string | null;
  previewImage: string | null;
  productName: string;
  downloadAsPng: () => void;
  onAddElement: (element: { type: string, dataUrl: string, width: number, height: number }) => void;
  largeControls?: boolean;
}

const AdvancedTools: React.FC<AdvancedToolsProps> = ({
  svgRef,
  previewImage,
  productName,
  downloadAsPng,
  onAddElement,
  largeControls = false
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('qr-code');
  
  const handleQrCodeGenerated = (dataUrl: string) => {
    onAddElement({
      type: 'qrcode',
      dataUrl,
      width: 50,
      height: 50
    });
  };
  
  const handleBarcodeGenerated = (dataUrl: string) => {
    onAddElement({
      type: 'barcode',
      dataUrl,
      width: 80,
      height: 40
    });
  };
  
  return (
    <div className="space-y-4">
      <h3 className={`font-medium text-gray-800 ${largeControls ? "text-lg" : ""}`}>
        {t('advancedTools.title', 'Advanced Tools')}
      </h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid grid-cols-3 mb-4 ${largeControls ? "text-lg" : ""}`}>
          <TabsTrigger value="qr-code">
            {t('advancedTools.qrCode', 'QR Code')}
          </TabsTrigger>
          <TabsTrigger value="barcode">
            {t('advancedTools.barcode', 'Barcode')}
          </TabsTrigger>
          <TabsTrigger value="export">
            {t('advancedTools.export', 'Export')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="qr-code">
          <QrCodeGenerator onGenerate={handleQrCodeGenerated} />
        </TabsContent>
        
        <TabsContent value="barcode">
          <BarcodeGenerator onGenerate={handleBarcodeGenerated} />
        </TabsContent>
        
        <TabsContent value="export">
          <ExportDesign
            svgRef={svgRef}
            previewImage={previewImage} 
            productName={productName} 
            downloadAsPng={downloadAsPng}
            largeControls={largeControls}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedTools;
