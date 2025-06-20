import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wand, ChevronDown, ChevronUp, Check, Info, Star, X, Plus, ArrowDown, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { enhancedAiDesignService, AiDesignSuggestion, ContentAnalysisResult } from '@/services/EnhancedAiDesignService';
import { StampDesign, Product } from '@/types';
import { trackEvent } from '@/utils/analytics';

interface EnhancedAiHelperProps {
  design: StampDesign;
  product: Product | null;
  onApplySuggestion: (design: Partial<StampDesign>) => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

const EnhancedAiHelper: React.FC<EnhancedAiHelperProps> = ({
  design,
  product,
  onApplySuggestion,
  highContrast = false,
  largeControls = false
}) => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<AiDesignSuggestion[]>([]);
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [activeSuggestionType, setActiveSuggestionType] = useState('all');
  const [suggestionsApplied, setSuggestionsApplied] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'ai', message: string}[]>([]);
  
  // Generate suggestions when the design changes significantly
  useEffect(() => {
    const analyzeAndGenerateSuggestions = async () => {
      if (!product) return;
      
      setLoading(true);
      
      try {
        // First analyze the content
        const analysis = await enhancedAiDesignService.analyzeContent(
          design,
          product.shape || 'rectangle',
          product.size
        );
        
        setContentAnalysis(analysis);
        
        // Then generate suggestions based on the analysis
        const newSuggestions = await enhancedAiDesignService.generateSuggestions(
          design,
          analysis,
          product.shape || 'rectangle',
          handleApplySuggestion
        );
        
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error generating AI suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the analysis to avoid too many updates
    const timerId = setTimeout(() => {
      analyzeAndGenerateSuggestions();
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [design, product]);
  
  // Handle applying a suggestion
  const handleApplySuggestion = (suggestionUpdate: Partial<StampDesign>) => {
    onApplySuggestion(suggestionUpdate);
    
    // Track that a suggestion was applied
    setSuggestionsApplied(prev => prev + 1);
    
    // Track the event
    trackEvent('stamp_design', 'apply_ai_suggestion', 'ai_helper');
  };
  
  // Handle suggestion selection change
  const handleSuggestionTypeChange = (type: string) => {
    setActiveSuggestionType(type);
  };
  
  // Filter suggestions by type
  const filteredSuggestions = activeSuggestionType === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.type === activeSuggestionType);
  
  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // Add user message to chat
    setChatHistory(prev => [...prev, {type: 'user', message: chatMessage}]);
    
    // Generate AI response based on the message and design context
    generateAiResponse(chatMessage);
    
    // Clear input
    setChatMessage('');
  };
  
  // Generate AI response
  const generateAiResponse = (message: string) => {
    // In a real implementation, this would call an AI service
    // For demo purposes, we'll generate simple responses
    
    const lowerMessage = message.toLowerCase();
    let response = "I'm analyzing your design and can help with that.";
    
    if (contentAnalysis) {
      if (lowerMessage.includes('layout') || lowerMessage.includes('arrange')) {
        response = `I recommend a balanced layout for your ${product?.shape || 'rectangular'} stamp. ` + 
          `Based on your content, which appears to be ${contentAnalysis.contentType} in nature, ` +
          `try centering your most important information and using consistent alignment.`;
      } else if (lowerMessage.includes('color') || lowerMessage.includes('ink')) {
        response = `For ${contentAnalysis.contentType} stamps, ${contentAnalysis.industry ? 'in the ' + contentAnalysis.industry + ' industry, ' : ''}` +
          `blue or black ink typically looks most professional. Red can be used for emphasis but may appear less formal.`;
      } else if (lowerMessage.includes('font') || lowerMessage.includes('text')) {
        response = `I suggest using no more than 2 fonts in your design. For ${contentAnalysis.contentType} content, ` +
          `sans-serif fonts like Arial work well for readability at small sizes.`;
      }
    }
    
    // Add AI response to chat with slight delay to feel more natural
    setTimeout(() => {
      setChatHistory(prev => [...prev, {type: 'ai', message: response}]);
    }, 600);
  };
  
  // Render suggestion categories
  const renderSuggestionCategories = () => {
    // Count suggestions by type
    const counts = {
      all: suggestions.length,
      layout: suggestions.filter(s => s.type === 'layout').length,
      style: suggestions.filter(s => s.type === 'style').length,
      content: suggestions.filter(s => s.type === 'content').length,
      font: suggestions.filter(s => s.type === 'font').length,
      color: suggestions.filter(s => s.type === 'color').length
    };
    
    return (
      <TabsList className="w-full mb-3">
        <TabsTrigger 
          value="all" 
          className={`flex-1 ${largeControls ? 'text-base py-2' : ''}`}
          onClick={() => handleSuggestionTypeChange('all')}
        >
          All ({counts.all})
        </TabsTrigger>
        {counts.layout > 0 && (
          <TabsTrigger 
            value="layout" 
            className={largeControls ? 'text-base py-2' : ''}
            onClick={() => handleSuggestionTypeChange('layout')}
          >
            Layout ({counts.layout})
          </TabsTrigger>
        )}
        {counts.style > 0 && (
          <TabsTrigger 
            value="style" 
            className={largeControls ? 'text-base py-2' : ''}
            onClick={() => handleSuggestionTypeChange('style')}
          >
            Style ({counts.style})
          </TabsTrigger>
        )}
        {counts.content > 0 && (
          <TabsTrigger 
            value="content" 
            className={largeControls ? 'text-base py-2' : ''}
            onClick={() => handleSuggestionTypeChange('content')}
          >
            Content ({counts.content})
          </TabsTrigger>
        )}
      </TabsList>
    );
  };
  
  // Render individual suggestion item
  const renderSuggestionItem = (suggestion: AiDesignSuggestion) => {
    const categoryColors = {
      critical: 'bg-red-100 text-red-800',
      recommended: 'bg-blue-100 text-blue-800',
      optional: 'bg-gray-100 text-gray-800'
    };
    
    const typeIcons = {
      layout: <ArrowDown size={16} />,
      content: <MessageSquare size={16} />,
      style: <Star size={16} />,
      color: <Settings size={16} />,
      font: <Info size={16} />
    };
    
    const typeIcon = typeIcons[suggestion.type as keyof typeof typeIcons] || <Info size={16} />;
    
    return (
      <div 
        key={suggestion.id} 
        className={`flex flex-col gap-2 p-3 mb-2.5 border rounded-md relative transition-all hover:shadow-sm ${
          highContrast ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Badge className={categoryColors[suggestion.category]}>
              {suggestion.category}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-0.5">
              {typeIcon} {suggestion.type}
            </Badge>
            {suggestion.industry && (
              <Badge variant="secondary" className="text-xs">
                {suggestion.industry}
              </Badge>
            )}
          </div>
          
          <span className="text-xs text-gray-500">
            {Math.round(suggestion.confidence * 100)}%
          </span>
        </div>
        
        <div>
          <h4 className={`font-medium text-sm mb-1 ${largeControls ? 'text-base' : ''}`}>
            {suggestion.title}
          </h4>
          <p className={`text-sm text-gray-600 ${largeControls ? 'text-base' : ''} ${highContrast ? 'text-black' : ''}`}>
            {suggestion.description}
          </p>
        </div>
        
        {suggestion.action && (
          <Button 
            variant="default" 
            size={largeControls ? "default" : "sm"}
            onClick={() => {
              suggestion.action?.apply();
              enhancedAiDesignService.markSuggestionApplied(suggestion.id);
              // Re-analyze after applying
              setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
            }}
            className={`self-end mt-1 ${highContrast ? 'bg-gray-800 hover:bg-gray-700' : ''}`}
          >
            <Check size={largeControls ? 18 : 14} className="mr-1" />
            Apply This Suggestion
          </Button>
        )}
      </div>
    );
  };
  
  // Render chat interface
  const renderChatInterface = () => {
    return (
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Design Assistant</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowChat(false)}
            className="h-8 w-8 p-0"
          >
            <X size={16} />
          </Button>
        </div>
        
        <div className="h-48 overflow-y-auto mb-3 p-2 bg-white rounded border">
          {chatHistory.length === 0 ? (
            <div className="text-gray-400 text-center text-sm h-full flex items-center justify-center">
              <p>Ask me anything about your stamp design!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatHistory.map((entry, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded text-sm ${
                    entry.type === 'user' 
                      ? 'bg-blue-100 ml-5 text-blue-800' 
                      : 'bg-gray-100 mr-5 text-gray-800'
                  }`}
                >
                  {entry.message}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask about your design..."
            className="flex-1 px-3 py-1.5 border rounded-md text-sm"
          />
          <Button type="submit" size="sm">Send</Button>
        </form>
      </div>
    );
  };
  
  // Main component render
  return (
    <div className={`space-y-4 ${highContrast ? 'text-black' : 'text-gray-800'}`}>
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Wand size={largeControls ? 24 : 20} className="mr-2 text-brand-blue" />
          <h3 className={`font-medium ${largeControls ? 'text-lg' : ''}`}>
            {t('aiHelper.title', 'AI Design Assistant')}
            {suggestionsApplied > 0 && (
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-300">
                {suggestionsApplied} applied
              </Badge>
            )}
          </h3>
        </div>
        <div className="flex">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowChat(!showChat);
            }}
            className="mr-1"
          >
            <MessageSquare size={largeControls ? 18 : 16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1"
          >
            {expanded ? <ChevronUp size={largeControls ? 18 : 16} /> : <ChevronDown size={largeControls ? 18 : 16} />}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <>
          {showChat ? (
            renderChatInterface()
          ) : (
            <div className="bg-gray-50 rounded-lg p-3">
              {contentAnalysis && (
                <div className="mb-3 p-2 bg-white rounded-md border text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Design Analysis</span>
                    <Badge variant="outline" className="text-xs">
                      {contentAnalysis.contentType} content
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {contentAnalysis.industry && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Industry:</span>
                        <span>{contentAnalysis.industry}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Text density:</span>
                      <span className={
                        contentAnalysis.textDensity === 'overcrowded' ? 'text-red-600' : 
                        contentAnalysis.textDensity === 'high' ? 'text-orange-600' : 'text-green-600'
                      }>
                        {contentAnalysis.textDensity}
                      </span>
                    </div>
                    {contentAnalysis.language && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Language:</span>
                        <span>{contentAnalysis.language.toUpperCase()}</span>
                      </div>
                    )}
                    {contentAnalysis.problems.overcrowded && (
                      <div className="text-red-600 col-span-2">
                        ⚠️ Content is overcrowded
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <Tabs defaultValue="all">
                {renderSuggestionCategories()}
                
                <TabsContent value={activeSuggestionType} className="mt-0">
                  {loading ? (
                    <div className="py-8 text-center text-gray-400">
                      <div className="animate-pulse mb-2">Analyzing your design...</div>
                      <div className="w-8 h-8 border-2 border-t-brand-blue rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : filteredSuggestions.length === 0 ? (
                    <div className="py-6 text-center text-gray-500">
                      <div className="mb-2">
                        {contentAnalysis ? 'Your design looks good! No suggestions currently.' : 'Add text or logo to get AI suggestions'}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setLoading(true);
                          setTimeout(() => {
                            setLoading(false);
                          }, 1000);
                        }}
                      >
                        <Plus size={16} className="mr-1" />
                        Refresh Suggestions
                      </Button>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto pr-1">
                      {filteredSuggestions.map(renderSuggestionItem)}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <HelpTooltip content={t('aiHelper.tooltips.analytics', 'Analyzes your design in real-time')}>
              <Button variant="outline" size="sm" className="text-xs w-full">
                {t('aiHelper.buttons.analytics', 'Design Analytics')}
              </Button>
            </HelpTooltip>
            <HelpTooltip content={t('aiHelper.tooltips.improvementsHistory', 'See your previous design improvements')}>
              <Button variant="outline" size="sm" className="text-xs w-full">
                {t('aiHelper.buttons.improvementsHistory', 'Improvements History')}
              </Button>
            </HelpTooltip>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedAiHelper;
