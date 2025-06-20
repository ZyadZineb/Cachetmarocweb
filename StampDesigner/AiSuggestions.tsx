
import React, { useState, useEffect } from 'react';
import { Wand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { aiDesignService, AiDesignSuggestion } from '@/services/AiDesignService';
import { StampDesign } from '@/types';

interface AiSuggestionsProps {
  design: StampDesign;
  onApplySuggestion: (suggestion: any) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ design, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState<AiDesignSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  
  const generateSuggestions = async () => {
    setLoading(true);
    
    try {
      // Get suggestions based on the current design
      const hasText = design.lines.some(line => line.text.trim().length > 0);
      const textLength = design.lines.reduce((acc, line) => acc + line.text.length, 0);
      
      // Get layout suggestions
      const layoutSuggestions = await aiDesignService.getTextLayoutSuggestions(
        design.shape,
        textLength,
        design.lines.length
      );
      
      // Get font suggestions
      const fontSuggestions = await aiDesignService.getFontPairingSuggestions();
      
      // Get logo placement suggestions
      const logoSuggestions = await aiDesignService.getLogoPlacementSuggestions(
        design.shape,
        hasText
      );
      
      // Combine all suggestions
      const allSuggestions = [...layoutSuggestions, ...fontSuggestions, ...logoSuggestions];
      
      // Sort by confidence
      const sortedSuggestions = allSuggestions.sort((a, b) => b.confidence - a.confidence);
      
      setSuggestions(sortedSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Generate initial suggestions when the design changes significantly
  useEffect(() => {
    const hasText = design.lines.some(line => line.text.trim().length > 0);
    if (hasText || design.includeLogo) {
      generateSuggestions();
    }
  }, [design.shape, design.includeLogo, design.borderStyle]);
  
  const renderSuggestionItem = (suggestion: AiDesignSuggestion, index: number) => {
    const confidence = Math.round(suggestion.confidence * 100);
    const badgeColor = confidence > 90 
      ? 'bg-green-100 text-green-800' 
      : confidence > 80 
        ? 'bg-blue-100 text-blue-800' 
        : 'bg-gray-100 text-gray-800';
        
    return (
      <div key={index} className="flex flex-col gap-2 p-3 border rounded-md">
        <div className="flex items-center justify-between">
          <Badge className={badgeColor}>{suggestion.type}</Badge>
          <span className="text-xs text-gray-500">{confidence}% confident</span>
        </div>
        <p className="text-sm">{suggestion.suggestion}</p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onApplySuggestion(suggestion)}
          className="self-end"
        >
          Apply
        </Button>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">AI Design Suggestions</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={generateSuggestions}
          disabled={loading}
        >
          <Wand size={16} className="mr-1" />
          {loading ? 'Thinking...' : 'Refresh'}
        </Button>
      </div>
      
      {suggestions.length === 0 ? (
        <div className="p-4 bg-gray-50 rounded-md text-center text-sm text-gray-600">
          {loading ? 'Generating suggestions...' : 'Add text or logo to get AI suggestions'}
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="suggestions">
            <AccordionTrigger className="text-sm">
              {suggestions.length} Suggestions Available
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 mt-2">
                {suggestions.map((suggestion, index) => renderSuggestionItem(suggestion, index))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default AiSuggestions;
