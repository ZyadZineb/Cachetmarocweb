
import React, { useRef, useState } from 'react';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface StampPreviewProps {
  previewImage: string | null;
  productSize: string;
  isDragging: boolean;
  activeLineIndex: number | null;
  includeLogo: boolean;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
  onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;
  downloadAsPng: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomLevel: number;
}

const StampPreviewEnhanced: React.FC<StampPreviewProps> = ({
  previewImage,
  productSize,
  isDragging,
  activeLineIndex,
  includeLogo,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  downloadAsPng,
  zoomIn,
  zoomOut,
  zoomLevel
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });

  const handlePanStart = (clientX: number, clientY: number) => {
    if (zoomLevel <= 1) return; // Only allow panning when zoomed in
    
    setIsPanning(true);
    setStartPanPos({
      x: clientX - panPosition.x,
      y: clientY - panPosition.y
    });
  };

  const handlePanMove = (clientX: number, clientY: number) => {
    if (!isPanning || zoomLevel <= 1) return;
    
    const maxPan = (zoomLevel - 1) * 100; // Maximum pan distance based on zoom level
    
    let newX = clientX - startPanPos.x;
    let newY = clientY - startPanPos.y;
    
    // Constrain pan within bounds
    newX = Math.max(Math.min(newX, maxPan), -maxPan);
    newY = Math.max(Math.min(newY, maxPan), -maxPan);
    
    setPanPosition({ x: newX, y: newY });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const handleMouseDownForPan = (e: React.MouseEvent<HTMLDivElement>) => {
    // If we're in dragging mode for text/logo positioning, don't start panning
    if (activeLineIndex !== null || (includeLogo && !isDragging)) {
      onMouseDown(e);
    } else {
      handlePanStart(e.clientX, e.clientY);
    }
  };

  const handleMouseMoveForPan = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      onMouseMove(e);
    } else if (isPanning) {
      handlePanMove(e.clientX, e.clientY);
    }
  };

  const handleMouseUpForPan = () => {
    if (isDragging) {
      onMouseUp();
    } else if (isPanning) {
      handlePanEnd();
    }
  };

  const handleTouchStartForPan = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    
    if (activeLineIndex !== null || (includeLogo && !isDragging)) {
      onTouchStart(e);
    } else {
      handlePanStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMoveForPan = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    
    if (isDragging) {
      onTouchMove(e);
    } else if (isPanning) {
      handlePanMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEndForPan = () => {
    if (isDragging) {
      onMouseUp();
    } else if (isPanning) {
      handlePanEnd();
    }
  };

  const resetZoomAndPan = () => {
    // Reset to default zoom and pan position
    setPanPosition({ x: 0, y: 0 });
  };

  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">Live Preview</h3>
        <div className="flex gap-2">
          <p className="text-xs text-gray-600 self-center">
            {productSize} mm
          </p>
          <Button 
            onClick={downloadAsPng}
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={!previewImage}
          >
            <Download size={16} />
            Download PNG
          </Button>
        </div>
      </div>
      
      {/* Zoom controls */}
      <div className="flex items-center justify-between mb-3 px-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={zoomOut}
          disabled={zoomLevel <= 1}
          className="p-1 h-8 w-8"
        >
          <ZoomOut size={16} />
        </Button>
        
        <Slider
          value={[zoomLevel * 100]}
          min={100}
          max={300}
          step={25}
          className="w-[calc(100%-5rem)] mx-2"
          onValueChange={(value) => {
            // Reset pan position when zoom level changes
            if (value[0] / 100 <= 1) {
              setPanPosition({ x: 0, y: 0 });
            }
          }}
        />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={zoomIn}
          disabled={zoomLevel >= 3}
          className="p-1 h-8 w-8"
        >
          <ZoomIn size={16} />
        </Button>
      </div>
      
      <div className="overflow-hidden rounded-md">
        <div 
          className={`
            flex justify-center items-center bg-white border p-4 min-h-60 
            ${isPanning || (zoomLevel > 1) ? 'cursor-grab' : 'cursor-pointer'} 
            ${isPanning ? 'cursor-grabbing' : ''} 
            relative touch-none
          `}
          ref={previewRef}
          onMouseDown={handleMouseDownForPan}
          onMouseMove={handleMouseMoveForPan}
          onMouseUp={handleMouseUpForPan}
          onMouseLeave={handleMouseUpForPan}
          onTouchStart={handleTouchStartForPan}
          onTouchMove={handleTouchMoveForPan}
          onTouchEnd={handleTouchEndForPan}
          style={{
            height: '300px',
            overflow: 'hidden'
          }}
        >
          {previewImage ? (
            <div
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                transformOrigin: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img 
                src={previewImage} 
                alt="Stamp Preview" 
                className="max-w-full max-h-48 pointer-events-none"
                draggable="false"
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Start designing to see a preview
            </p>
          )}
          
          {activeLineIndex !== null && !isDragging && (
            <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center pointer-events-none">
              <p className="bg-white/90 text-xs px-3 py-1 rounded-lg shadow text-gray-600">
                Drag to position Line {activeLineIndex + 1}
              </p>
            </div>
          )}
          
          {includeLogo && activeLineIndex === null && !isDragging && (
            <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center pointer-events-none">
              <p className="bg-white/90 text-xs px-3 py-1 rounded-lg shadow text-gray-600">
                Drag to position Logo
              </p>
            </div>
          )}
          
          {zoomLevel > 1 && !isDragging && !isPanning && (
            <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center pointer-events-none">
              <p className="bg-white/90 text-xs px-3 py-1 rounded-lg shadow text-gray-600">
                Click and drag to pan
              </p>
            </div>
          )}
        </div>
      </div>
      
      {zoomLevel > 1 && (
        <div className="mt-2">
          <Button variant="ghost" size="sm" onClick={resetZoomAndPan} className="text-xs w-full">
            Reset View
          </Button>
        </div>
      )}
      
      {isDragging ? (
        <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
          <p>Release to set position</p>
        </div>
      ) : activeLineIndex !== null ? (
        <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
          <p>Click and drag in the preview area to position Line {activeLineIndex + 1}</p>
        </div>
      ) : includeLogo && activeLineIndex === null ? (
        <div className="mt-2 text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">
          <p>Click and drag in the preview area to position your logo</p>
        </div>
      ) : null}
    </div>
  );
};

export default StampPreviewEnhanced;
