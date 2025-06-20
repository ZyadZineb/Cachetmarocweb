
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Save, ZoomIn, ZoomOut } from 'lucide-react';
import useStampDesignerEnhanced from '@/hooks/useStampDesignerEnhanced';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from 'react-i18next';
import StampPreviewAccessible from './StampPreviewAccessible';
import ColorSelector from './ColorSelector';
import LogoUploader from './LogoUploader';
import BorderStyleSelector from './BorderStyleSelector';
import SimplifiedTextEditor from './SimplifiedTextEditor';
import PreviewOnPaper from './PreviewOnPaper';
import { useStampDesigner } from '@/hooks/useStampDesigner';

// Define the wizard step type with reduced steps
type WizardStepType = 'structure' | 'text' | 'logo' | 'color' | 'preview';

interface StampDesignerSimplifiedProps {
  product: Product | null;
  onAddToCart?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

const StampDesignerSimplified: React.FC<StampDesignerSimplifiedProps> = ({
  product,
  onAddToCart,
  highContrast = false,
  largeControls = false
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Use the stamp designer hook
  const { 
    design, 
    updateLine, 
    addLine, 
    removeLine, 
    setInkColor,
    toggleLogo, 
    setBorderStyle,
    toggleCurvedText,
    updateTextPosition,
    updateLogoPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    previewImage,
    generatePreview,
    validateDesign,
    saveDesign,
    loadDesign,
    hasSavedDesign,
    clearSavedDesign,
    zoomIn,
    zoomOut,
    zoomLevel,
    svgRef,
    downloadAsPng,
    distributeTextLines,
    enforceTextBoundaries,
    detectTextCollisions
  } = useStampDesigner(product);
  
  const { addToCart } = useCart();
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStepType>('structure');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewBackground, setPreviewBackground] = useState<string>('none');
  const [showAnimation, setShowAnimation] = useState(false);
  const [safeZoneVisible, setSafeZoneVisible] = useState(true);
  
  // Simplified steps configuration
  const steps = [
    { id: 'structure' as WizardStepType, label: 'Structure', description: 'Choose your stamp border style' },
    { id: 'text' as WizardStepType, label: 'Text', description: 'Add and format your text' },
    { id: 'logo' as WizardStepType, label: 'Logo', description: 'Add a logo if needed' },
    { id: 'color' as WizardStepType, label: 'Color', description: 'Select ink color' },
    { id: 'preview' as WizardStepType, label: 'Preview', description: 'Review and finalize your design' }
  ];
  
  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  // Navigation functions
  const goToNextStep = () => {
    const errors = validateDesign(currentStep);
    setValidationErrors(errors);
    
    // Add a validation check for text boundaries
    if (errors.length === 0) {
      // Check if text might be outside safe zones
      let hasPositioningIssues = false;
      if (currentStep === 'text' && design) {
        // Enforce text boundaries before proceeding
        enforceTextBoundaries();
        
        // Check if there are still overlaps
        if (detectTextCollisions()) {
          distributeTextLines();
          hasPositioningIssues = true;
          toast({
            title: t('textEditor.positioningFixed', 'Text Positioning Fixed'),
            description: t('textEditor.automaticAdjustment', 'Your text has been automatically adjusted to ensure proper spacing'),
          });
        }
      }
      
      // If no positioning issues or they've been fixed, proceed
      if (!hasPositioningIssues) {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
          setCurrentStep(steps[nextIndex].id);
        }
      }
    }
  };
  
  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = () => {
    const logoUrl = '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png';
    setUploadedLogo(logoUrl);
  };

  // Watch for logo changes to update the design
  useEffect(() => {
    if (uploadedLogo) {
      design.logoImage = uploadedLogo;
    }
  }, [uploadedLogo]);

  // Click handler for interactive preview text positioning
  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('nativeEvent' in event && 'clientX' in event.nativeEvent) {
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return;
    }
    
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    
    const relativeX = ((clickX / rect.width) * 2 - 1) * 100;
    const relativeY = ((clickY / rect.height) * 2 - 1) * 100;
    
    if (activeLineIndex !== null) {
      updateTextPosition(activeLineIndex, relativeX, relativeY);
      startTextDrag(activeLineIndex);
    } else if (design.includeLogo) {
      updateLogoPosition(relativeX, relativeY);
      startLogoDrag();
    }
  };

  // Start dragging
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handlePreviewClick(event);
  };

  // Start dragging (touch)
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    if (event.touches.length === 0) return;
    handlePreviewClick(event);
  };

  // Mouse move handler for dragging
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    event.preventDefault();
    
    const rect = event.currentTarget.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Touch move handler for mobile drag support
  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || event.touches.length === 0) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    handleDrag(event, rect);
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    stopDragging();
    
    // After dragging stops, enforce text boundaries
    if (activeLineIndex !== null) {
      enforceTextBoundaries();
    }
  };

  // Save current design
  const handleSaveDesign = () => {
    // Enforce boundaries before saving
    enforceTextBoundaries();
    saveDesign();
    toast({
      title: t('design.saved', "Design saved"),
      description: t('design.savedDescription', "Your design has been saved and will be available when you return"),
    });
  };

  // Load saved design
  const handleLoadDesign = () => {
    loadDesign();
    toast({
      title: t('design.loaded', "Design loaded"),
      description: t('design.loadedDescription', "Your saved design has been loaded"),
    });
  };

  // Add to cart with validation
  const handleAddToCart = () => {
    if (!product) return;
    
    // Enforce boundaries before validation
    enforceTextBoundaries();
    
    // Distribute text if there are overlaps
    if (detectTextCollisions()) {
      distributeTextLines();
      toast({
        title: t('textEditor.positioningFixed', 'Text Positioning Fixed'),
        description: t('textEditor.automaticAdjustment', 'Your text has been automatically adjusted to ensure proper spacing'),
      });
    }
    
    const errors = validateDesign('preview');
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      const customText = design.lines.map(line => line.text).filter(Boolean).join(' | ');
      addToCart(product, 1, customText, design.inkColor, previewImage || undefined);
      
      toast({
        title: t('cart.added', "Added to cart"),
        description: t('cart.addedDescription', "Your custom stamp has been added to your cart"),
      });
      
      if (onAddToCart) onAddToCart();
    }
  };
  
  // Handle animation
  const handleAnimate = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  // Toggle safe zone visibility
  const toggleSafeZone = () => {
    setSafeZoneVisible(!safeZoneVisible);
  };

  // Cleanup event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        stopDragging();
        
        // After dragging stops, enforce text boundaries
        if (activeLineIndex !== null) {
          enforceTextBoundaries();
        }
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging, stopDragging, activeLineIndex, enforceTextBoundaries]);

  // Check for saved design on initial load
  useEffect(() => {
    if (product && hasSavedDesign()) {
      toast({
        title: t('design.savedFound', "Saved design found"),
        description: t('design.savedFoundDescription', "You have a saved design. Would you like to load it?"),
        action: (
          <Button onClick={handleLoadDesign} variant="outline" size="sm">
            {t('design.loadDesign', "Load Design")}
          </Button>
        ),
      });
    }
  }, [product]);

  // After loading or when stamp type changes, ensure text boundaries
  useEffect(() => {
    if (design && design.shape) {
      enforceTextBoundaries();
    }
  }, [design?.shape]);

  if (!product) {
    return (
      <div className={`p-8 text-center bg-white rounded-lg ${highContrast ? 'border-2 border-gray-800' : ''}`}>
        <p className={`${highContrast ? 'text-black' : 'text-gray-500'}`}>
          {t('design.selectProduct', "Please select a product to start designing your stamp.")}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${highContrast ? 'border-2 border-gray-800' : ''}`}>
      <div className={`border-b ${highContrast ? 'border-gray-800 bg-gray-100' : 'border-gray-200 bg-gray-50'} p-4`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-semibold ${highContrast ? 'text-black' : ''}`}>
            {t('design.title', "Custom Stamp Designer")}
          </h2>
          
          <span className={`text-sm ${highContrast ? 'text-black' : 'text-gray-600'}`}>
            {product.name} ({product.size})
          </span>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4">
          <Progress 
            value={progress} 
            className={`h-2 ${highContrast ? 'bg-gray-300' : ''}`} 
          />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`text-xs hidden sm:block ${
                  index <= currentStepIndex 
                    ? (highContrast ? 'text-black font-bold' : 'text-brand-blue font-medium') 
                    : (highContrast ? 'text-gray-600' : 'text-gray-400')
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
          <p className="text-sm text-center mt-1 text-gray-500">
            {t('wizard.stepOf', 'Step {{current}} of {{total}}', { current: currentStepIndex + 1, total: steps.length })}:
            {' '}
            <strong>{steps[currentStepIndex].label}</strong>
          </p>
        </div>
      </div>
      
      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className={`${highContrast ? 'bg-red-100' : 'bg-red-50'} border-l-4 border-red-500 p-4 m-4`}>
          <div className="flex items-start">
            <div>
              <h3 className="text-sm font-medium text-red-800">
                {t('validation.fixIssues', "Please fix the following issues:")}
              </h3>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Save/Load controls */}
      <div className={`p-4 border-b ${highContrast ? 'border-gray-800' : 'border-gray-200'} flex justify-between items-center`}>
        <div>
          <Button
            variant="outline"
            size={largeControls ? "default" : "sm"}
            onClick={toggleSafeZone}
            className={safeZoneVisible ? "bg-blue-50" : ""}
          >
            {safeZoneVisible ? t('preview.hideSafeZone', "Hide Safe Zone") : t('preview.showSafeZone', "Show Safe Zone")}
          </Button>
        </div>
        <div className="flex space-x-2">
          {hasSavedDesign() ? (
            <Button 
              variant={highContrast ? "default" : "outline"} 
              size={largeControls ? "default" : "sm"} 
              onClick={handleLoadDesign}
              title={t('design.loadSavedDesign', "Load Saved Design")}
            >
              {t('design.loadDesign', "Load Design")}
            </Button>
          ) : (
            <Button 
              variant={highContrast ? "default" : "outline"} 
              size={largeControls ? "default" : "sm"} 
              onClick={handleSaveDesign}
              title={t('design.saveDesignForLater', "Save Design for Later")}
            >
              <Save size={largeControls ? 20 : 16} className="mr-1" />
              {t('design.saveDesign', "Save Design")}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Left panel: Design options based on current step */}
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
          {currentStep === 'structure' && (
            <BorderStyleSelector 
              borderStyle={design.borderStyle} 
              onBorderStyleChange={setBorderStyle} 
              largeControls={largeControls}
            />
          )}
          
          {currentStep === 'text' && (
            <SimplifiedTextEditor
              lines={design.lines}
              maxLines={product.lines}
              shape={design.shape}
              activeLineIndex={activeLineIndex}
              setActiveLineIndex={setActiveLineIndex}
              updateLine={updateLine}
              addLine={addLine}
              removeLine={removeLine}
              toggleCurvedText={toggleCurvedText}
              distributeTextLines={distributeTextLines}
              enforceTextBoundaries={enforceTextBoundaries}
              detectTextCollisions={detectTextCollisions}
              largeControls={largeControls}
            />
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
          
          {currentStep === 'color' && (
            <ColorSelector 
              inkColors={product.inkColors} 
              selectedColor={design.inkColor} 
              onColorSelect={setInkColor}
              largeControls={largeControls}
            />
          )}
          
          {currentStep === 'preview' && (
            <div className="space-y-4">
              <div className={`${highContrast ? 'bg-gray-100' : 'bg-gray-50'} p-4 rounded-md`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{product.name}</h3>
                  <span className={`font-bold ${highContrast ? 'text-black' : 'text-brand-red'}`}>{product.price} DHS TTC</span>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className={`w-full py-3 ${highContrast ? 'bg-red-800' : 'bg-brand-red'} text-white rounded-md hover:bg-red-700 transition-colors ${
                    largeControls ? 'text-lg py-4' : ''
                  }`}
                >
                  {t('cart.addToCart', "Add to Cart")}
                </Button>
              </div>
              
              <PreviewOnPaper
                previewImage={previewImage}
                productName={product.name}
                productSize={product.size}
                onAnimate={handleAnimate}
                highContrast={highContrast}
                largeControls={largeControls}
                isAnimatingProp={showAnimation}
              />
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">{t('preview.downloadPreview', "Download Preview")}</h3>
                <Button
                  variant="outline"
                  onClick={downloadAsPng}
                  disabled={!previewImage}
                  size={largeControls ? "lg" : "default"}
                  className="w-full"
                >
                  <CheckCircle2 className="mr-2" size={largeControls ? 20 : 16} />
                  {t('preview.download', "Download PNG")}
                </Button>
              </div>
            </div>
          )}
          
          {/* Step navigation buttons */}
          <div className="flex justify-between pt-4 border-t mt-4">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStepIndex === 0}
              className={largeControls ? "text-lg py-3 px-5" : ""}
            >
              <ChevronLeft className="mr-1" size={largeControls ? 20 : 16} />
              {t('wizard.previous', "Previous")}
            </Button>
            
            <Button
              variant="default"
              onClick={goToNextStep}
              disabled={currentStepIndex === steps.length - 1}
              className={`${largeControls ? "text-lg py-3 px-5" : ""} ${highContrast ? "bg-blue-800" : ""}`}
            >
              {t('wizard.next', "Next")}
              <ChevronRight className="ml-1" size={largeControls ? 20 : 16} />
            </Button>
          </div>
        </div>
        
        {/* Right panel: Preview */}
        <div className="space-y-6">
          <StampPreviewAccessible
            previewImage={previewImage}
            productSize={product.size}
            isDragging={isDragging}
            activeLineIndex={activeLineIndex}
            includeLogo={design.includeLogo}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            downloadAsPng={downloadAsPng}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            zoomLevel={zoomLevel}
            background={previewBackground}
            highContrast={highContrast}
            largeControls={largeControls}
            isAnimating={showAnimation}
            showSafeZone={safeZoneVisible}
            shape={design.shape}
          />
          
          {/* Preview controls */}
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={zoomOut}
              disabled={zoomLevel <= 1}
              title={t('preview.zoomOut', "Zoom Out")}
            >
              <ZoomOut size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={zoomIn}
              disabled={zoomLevel >= 3}
              title={t('preview.zoomIn', "Zoom In")}
            >
              <ZoomIn size={16} />
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            {t('preview.dragToPosition', "Click and drag text or logo to position")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampDesignerSimplified;
