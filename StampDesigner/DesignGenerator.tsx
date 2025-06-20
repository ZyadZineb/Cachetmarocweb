
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wand, ChevronRight, ChevronLeft, RefreshCcw, Check, X, Star, StarOff, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StampDesign, Product } from '@/types';
import { GeneratedDesign } from '@/types/designTemplates';
import { designGeneratorService } from '@/services/DesignGeneratorService';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { trackEvent } from '@/utils/analytics';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DesignGeneratorProps {
  design: StampDesign;
  product: Product;
  onApplyDesign: (design: StampDesign) => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

const DesignGenerator: React.FC<DesignGeneratorProps> = ({
  design,
  product,
  onApplyDesign,
  highContrast = false,
  largeControls = false
}) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<GeneratedDesign[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPanel, setShowPanel] = useState(true);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [templateInfo, setTemplateInfo] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Categories for filtering templates
  const categories = [
    { id: "all", label: "All Templates" },
    { id: "business", label: "Business" },
    { id: "official", label: "Official/Government" },
    { id: "professional", label: "Professional Services" },
    { id: "personal", label: "Personal" }
  ];

  // Generate designs on first load or when requested
  const generateDesigns = (categoryFilter?: string) => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    // Small timeout to show loading state
    setTimeout(() => {
      try {
        const suggestions = designGeneratorService.generateDesignSuggestions(
          design, 
          5, 
          categoryFilter || selectedCategory !== "all" ? selectedCategory : undefined, 
          product?.shape
        );
        setGeneratedDesigns(suggestions);
        setCurrentIndex(0);
        setLastGenerated(new Date());
        
        // Track the event
        trackEvent('stamp_design', 'generate_designs', product?.id);
      } catch (error) {
        console.error('Error generating designs:', error);
      } finally {
        setIsGenerating(false);
      }
    }, 800); // Slightly longer to feel more like "AI thinking"
  };

  // Generate variations of a specific design
  const generateVariations = () => {
    if (isGenerating || generatedDesigns.length === 0) return;
    
    setIsGenerating(true);
    
    const currentDesign = generatedDesigns[currentIndex];
    setTemplateInfo(t('designGenerator.generatingVariations', "Generating variations based on {{template}}", { template: currentDesign.templateName }));
    
    // Small timeout to show loading state
    setTimeout(() => {
      try {
        const variations = designGeneratorService.generateDesignVariations(
          currentDesign.design, 
          currentDesign.templateId,
          3
        );
        
        setGeneratedDesigns([currentDesign, ...variations]);
        setCurrentIndex(0);
        
        // Track the event
        trackEvent('stamp_design', 'generate_variations', currentDesign.templateId);
      } catch (error) {
        console.error('Error generating variations:', error);
      } finally {
        setIsGenerating(false);
        setTemplateInfo("");
      }
    }, 800);
  };

  // Apply the current design
  const applyCurrentDesign = () => {
    if (generatedDesigns.length === 0) return;
    
    const current = generatedDesigns[currentIndex];
    onApplyDesign(current.design);
    
    // Track the event
    trackEvent('stamp_design', 'apply_design', current.templateId);
  };

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Navigate through designs
  const goToNextDesign = () => {
    if (currentIndex < generatedDesigns.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to beginning
    }
  };

  const goToPrevDesign = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(generatedDesigns.length - 1); // Loop to end
    }
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Only regenerate if we already have designs
    if (generatedDesigns.length > 0) {
      generateDesigns(value);
    }
  };

  // Generate designs on first load
  useEffect(() => {
    if (generatedDesigns.length === 0 && design && !isGenerating) {
      generateDesigns();
    }
  }, [design]);

  // Current design being displayed
  const currentDesign = generatedDesigns[currentIndex];
  const isFavorite = currentDesign ? favorites.includes(currentDesign.id) : false;

  // Content readiness checkers
  const hasContent = design.lines.some(line => line.text.trim().length > 0);
  const canGenerateMore = lastGenerated ? (new Date().getTime() - lastGenerated.getTime() > 5000) : true;

  return (
    <div className={`rounded-lg overflow-hidden ${highContrast ? 'border border-gray-700' : 'border border-gray-200'}`}>
      <div className={`${highContrast ? 'bg-gray-800 text-white' : 'bg-gradient-to-r from-purple-50 to-indigo-100'} p-3 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <Wand size={largeControls ? 22 : 18} className={highContrast ? 'text-white' : 'text-purple-600'} />
          <h3 className={`font-medium ${largeControls ? 'text-lg' : 'text-base'}`}>
            {t('designGenerator.title', 'Design Generator')}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size={largeControls ? "default" : "sm"}
            variant="ghost"
            onClick={() => setShowPanel(!showPanel)}
          >
            {showPanel ? <X size={largeControls ? 20 : 16} /> : <ChevronRight size={largeControls ? 20 : 16} />}
          </Button>
        </div>
      </div>

      {showPanel && (
        <div className={`${highContrast ? 'bg-gray-100' : 'bg-white'} p-4`}>
          {!hasContent ? (
            <div className="text-center py-6">
              <p>{t('designGenerator.noContent', 'Add some text to your stamp to generate design suggestions.')}</p>
              <Button
                className="mt-4"
                variant="outline"
                size={largeControls ? "default" : "sm"}
                onClick={() => generateDesigns()}
                disabled={!hasContent}
              >
                {t('designGenerator.generateButton', 'Generate Designs')}
              </Button>
            </div>
          ) : (
            <>
              {/* Template category filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  {t('designGenerator.filterByCategory', 'Filter by Style')}
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className={`w-full ${largeControls ? 'text-base h-11' : ''}`}>
                    <SelectValue placeholder={t('designGenerator.selectCategory', 'Select style category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {t(`designGenerator.categories.${category.id}`, category.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {generatedDesigns.length === 0 || isGenerating ? (
                <div className="text-center py-8">
                  <div className="animate-pulse mb-4">
                    <Wand size={32} className={`mx-auto ${highContrast ? 'text-gray-700' : 'text-purple-500'}`} />
                  </div>
                  <p>
                    {templateInfo || t('designGenerator.generating', 'Analyzing your content and generating professional design suggestions...')}
                  </p>
                  <div className="mt-6 space-y-3">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Design display area */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">
                        {currentDesign.templateName}
                      </h4>
                      <Badge variant={isFavorite ? "default" : "outline"} className={isFavorite ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}>
                        {t('designGenerator.qualityScore', 'Quality')}: {Math.round(currentDesign.score * 100)}%
                      </Badge>
                    </div>
                    
                    <div className={`border ${highContrast ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-3 mb-3 min-h-[200px] flex items-center justify-center`}>
                      <div className="text-center">
                        <p className={`${largeControls ? 'text-lg' : 'text-base'} font-medium mb-2`}>
                          {t('designGenerator.previewAvailable', 'Design preview available')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t('designGenerator.clickApply', 'Click "Apply Design" to see this design on your stamp')}
                        </p>
                        <div className="mt-4 flex justify-center">
                          <Button
                            variant="default"
                            size={largeControls ? "default" : "sm"}
                            onClick={applyCurrentDesign}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Check size={largeControls ? 20 : 16} className="mr-1" />
                            {t('designGenerator.applyDesign', 'Apply Design')}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Template information */}
                    <div className="mb-4 text-sm">
                      <p className="text-gray-600">
                        {currentDesign.design.borderStyle && (
                          <span className="inline-block mr-3">
                            <strong>{t('designGenerator.borderStyle', 'Border')}:</strong> {currentDesign.design.borderStyle}
                          </span>
                        )}
                        <span className="inline-block">
                          <strong>{t('designGenerator.textLines', 'Text Lines')}:</strong> {currentDesign.design.lines.length}
                        </span>
                      </p>
                    </div>
                    
                    {/* Navigation controls */}
                    <div className="flex justify-between items-center mb-4">
                      <Button
                        variant="outline"
                        size={largeControls ? "default" : "sm"}
                        onClick={goToPrevDesign}
                      >
                        <ChevronLeft size={largeControls ? 20 : 16} className="mr-1" />
                        {t('designGenerator.previous', 'Previous')}
                      </Button>
                      
                      <span className="text-sm text-gray-500">
                        {currentIndex + 1} / {generatedDesigns.length}
                      </span>
                      
                      <Button
                        variant="outline"
                        size={largeControls ? "default" : "sm"}
                        onClick={goToNextDesign}
                      >
                        {t('designGenerator.next', 'Next')}
                        <ChevronRight size={largeControls ? 20 : 16} className="ml-1" />
                      </Button>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={highContrast ? "default" : "outline"}
                        size={largeControls ? "default" : "sm"}
                        className="w-full"
                        onClick={() => toggleFavorite(currentDesign.id)}
                      >
                        {isFavorite ? (
                          <>
                            <StarOff size={largeControls ? 20 : 16} className="mr-1" />
                            {t('designGenerator.unfavorite', 'Unfavorite')}
                          </>
                        ) : (
                          <>
                            <Star size={largeControls ? 20 : 16} className="mr-1" />
                            {t('designGenerator.favorite', 'Favorite')}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="default"
                        size={largeControls ? "default" : "sm"}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={applyCurrentDesign}
                      >
                        <Check size={largeControls ? 20 : 16} className="mr-1" />
                        {t('designGenerator.applyDesign', 'Apply Design')}
                      </Button>
                    </div>
                    
                    {/* Generator controls */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <HelpTooltip content={t('designGenerator.newDesignsTooltip', 'Generate completely new design suggestions')}>
                        <Button
                          variant="outline"
                          size={largeControls ? "default" : "sm"}
                          className="w-full"
                          onClick={() => generateDesigns()}
                          disabled={isGenerating || !canGenerateMore}
                        >
                          <Wand size={largeControls ? 20 : 16} className="mr-1" />
                          {t('designGenerator.newDesigns', 'New Designs')}
                        </Button>
                      </HelpTooltip>
                      
                      <HelpTooltip content={t('designGenerator.variationsTooltip', 'Create variations of this specific design')}>
                        <Button
                          variant="outline"
                          size={largeControls ? "default" : "sm"}
                          className="w-full"
                          onClick={generateVariations}
                          disabled={isGenerating || generatedDesigns.length === 0}
                        >
                          <RefreshCcw size={largeControls ? 20 : 16} className="mr-1" />
                          {t('designGenerator.variations', 'Variations')}
                        </Button>
                      </HelpTooltip>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignGenerator;
