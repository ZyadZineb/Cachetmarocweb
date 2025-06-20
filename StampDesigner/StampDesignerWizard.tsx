import React, { useState, useEffect, useRef } from 'react';
import { Check, AlertCircle, ChevronLeft, ChevronRight, Undo, Redo, Save, ZoomIn, ZoomOut, Wand } from 'lucide-react';
import useStampDesignerEnhanced from '@/hooks/useStampDesignerEnhanced';
import { Product, StampDesign } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from 'react-i18next';
import WizardControls from './WizardControls';
import EnhancedTextEditor from './EnhancedTextEditor';
import StampPreviewAccessible from './StampPreviewAccessible';
import ColorSelector from './ColorSelector';
import LogoUploader from './LogoUploader';
import BorderStyleSelector from './BorderStyleSelector';
import DesignTemplates from './DesignTemplates';
import EnhancedAiHelper from './EnhancedAiHelper';
import AdvancedTools from './AdvancedTools';
import ExportDesign from './ExportDesign';
import TextEffects from './TextEffects';
import PreviewBackgrounds from './PreviewBackgrounds';
import PreviewOnPaper from './PreviewOnPaper';
import AutoArrange from './AutoArrange';
import { useIsMobile } from '@/hooks/use-mobile';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import DesignGenerator from './DesignGenerator';
import TextLinesEditor from './TextLinesEditor';
import { TextPositioningService } from '@/utils/TextPositioningService';

// Define the wizard step type
type WizardStepType = 'shape' | 'text' | 'effects' | 'color' | 'logo' | 'advanced' | 'preview';

interface StampDesignerWizardProps {
  product: Product | null;
  onAddToCart?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

const StampDesignerWizard: React.FC<StampDesignerWizardProps> = ({
  product,
  onAddToCart,
  highContrast = false,
  largeControls = false
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  // Use the enhanced stamp designer hook
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
    generatePreview,
    validateDesign,
    undo,
    redo,
    canUndo,
    canRedo,
    saveDesign,
    loadDesign,
    hasSavedDesign,
    clearSavedDesign,
    applyTemplate,
    zoomIn,
    zoomOut,
    zoomLevel,
    svgRef,
    addElement,
    applyTextEffect,
    downloadAsPng,
    updateMultipleLines
  } = useStampDesignerEnhanced(product);
  
  // Add a function to distribute text lines evenly
  const distributeTextLinesLocal = () => {
    if (!design || !design.shape || !design.lines) return;
    
    const { shape, lines } = design;
    // Use the TextPositioningService to distribute lines evenly
    const adjustedLines = TextPositioningService.distributeLines(lines, shape);
    
    updateMultipleLines(adjustedLines);
    
    toast({
      title: t('design.autoArranged', "Layout Auto-Arranged"),
      description: t('design.autoArrangedDesc', "Text has been automatically arranged for optimal layout"),
    });
  };

  const { addToCart } = useCart();
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<WizardStepType>('shape');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewBackground, setPreviewBackground] = useState<string>('none');
  const [showAnimation, setShowAnimation] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [showSafeZone, setShowSafeZone] = useState(true);
  
  // Steps configuration
  const steps = [
    { id: 'shape' as WizardStepType, labelKey: 'wizard.steps.shape.label', label: 'Shape & Border', descriptionKey: 'wizard.steps.shape.description', description: 'Choose your stamp shape and border style' },
    { id: 'text' as WizardStepType, labelKey: 'wizard.steps.text.label', label: 'Text', descriptionKey: 'wizard.steps.text.description', description: 'Add and position your text' },
    { id: 'effects' as WizardStepType, labelKey: 'wizard.steps.effects.label', label: 'Effects', descriptionKey: 'wizard.steps.effects.description', description: 'Add text effects and styling' },
    { id: 'color' as WizardStepType, labelKey: 'wizard.steps.color.label', label: 'Color', descriptionKey: 'wizard.steps.color.description', description: 'Select ink color' },
    { id: 'logo' as WizardStepType, labelKey: 'wizard.steps.logo.label', label: 'Logo', descriptionKey: 'wizard.steps.logo.description', description: 'Add a logo if needed' },
    { id: 'advanced' as WizardStepType, labelKey: 'wizard.steps.advanced.label', label: 'Advanced', descriptionKey: 'wizard.steps.advanced.description', description: 'Add QR codes and barcodes' },
    { id: 'preview' as WizardStepType, labelKey: 'wizard.steps.preview.label', label: 'Preview', descriptionKey: 'wizard.steps.preview.description', description: 'Review and finalize your design' }
  ];
  
  // Get current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  
  // Reset view function for the preview
  const resetView = () => {
    setPanPosition({ x: 0, y: 0 });
    // If we have access to zoomLevel setter, we would reset that here too
  };
  
  // Navigation functions
  const goToNextStep = () => {
    const errors = validateDesign(currentStep);
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id);
      }
    }
  };
  
  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };
  
  const jumpToStep = (step: WizardStepType) => {
    setCurrentStep(step);
  };

  // Handle logo upload
  const handleLogoUpload = () => {
    // For demo, we're using a sample logo
    const logoUrl = '/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png';
    setUploadedLogo(logoUrl);
  };

  // Watch for logo changes to update the design
  useEffect(() => {
    if (uploadedLogo) {
      design.logoImage = uploadedLogo;
    }
  }, [uploadedLogo]);

  // Handle text effects
  const handleApplyTextEffect = (effect: {
    type: 'shadow' | 'outline' | 'bold' | 'italic' | 'none';
    color?: string;
    blur?: number;
    thickness?: number;
  }) => {
    if (activeLineIndex !== null) {
      applyTextEffect(activeLineIndex, effect);
    }
  };

  // Click handler for interactive preview text positioning
  const handlePreviewClick = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    let clientX: number, clientY: number;
    
    if ('nativeEvent' in event && 'clientX' in event.nativeEvent) {
      // Mouse event
      clientX = event.nativeEvent.clientX;
      clientY = event.nativeEvent.clientY;
    } else if ('touches' in event && event.touches.length > 0) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      return; // Exit if we can't get coordinates
    }
    
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    
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
  };

  // Save current design
  const handleSaveDesign = () => {
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
    
    const errors = validateDesign('preview');
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      // Add the product to cart with the custom text and preview
      const customText = design.lines.map(line => line.text).filter(Boolean).join(' | ');
      addToCart(product, 1, customText, design.inkColor, previewImage || undefined);
      
      toast({
        title: t('cart.added', "Added to cart"),
        description: t('cart.addedDescription', "Your custom stamp has been added to your cart"),
      });
      
      // Call the optional callback
      if (onAddToCart) onAddToCart();
    }
  };
  
  // Handle applying AI suggestions
  const handleAiSuggestion = (suggestion: any) => {
    // This is a stub implementation - in a real app, you would parse the suggestion
    // and apply appropriate changes to the design
    toast({
      title: t('ai.suggestionApplied', "Suggestion applied"),
      description: suggestion.suggestion,
    });
  };
  
  // Handle adding elements like QR codes or barcodes
  const handleAddElement = (element: { type: string, dataUrl: string, width: number, height: number }) => {
    addElement(element);
    toast({
      title: t('design.elementAdded', `${element.type === 'qrcode' ? 'QR Code' : 'Barcode'} added`),
      description: t('design.elementAddedDescription', "Element added to your design. Adjust position in the preview."),
    });
  };

  // Handle setting preview background
  const handleSetBackground = (background: string) => {
    setPreviewBackground(background);
    
    toast({
      title: t('preview.backgroundChanged', "Background Changed"),
      description: t('preview.backgroundChangedDesc', "Preview background has been updated"),
    });
  };
  
  // Handle animation
  const handleAnimate = () => {
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };
  
  // Handle auto-arrange
  const handleAutoArrange = (updatedLines: any[]) => {
    updateMultipleLines(updatedLines);
    
    toast({
      title: t('design.autoArranged', "Layout Auto-Arranged"),
      description: t('design.autoArrangedDesc', "Text has been automatically arranged for optimal layout"),
    });
  };

  // Cleanup event listeners
  useEffect(() => {
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

  // Add a new handler for applying designs from the generator
  const handleApplyGeneratedDesign = (generatedDesign: StampDesign) => {
    // Apply the design to the current stamp
    // This will merge the generated design properties with the current design
    
    // Update design lines
    const newLines = [...generatedDesign.lines];
    
    // Update multiple design properties at once
    design.lines = newLines;
    design.borderStyle = generatedDesign.borderStyle;
    
    // Only update logo properties if both designs include logos
    if (design.includeLogo && generatedDesign.includeLogo) {
      design.logoPosition = generatedDesign.logoPosition;
      design.logoX = generatedDesign.logoX;
      design.logoY = generatedDesign.logoY;
    }
    
    toast({
      title: t('designGenerator.designApplied', "Design Applied"),
      description: t('designGenerator.designAppliedDesc', "The selected design template has been applied to your stamp"),
    });
  };

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
          
          <HelpTooltip content={t('design.productInfo', `Designing a ${product.name} stamp (${product.size}). You can add up to ${product.lines} lines of text and choose from ${product.inkColors.length} ink colors.`)}>
            <span className={`text-sm ${highContrast ? 'text-black' : 'text-gray-600'}`}>
              {product.name} ({product.size})
            </span>
          </HelpTooltip>
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
                className={`text-xs ${isMobile ? 'hidden sm:block' : ''} ${
                  index <= currentStepIndex 
                    ? (highContrast ? 'text-black font-bold' : 'text-brand-blue font-medium') 
                    : (highContrast ? 'text-gray-600' : 'text-gray-400')
                }`}
              >
                {step.labelKey ? t(step.labelKey) : step.label}
              </div>
            ))}
          </div>
          <p className="text-sm text-center mt-1 text-gray-500">
            {t('wizard.stepOf', 'Step {{current}} of {{total}}', { current: currentStepIndex + 1, total: steps.length })}:
            {' '}
            <strong>{t(steps[currentStepIndex].labelKey || '', steps[currentStepIndex].label)}</strong>
          </p>
        </div>
      </div>
      
      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className={`${highContrast ? 'bg-red-100' : 'bg-red-50'} border-l-4 border-red-500 p-4 m-4`}>
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
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
      
      {/* Undo/Redo controls */}
      <div className={`p-4 border-b ${highContrast ? 'border-gray-800' : 'border-gray-200'} flex justify-between items-center`}>
        <div className="flex space-x-2">
          <Button 
            variant={highContrast ? "default" : "outline"} 
            size={largeControls ? "default" : "sm"} 
            onClick={undo} 
            disabled={!canUndo}
            title={t('actions.undo', "Undo")}
            className={largeControls ? "h-10 w-10 p-0" : ""}
          >
            <Undo size={largeControls ? 20 : 16} />
          </Button>
          <Button 
            variant={highContrast ? "default" : "outline"} 
            size={largeControls ? "default" : "sm"} 
            onClick={redo} 
            disabled={!canRedo}
            title={t('actions.redo', "Redo")}
            className={largeControls ? "h-10 w-10 p-0" : ""}
          >
            <Redo size={largeControls ? 20 : 16} />
          </Button>
        </div>
        
        <div className="flex space-x-2">
          {hasSavedDesign() ? (
            <>
              <Button 
                variant={highContrast ? "default" : "outline"} 
                size={largeControls ? "default" : "sm"} 
                onClick={handleLoadDesign}
                title={t('design.loadSavedDesign', "Load Saved Design")}
              >
                {t('design.loadDesign', "Load Design")}
              </Button>
              <Button 
                variant={highContrast ? "default" : "outline"} 
                size={largeControls ? "default" : "sm"} 
                onClick={clearSavedDesign}
                title={t('design.clearSavedDesign', "Clear Saved Design")}
              >
                {t('design.clearSaved', "Clear Saved")}
              </Button>
            </>
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
      
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${isMobile ? 'flex flex-col-reverse' : ''}`}>
        {/* Left panel: Design options based on current step */}
        <div className={`space-y-6 overflow-y-auto max-h-[70vh] ${largeControls ? 'text-lg' : ''}`}>
          {/* Auto-arrange button - Show on text and effects steps */}
          {(currentStep === 'text' || currentStep === 'effects') && (
            <AutoArrange 
              design={design} 
              onArrange={handleAutoArrange}
              shape={design.shape}
            />
          )}
          
          {currentStep === 'shape' && (
            <>
              <BorderStyleSelector 
                borderStyle={design.borderStyle} 
                onBorderStyleChange={setBorderStyle} 
              />
              <DesignTemplates 
                onSelectTemplate={applyTemplate} 
                productShape={design.shape} 
              />
              {/* Add Design Generator here */}
              <DesignGenerator 
                design={design}
                product={product}
                onApplyDesign={handleApplyGeneratedDesign}
                highContrast={highContrast}
                largeControls={largeControls}
              />
              <EnhancedAiHelper 
                design={design}
                product={product}
                onApplySuggestion={handleAiSuggestion}
                highContrast={highContrast}
                largeControls={largeControls}
              />
            </>
          )}
          
          {currentStep === 'text' && (
            <>
              {/* Replace EnhancedTextEditor with our updated TextLinesEditor */}
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
                distributeTextLines={distributeTextLinesLocal}
              />
              {/* Add Design Generator to text step as well */}
              <DesignGenerator 
                design={design}
                product={product}
                onApplyDesign={handleApplyGeneratedDesign}
                highContrast={highContrast}
                largeControls={largeControls}
              />
              <EnhancedAiHelper 
                design={design}
                product={product}
                onApplySuggestion={handleAiSuggestion}
                highContrast={highContrast}
                largeControls={largeControls}
              />
            </>
          )}
          
          {currentStep === 'effects' && (
            <>
              <TextEffects 
                onApplyEffect={handleApplyTextEffect}
                currentEffect={{
                  type: 'none'
                }}
                largeControls={largeControls}
              />
              <EnhancedAiHelper 
                design={design}
                product={product}
                onApplySuggestion={handleAiSuggestion}
                highContrast={highContrast}
                largeControls={largeControls}
              />
            </>
          )}
          
          {currentStep === 'color' && (
            <>
              <ColorSelector 
                inkColors={product.inkColors} 
                selectedColor={design.inkColor} 
                onColorSelect={setInkColor}
              />
              <EnhancedAiHelper 
                design={design}
                product={product}
                onApplySuggestion={handleAiSuggestion}
                highContrast={highContrast}
                largeControls={largeControls}
              />
            </>
          )}
          
          {currentStep === 'logo' && (
            <>
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
              <EnhancedAiHelper 
                design={design}
                product={product}
                onApplySuggestion={handleAiSuggestion}
                highContrast={highContrast}
                largeControls={largeControls}
              />
            </>
          )}
          
          {currentStep === 'advanced' && (
            <AdvancedTools
              svgRef={svgRef.current}
              previewImage={previewImage}
              productName={product.name}
              downloadAsPng={downloadAsPng}
              onAddElement={handleAddElement}
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
              
              <ExportDesign
                svgRef={svgRef.current}
                previewImage={previewImage}
                productName={product.name}
                downloadAsPng={downloadAsPng}
                largeControls={largeControls}
              />
              
              <PreviewBackgrounds
                onSelectBackground={handleSetBackground}
                selectedBackground={previewBackground}
              />
            </div>
          )}
        </div>
        
        {/* Right panel: Preview and navigation controls */}
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
            showSafeZone={showSafeZone}
            shape={design.shape}
            resetView={resetView}
          />
          
          <WizardControls 
            currentStep={currentStep} 
            steps={steps as any}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            onJump={jumpToStep}
            largeControls={largeControls}
          />
        </div>
      </div>
    </div>
  );
};

export default StampDesignerWizard;
