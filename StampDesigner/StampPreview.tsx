
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StampPreviewProps {
  previewImage: string | null;
  productSize?: string;
  previewRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  activeLineIndex: number | null;
  includeLogo: boolean;
  downloadAsPng: () => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  highContrast?: boolean;
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

const StampPreview: React.FC<StampPreviewProps> = ({
  previewImage,
  productSize,
  previewRef,
  isDragging,
  activeLineIndex,
  includeLogo,
  downloadAsPng,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  highContrast = false,
  zoomLevel = 1,
  onZoomIn,
  onZoomOut
}) => {
  const { t } = useTranslation();
  
  // Add a grid pattern for precise alignment
  const gridSize = 5; // 5mm grid

  return (
    <Card className={highContrast ? "border-2 border-black" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className={`font-medium ${highContrast ? "text-black" : "text-gray-800"}`}>
            {t('preview.title', 'Stamp Preview')}
          </h3>
          
          <div className="flex items-center gap-2">
            {onZoomIn && onZoomOut && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onZoomOut} 
                  className="w-8 h-8 p-0" 
                  title={t('preview.zoomOut', 'Zoom Out')}
                >
                  <ZoomOut size={16} />
                </Button>
                <span className="text-sm text-gray-500">{Math.round(zoomLevel * 100)}%</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onZoomIn} 
                  className="w-8 h-8 p-0" 
                  title={t('preview.zoomIn', 'Zoom In')}
                >
                  <ZoomIn size={16} />
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAsPng}
              disabled={!previewImage}
              title={t('preview.download', 'Download')}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
        
        <div 
          className="relative border border-gray-200 rounded-md bg-white overflow-hidden"
          style={{ 
            minHeight: '200px',
            cursor: isDragging ? 'grabbing' : 
                    (activeLineIndex !== null || includeLogo) ? 'grab' : 'default'
          }}
        >
          {/* Grid for precision alignment */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width={gridSize * 10} height={gridSize * 10} patternUnits="userSpaceOnUse">
                <rect width={gridSize * 10} height={gridSize * 10} fill="url(#smallGrid)" />
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="gray" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Measurement ruler (horizontal) */}
            <rect x="0" y="0" width="100%" height="10" fill="white" fillOpacity="0.8" />
            {Array.from({ length: 10 }).map((_, i) => (
              <React.Fragment key={`h-${i}`}>
                <line x1={i * 10 * gridSize} y1="0" x2={i * 10 * gridSize} y2="10" stroke="black" strokeWidth="1" />
                <text x={i * 10 * gridSize + 2} y="8" fontSize="8" fill="black">{i * 10}</text>
              </React.Fragment>
            ))}
            
            {/* Measurement ruler (vertical) */}
            <rect x="0" y="0" width="10" height="100%" fill="white" fillOpacity="0.8" />
            {Array.from({ length: 10 }).map((_, i) => (
              <React.Fragment key={`v-${i}`}>
                <line x1="0" y1={i * 10 * gridSize} x2="10" y2={i * 10 * gridSize} stroke="black" strokeWidth="1" />
                <text x="2" y={i * 10 * gridSize + 8} fontSize="8" fill="black">{i * 10}</text>
              </React.Fragment>
            ))}
          </svg>
          
          {previewImage ? (
            <div 
              ref={previewRef}
              className="flex items-center justify-center p-4 w-full min-h-[200px] select-none"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onMouseUp}
              style={{ 
                transform: `scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-in-out'
              }}
            >
              <img 
                src={previewImage} 
                alt={t('preview.stampPreview', 'Stamp preview')}
                className="object-contain max-w-full max-h-full"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 bg-gray-50">
              <p className="text-gray-400">
                {t('preview.noPreview', 'No preview available')}
              </p>
            </div>
          )}
        </div>
        
        {productSize && (
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-500">
              {t('preview.physicalSize', 'Physical size')}: {productSize}mm
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StampPreview;
