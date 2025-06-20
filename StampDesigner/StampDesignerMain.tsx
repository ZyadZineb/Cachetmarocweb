
import React, { useState, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useStampDesigner } from '@/hooks/useStampDesigner';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import TextLinesEditor from './TextLinesEditor';
import StampPreview from './StampPreview';
import ColorSelector from './ColorSelector';
import LogoUploader from './LogoUploader';
import BorderStyleSelector from './BorderStyleSelector';
import SampleDesigns from './SampleDesigns';
import ProfessionalCircularTemplates from './ProfessionalCircularTemplates';
import AutoArrange from './AutoArrange';

interface StampDesignerMainProps {
  product: Product | null;
  onAddToCart?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

const StampDesignerMain: React.FC<StampDesignerMainProps> = ({ 
  product, 
  onAddToCart,
  highContrast = false,
  largeControls = false
}) => {
  const { 
    design, 
    updateLine, 
    addLine, 
    removeLine, 
    setInkColor,
    toggleLogo, 
    setLogoPosition,
    setBorderStyle,
    toggleCurvedText,
    updateTextPosition,
    updateLogoPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    previewImage,
    downloadAsPng,
    zoomIn,
    zoomOut,
    zoomLevel,
    applyTemplate,
    updateMultipleLines
  } = useStampDesigner(product);
  
  const { addToCart } = useCart();
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<'templates' | 'logo' | 'text' | 'border' | 'color'>('logo');

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add the product to cart with the custom text and preview
    const customText = design.lines.map(line => line.text).filter(Boolean).join(' | ');
    addToCart(product, 1, customText, design.inkColor, previewImage || undefined);
    
    // Call the optional callback
    if (onAddToCart) onAddToCart();
  };

  // Handle logo upload (simulated)
  const handleLogoUpload = () => {
    // For demo, we're using a sample logo
    // In a real app, this would connect to a file upload component
    const logoUrl = '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png';
    setUploadedLogo(logoUrl);
  };

  // Watch for logo changes to update the design
  React.useEffect(() => {
    if (uploadedLogo) {
      // Update the stamp design with the uploaded logo
      design.logoImage = uploadedLogo;
    }
  }, [uploadedLogo]);

  // Click handler for interactive preview text positioning
  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Calculate relative position (-100 to 100 range)
    const relativeX = ((clickX / rect.width) * 2 - 1) * 100;
    const relativeY = ((clickY / rect.height) * 2 - 1) * 100;
    
    // If a line is active, update its position
    if (activeLineIndex !== null) {
      updateTextPosition(activeLineIndex, relativeX, relativeY);
      startTextDrag(activeLineIndex);
    }
    // If no line is active but logo is included, update logo position
    else if (design.includeLogo) {
      updateLogoPosition(relativeX, relativeY);
      startLogoDrag();
    }
  };

  // Mouse move handler for dragging
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    event.preventDefault();
    
    const rect = previewRef.current.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Touch move handler for mobile drag support
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Start dragging
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handlePreviewClick(event);
  };

  // Start dragging (touch)
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    if (!previewRef.current || event.touches.length === 0) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const touch = event.touches[0];
    
    const relativeX = ((touch.clientX - rect.left) / rect.width * 2 - 1) * 100;
    const relativeY = ((touch.clientY - rect.top) / rect.height * 2 - 1) * 100;
    
    if (activeLineIndex !== null) {
      updateTextPosition(activeLineIndex, relativeX, relativeY);
      startTextDrag(activeLineIndex);
    } else if (design.includeLogo) {
      updateLogoPosition(relativeX, relativeY);
      startLogoDrag();
    }
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    stopDragging();
  };

  // Cleanup event listeners
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        stopDragging();
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, stopDragging]);

  // Navigate to the next step
  const goToNextStep = () => {
    if (currentStep === 'templates') setCurrentStep('logo');
    else if (currentStep === 'logo') setCurrentStep('text');
    else if (currentStep === 'text') setCurrentStep('border');
    else if (currentStep === 'border') setCurrentStep('color');
  };

  // Navigate to the previous step
  const goToPrevStep = () => {
    if (currentStep === 'color') setCurrentStep('border');
    else if (currentStep === 'border') setCurrentStep('text');
    else if (currentStep === 'text') setCurrentStep('logo');
    else if (currentStep === 'logo') setCurrentStep('templates');
  };

  if (!product) {
    return (
      <div className="p-8 text-center bg-white rounded-lg">
        <p className="text-gray-500">Please select a product to start designing your stamp.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <h2 className="text-xl font-semibold">Professional Stamp Designer</h2>
        <p className="text-sm text-gray-600">Designing: {product.name} ({product.size})</p>
        
        {/* Design progress indicator emphasizing logo-first approach */}
        <div className="flex mt-4 border-t pt-4">
          <div 
            className={`text-sm flex-1 text-center font-medium ${currentStep === 'templates' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('templates')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'templates' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
            Templates
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium ${currentStep === 'logo' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('logo')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'logo' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
            Logo
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium ${currentStep === 'text' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('text')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
            Text
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium ${currentStep === 'border' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('border')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'border' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>4</div>
            Border
          </div>
          <div 
            className={`text-sm flex-1 text-center font-medium ${currentStep === 'color' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setCurrentStep('color')}
          >
            <div className={`rounded-full w-6 h-6 mx-auto mb-1 flex items-center justify-center ${currentStep === 'color' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>5</div>
            Color
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left panel: Design options */}
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Show design step based on current step */}
          {currentStep === 'templates' && design.shape === 'circle' && (
            <ProfessionalCircularTemplates onApplyTemplate={applyTemplate} />
          )}

          {currentStep === 'logo' && (
            <LogoUploader
              includeLogo={design.includeLogo}
              toggleLogo={toggleLogo}
              logoX={design.logoX}
              logoY={design.logoY}
              uploadedLogo={uploadedLogo}
              onLogoUpload={handleLogoUpload}
              updateLogoPosition={updateLogoPosition}
              largeControls={largeControls}
            />
          )}
          
          {currentStep === 'text' && (
            <>
              <TextLinesEditor
                lines={design.lines}
                maxLines={product.lines}
                shape={design.shape}
                activeLineIndex={activeLineIndex}
                setActiveLineIndex={setActiveLineIndex}
                updateLine={updateLine}
                addLine={addLine}
                removeLine={removeLine}
                toggleCurvedText={toggleCurvedText}
                updateTextPosition={updateTextPosition}
                largeControls={largeControls}
              />
              
              {/* Add Auto-Arrange button for improved layout */}
              <AutoArrange 
                design={design}
                onArrange={updateMultipleLines}
                shape={design.shape}
              />
            </>
          )}
          
          {currentStep === 'border' && (
            <BorderStyleSelector 
              borderStyle={design.borderStyle} 
              onBorderStyleChange={setBorderStyle}
              largeControls={largeControls}
            />
          )}
          
          {currentStep === 'color' && (
            <ColorSelector 
              inkColors={product.inkColors} 
              selectedColor={design.inkColor} 
              onColorSelect={setInkColor}
              largeControls={largeControls}
            />
          )}
          
          {/* Step navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === 'logo'} // Start with logo as first step
              className={largeControls ? "text-lg py-3 px-5" : ""}
            >
              Previous
            </Button>
            
            <Button
              variant="default"
              onClick={goToNextStep}
              disabled={currentStep === 'color'}
              className={`${largeControls ? "text-lg py-3 px-5" : ""} ${highContrast ? "bg-blue-800" : ""}`}
            >
              Next
            </Button>
          </div>
        </div>
        
        {/* Right panel: Preview and add to cart */}
        <div className="space-y-6">
          <StampPreview
            previewImage={previewImage}
            productSize={product.size}
            previewRef={previewRef}
            isDragging={isDragging}
            activeLineIndex={activeLineIndex}
            includeLogo={design.includeLogo}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            downloadAsPng={downloadAsPng}
            zoomLevel={zoomLevel}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
          />
          
          <div className="space-y-4">
            <SampleDesigns />
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">{product.name}</h3>
                <span className="font-bold text-brand-red">{product.price} DHS TTC</span>
              </div>
              <Button
                onClick={handleAddToCart}
                className={`w-full py-3 bg-brand-red text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 ${largeControls ? "text-lg py-4" : ""}`}
              >
                <ShoppingCart size={largeControls ? 24 : 18} />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampDesignerMain;
