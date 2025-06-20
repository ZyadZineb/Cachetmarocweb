
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextPositioningService } from '@/utils/TextPositioningService';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StampPreviewAccessibleProps {
  previewImage: string | null;
  productSize: string;
  isDragging?: boolean;
  activeLineIndex?: number | null;
  includeLogo?: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove?: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void;
  downloadAsPng?: () => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
  zoomLevel?: number;
  background?: string;
  highContrast?: boolean;
  largeControls?: boolean;
  isAnimating?: boolean;
  showSafeZone?: boolean;
  shape?: 'rectangle' | 'circle' | 'square';
  resetView?: () => void;
}

const StampPreviewAccessible: React.FC<StampPreviewAccessibleProps> = ({
  previewImage,
  productSize,
  isDragging = false,
  activeLineIndex = null,
  includeLogo = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  downloadAsPng,
  zoomIn,
  zoomOut,
  zoomLevel = 1,
  background = 'none',
  highContrast = false,
  largeControls = false,
  isAnimating = false,
  showSafeZone = true,
  shape = 'rectangle',
  resetView
}) => {
  const { t } = useTranslation();
  const [showSafeZoneLocal, setShowSafeZone] = useState(showSafeZone);

  // Get the safe zone margins based on the shape - exactly 1mm
  const getSafeZoneMargins = () => {
    const safeZone = TextPositioningService.getSafeZone(shape);
    return {
      marginTop: `${safeZone.top}%`,
      marginRight: `${safeZone.right}%`,
      marginBottom: `${safeZone.bottom}%`,
      marginLeft: `${safeZone.left}%`,
    };
  };

  const safeZoneMargins = getSafeZoneMargins();

  // Get CSS class for the safe zone based on shape
  const getSafeZoneClass = () => {
    if (shape === 'circle') {
      return 'rounded-full';
    } else if (shape === 'square') {
      return 'rounded-md';
    } else {
      return 'rounded-md';
    }
  };

  // Calculate size of the safe zone container
  const getSafeZoneSize = () => {
    const safeZone = TextPositioningService.getSafeZone(shape);
    // Calculate percentages to subtract from 100%
    const width = 100 - safeZone.left - safeZone.right;
    const height = 100 - safeZone.top - safeZone.bottom;

    return {
      width: `${width}%`,
      height: `${height}%`,
    };
  };

  const safeZoneSize = getSafeZoneSize();

  // Toggle safe zone visibility
  const toggleSafeZone = () => {
    setShowSafeZone(prev => !prev);
  };

  return (
    <div className={`relative overflow-hidden border rounded-lg ${highContrast ? 'border-gray-800' : 'border-gray-300'}`}>
      {/* Preview Controls Overlay */}
      <div className="absolute top-2 right-2 z-10 flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={toggleSafeZone}
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
              >
                {showSafeZoneLocal ? <Eye size={16} /> : <EyeOff size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showSafeZoneLocal ? "Hide" : "Show"} safe zone (1mm)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={zoomOut}
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
                disabled={zoomLevel && zoomLevel <= 1}
              >
                <ZoomOut size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={zoomIn}
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
                disabled={zoomLevel && zoomLevel >= 3}
              >
                <ZoomIn size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom in</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {zoomLevel && zoomLevel > 1 && resetView && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={resetView}
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
                >
                  <RefreshCw size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset view</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div 
        className={`relative flex items-center justify-center aspect-square ${
          isAnimating ? 'animate-pulse' : ''
        }`}
        style={{ 
          backgroundColor: background !== 'none' ? background : 'white',
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* Stamp Preview Image */}
        <div
          className="relative w-full h-full cursor-pointer select-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="button"
          aria-label={t('preview.interactivePreview', 'Interactive preview - click to position elements')}
          tabIndex={0}
        >
          {/* Stamp Preview SVG/Image */}
          {previewImage && (
            <img 
              src={previewImage} 
              alt={t('preview.stampPreview', 'Stamp Preview')} 
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
          )}
          
          {/* Safe zone indicator - 1mm exact margin */}
          {showSafeZoneLocal && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* For circular stamps */}
              {shape === 'circle' && (
                <div 
                  className="absolute border border-dashed border-blue-200 rounded-full opacity-70"
                  style={{ 
                    width: safeZoneSize.width, 
                    height: safeZoneSize.height
                  }}
                  aria-label="1mm safe zone boundary"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] text-blue-300 bg-white/50 px-1 rounded">1mm</span>
                  </div>
                </div>
              )}
              
              {/* For rectangle or square stamps */}
              {shape !== 'circle' && (
                <div 
                  className="absolute border border-dashed border-blue-200 opacity-70"
                  style={{ 
                    width: safeZoneSize.width, 
                    height: safeZoneSize.height,
                    borderRadius: shape === 'square' ? '4px' : '2px'
                  }}
                  aria-label="1mm safe zone boundary"
                >
                  {/* Safe zone label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] text-blue-300 bg-white/50 px-1 rounded">1mm</span>
                  </div>
                  
                  {/* Edge indicators */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-white/50 px-1 rounded">
                    <span className="text-[6px] text-blue-300">1mm</span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white/50 px-1 rounded">
                    <span className="text-[6px] text-blue-300">1mm</span>
                  </div>
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 bg-white/50 px-1 rounded">
                    <span className="text-[6px] text-blue-300">1mm</span>
                  </div>
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 bg-white/50 px-1 rounded">
                    <span className="text-[6px] text-blue-300">1mm</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Drag state indicator */}
          {isDragging && (
            <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-xs py-1 text-center">
              {activeLineIndex !== null 
                ? t('preview.draggingText', 'Dragging Text Line {{number}}', { number: activeLineIndex + 1 }) 
                : includeLogo 
                  ? t('preview.draggingLogo', 'Dragging Logo') 
                  : t('preview.dragging', 'Dragging')}
            </div>
          )}
        </div>
      </div>
      
      {/* Size label */}
      <div className={`absolute bottom-0 right-0 px-2 py-1 text-xs ${
        highContrast ? 'bg-gray-800 text-white' : 'bg-white/70 text-gray-700'
      }`}>
        {productSize}
      </div>
    </div>
  );
};

export default StampPreviewAccessible;
