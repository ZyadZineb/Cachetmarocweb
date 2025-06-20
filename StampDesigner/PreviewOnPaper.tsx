
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { Check } from 'lucide-react';

interface PreviewOnPaperProps {
  previewImage: string | null;
  productName?: string;
  productSize?: string;
  onAnimate?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
  isDragging?: boolean;
  activeLineIndex?: number | null;
  includeLogo?: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
  downloadAsPng?: () => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
  zoomLevel?: number;
  background?: string;
  isAnimatingProp?: boolean;  // Renamed from isAnimating to isAnimatingProp
}

const PreviewOnPaper: React.FC<PreviewOnPaperProps> = ({
  previewImage,
  productName,
  productSize,
  onAnimate,
  highContrast = false,
  largeControls = false,
  isDragging = false,
  activeLineIndex = null,
  includeLogo = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  downloadAsPng,
  zoomIn,
  zoomOut,
  zoomLevel = 1,
  background = 'white',
  isAnimatingProp = false  // Renamed prop
}) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(isAnimatingProp);  // Initialize with prop value
  const [currentSurface, setCurrentSurface] = useState<string>('white');
  
  // Update internal state when prop changes
  React.useEffect(() => {
    setIsAnimating(isAnimatingProp);
  }, [isAnimatingProp]);
  
  const surfaces = [
    { id: 'white', label: 'White Paper', color: 'bg-white' },
    { id: 'cream', label: 'Cream Paper', color: 'bg-amber-50' },
    { id: 'colored', label: 'Colored Paper', color: 'bg-blue-100' },
    { id: 'envelope', label: 'Envelope', color: 'bg-yellow-100' },
    { id: 'card', label: 'Business Card', color: 'bg-gray-100' },
  ];

  const handleAnimate = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
    
    if (onAnimate) onAnimate();
  };

  const getSurfaceStyle = () => {
    const surface = surfaces.find(s => s.id === currentSurface);
    return surface ? surface.color : 'bg-white';
  };

  return (
    <div className="space-y-4">
      <h3 className={`font-medium ${highContrast ? 'text-black' : 'text-gray-800'}`}>
        {t('preview.onPaper', "Preview on Surface")}
      </h3>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {surfaces.map(surface => (
          <button
            key={surface.id}
            onClick={() => setCurrentSurface(surface.id)}
            className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
              surface.id === currentSurface 
                ? (highContrast ? 'bg-gray-800 text-white' : 'bg-brand-blue text-white') 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {t(`preview.surface.${surface.id}`, surface.label)}
          </button>
        ))}
      </div>
      
      <div className={`rounded-lg p-6 shadow-inner ${getSurfaceStyle()} relative`}>
        {previewImage ? (
          <div className={`flex justify-center items-center ${isAnimating ? 'animate-bounce' : ''}`}>
            <div 
              className="relative" 
              style={{
                filter: isAnimating ? 'contrast(1.1) brightness(0.95)' : 'none',
                transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <img 
                src={previewImage} 
                alt={t('preview.stampPreview', "Stamp preview")}
                className={`w-full max-w-xs mx-auto transition-all duration-300 transform ${
                  isAnimating ? 'opacity-100' : 'opacity-90'
                }`}
              />
              {currentSurface === 'envelope' && (
                <div className="absolute inset-0 bg-[url('/lovable-uploads/53ca1f4f-4e7e-4879-ad4b-e665d96511fd.png')] bg-center bg-contain bg-no-repeat opacity-20"></div>
              )}
              {currentSurface === 'card' && (
                <div className="absolute inset-0 bg-[url('/lovable-uploads/4860f75e-9a1e-43c9-89b4-448b485c8af2.png')] bg-center bg-contain bg-no-repeat opacity-20"></div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-400">
            {t('preview.noPreview', "No preview available")}
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <HelpTooltip content={t('preview.animateTooltip', "See how your stamp will look when stamping on paper")}>
          <Button 
            onClick={handleAnimate} 
            disabled={!previewImage}
            variant="outline"
            size={largeControls ? "lg" : "default"}
            className="mt-2"
          >
            <Check className="mr-2" size={largeControls ? 20 : 16} />
            {t('preview.animate', "Simulate Stamping")}
          </Button>
        </HelpTooltip>
      </div>
    </div>
  );
};

export default PreviewOnPaper;
