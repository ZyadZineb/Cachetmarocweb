
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Share, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ExportDesignProps {
  svgRef: string | null;
  previewImage: string | null;
  productName: string;
  downloadAsPng: () => void;
  largeControls?: boolean;
}

const ExportDesign: React.FC<ExportDesignProps> = ({ 
  svgRef, 
  previewImage, 
  productName, 
  downloadAsPng,
  largeControls = false 
}) => {
  const { t } = useTranslation();
  const [showAnimation, setShowAnimation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleShareDesign = async () => {
    if (navigator.share && previewImage) {
      try {
        // Convert the data URL to a file
        const response = await fetch(previewImage);
        const blob = await response.blob();
        const file = new File([blob], `${productName.replace(/\s/g, '-')}-stamp-design.png`, { type: 'image/png' });

        await navigator.share({
          title: t('export.shareTitle', 'My Professional Stamp Design'),
          text: t('export.shareText', 'Check out my professional stamp design!'),
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing design:', error);
        // Fallback - open in new window
        if (previewImage) {
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(`<img src="${previewImage}" alt="Stamp Design" />`);
          }
        }
      }
    } else if (previewImage) {
      // Fallback for browsers that don't support the Web Share API
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${previewImage}" alt="Stamp Design" />`);
      }
    }
  };

  const handleVirtualStamping = () => {
    setShowAnimation(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <h3 className={`font-medium text-gray-800 ${largeControls ? "text-lg" : ""}`}>
        {t('export.title', 'Export Design')}
      </h3>
      
      <p className={`text-sm text-gray-600 ${largeControls ? "text-base" : ""}`}>
        {t('export.description', 'Download or share your professional stamp design')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={downloadAsPng} 
          disabled={!previewImage}
          variant="outline"
          className={`flex items-center gap-2 ${largeControls ? "text-lg py-6" : ""}`}
        >
          <Download size={largeControls ? 24 : 18} />
          {t('export.downloadImage', 'Download as Image')}
        </Button>
        
        {navigator.share && (
          <Button 
            onClick={handleShareDesign} 
            disabled={!previewImage}
            variant="outline"
            className={`flex items-center gap-2 ${largeControls ? "text-lg py-6" : ""}`}
          >
            <Share size={largeControls ? 24 : 18} />
            {t('export.shareDesign', 'Share Design')}
          </Button>
        )}

        <Button
          onClick={handleVirtualStamping}
          disabled={!previewImage}
          variant="outline"
          className={`flex items-center gap-2 ${largeControls ? "text-lg py-6" : ""}`}
        >
          <Play size={largeControls ? 24 : 18} />
          {t('export.printSimulation', 'Print Simulation')}
        </Button>
      </div>
      
      {previewImage && !showAnimation && (
        <div className="border rounded-md p-2 mt-2">
          <img 
            src={previewImage} 
            alt={t('export.stampDesign', 'Stamp design')}
            className="max-w-full h-auto"
          />
        </div>
      )}

      {previewImage && showAnimation && (
        <div className="border rounded-md p-2 mt-2 bg-amber-50">
          <div className="relative">
            <div className={`transition-all duration-500`}>
              <img 
                src={previewImage} 
                alt={t('export.stampDesign', 'Stamp design')}
                className="max-w-full h-auto"
                style={{
                  filter: isAnimating ? 'contrast(1.05)' : 'none',
                }}
              />
            </div>
            {isAnimating && (
              <div 
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              >
                <div className="bg-white bg-opacity-80 px-3 py-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">
                    {t('export.printing', 'Preview print result...')}
                  </p>
                </div>
              </div>
            )}
            {!isAnimating && showAnimation && (
              <div className="absolute bottom-2 right-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleVirtualStamping} 
                  className="bg-white"
                >
                  {t('export.viewAgain', 'Show Print Result Again')}
                </Button>
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600 border-t pt-2">
            <p className="text-center">
              {isAnimating 
                ? t('export.simulatingPrint', 'Showing print simulation...')
                : t('export.printResult', 'This is how your stamp will appear when printed on paper')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDesign;
