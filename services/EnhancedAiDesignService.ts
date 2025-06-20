import * as tf from '@tensorflow/tfjs';
import { StampDesign, StampTextLine, TextEffect } from '@/types';

export interface AiSuggestionAction {
  apply: () => void;
  preview?: string;
}

export interface AiDesignSuggestion {
  id: string;
  type: 'layout' | 'content' | 'style' | 'color' | 'font' | 'spacing';
  category: 'critical' | 'recommended' | 'optional';
  title: string;
  description: string;
  confidence: number;
  before?: string;
  after?: string;
  action?: AiSuggestionAction;
  industry?: string;
  applies_to?: string[];
}

export interface ContentAnalysisResult {
  contentType: 'business' | 'legal' | 'personal' | 'creative' | 'date' | 'unknown';
  industry?: string;
  hasAddress: boolean;
  hasDate: boolean;
  hasContact: boolean;
  textDensity: 'low' | 'medium' | 'high' | 'overcrowded';
  language?: string;
  problems: {
    overcrowded: boolean;
    poorContrast: boolean;
    imbalanced: boolean;
    inconsistentFonts: boolean;
    poorReadability: boolean;
  };
}

export class EnhancedAiDesignService {
  private modelLoaded: boolean = false;
  private contentAnalysisCache: Map<string, ContentAnalysisResult> = new Map();
  private suggestionHistory: AiDesignSuggestion[] = [];
  private userPreferences: Record<string, any> = {};
  private appliedSuggestions: Set<string> = new Set();
  
  constructor() {
    this.initModel();
    // Load user preferences from localStorage
    try {
      const savedPreferences = localStorage.getItem('aiDesignPreferences');
      if (savedPreferences) {
        this.userPreferences = JSON.parse(savedPreferences);
      }
    } catch (error) {
      console.error('Error loading AI preferences:', error);
    }
  }
  
  private async initModel() {
    try {
      // Initialize TensorFlow.js - in a real implementation, 
      // we would load actual models for content analysis
      await tf.ready();
      this.modelLoaded = true;
      console.log('Enhanced AI design service initialized');
    } catch (error) {
      console.error('Error initializing AI model:', error);
    }
  }
  
  /**
   * Analyze the current design content to understand context
   */
  public async analyzeContent(
    design: StampDesign,
    productShape: 'rectangle' | 'circle' | 'square',
    productSize: string
  ): Promise<ContentAnalysisResult> {
    // Create a cache key based on the design content
    const cacheKey = this.generateDesignCacheKey(design);
    
    // Check if we have cached analysis
    if (this.contentAnalysisCache.has(cacheKey)) {
      return this.contentAnalysisCache.get(cacheKey)!;
    }
    
    // Analyze the content of the stamp text
    const allText = design.lines.map(line => line.text).join(' ');
    
    // Detect content type
    let contentType: 'business' | 'legal' | 'personal' | 'creative' | 'date' | 'unknown' = 'unknown';
    let industry: string | undefined = undefined;
    let language: string | undefined = undefined;
    
    // Content type detection logic (simplified version)
    if (this.containsBusinessIdentifiers(allText)) {
      contentType = 'business';
      industry = this.detectIndustry(allText);
    } else if (this.containsLegalIdentifiers(allText)) {
      contentType = 'legal';
    } else if (this.containsDatePatterns(allText)) {
      contentType = 'date';
    } else if (design.lines.length <= 2 && allText.length < 30) {
      contentType = 'personal';
    }
    
    // Detect language (simplified version)
    language = this.detectLanguage(allText);
    
    // Check for design problems
    const problems = {
      overcrowded: design.lines.length > 5 || allText.length > 150,
      poorContrast: false, // Would check contrast between text and inkColor
      imbalanced: this.detectImbalance(design),
      inconsistentFonts: this.detectInconsistentFonts(design.lines),
      poorReadability: this.detectPoorReadability(design)
    };
    
    // Determine text density
    let textDensity: 'low' | 'medium' | 'high' | 'overcrowded' = 'low';
    if (allText.length > 150) {
      textDensity = 'overcrowded';
    } else if (allText.length > 100) {
      textDensity = 'high';
    } else if (allText.length > 50) {
      textDensity = 'medium';
    }
    
    // Create the analysis result
    const result: ContentAnalysisResult = {
      contentType,
      industry,
      language,
      hasAddress: this.detectAddress(allText),
      hasDate: this.containsDatePatterns(allText),
      hasContact: this.detectContactInfo(allText),
      textDensity,
      problems
    };
    
    // Cache the result
    this.contentAnalysisCache.set(cacheKey, result);
    
    return result;
  }
  
  /**
   * Generate suggestions based on design and content analysis
   */
  public async generateSuggestions(
    design: StampDesign,
    analysis: ContentAnalysisResult,
    productShape: 'rectangle' | 'circle' | 'square',
    applyCallback: (newDesign: Partial<StampDesign>) => void
  ): Promise<AiDesignSuggestion[]> {
    const suggestions: AiDesignSuggestion[] = [];
    
    // Check if we have enough content for analysis
    const hasContent = design.lines.some(line => line.text.trim().length > 0);
    if (!hasContent) {
      return this.getEmptyDesignSuggestions(productShape);
    }
    
    // 1. Generate layout suggestions based on content type
    const layoutSuggestions = await this.generateLayoutSuggestions(
      design, analysis, productShape, applyCallback
    );
    
    // 2. Generate style suggestions
    const styleSuggestions = await this.generateStyleSuggestions(
      design, analysis, productShape, applyCallback
    );
    
    // 3. Generate content-specific suggestions
    const contentSuggestions = await this.generateContentSuggestions(
      design, analysis, applyCallback
    );
    
    // 4. Font pairing suggestions
    const fontSuggestions = await this.generateFontSuggestions(
      design, analysis, productShape, applyCallback
    );
    
    // 5. Generate color suggestions
    const colorSuggestions = await this.generateColorSuggestions(
      design, analysis, applyCallback
    );
    
    // 6. Handle specific industry recommendations
    if (analysis.industry) {
      const industrySuggestions = await this.generateIndustrySuggestions(
        design, analysis, productShape, applyCallback
      );
      suggestions.push(...industrySuggestions);
    }
    
    // Combine all suggestions
    suggestions.push(
      ...layoutSuggestions,
      ...styleSuggestions,
      ...contentSuggestions,
      ...fontSuggestions,
      ...colorSuggestions
    );
    
    // Filter out suggestions that have been applied already
    const filteredSuggestions = suggestions.filter(
      suggestion => !this.appliedSuggestions.has(suggestion.id)
    );
    
    // Sort by priority (category) and confidence
    return filteredSuggestions.sort((a, b) => {
      // Sort by category first
      const categoryOrder = { critical: 0, recommended: 1, optional: 2 };
      const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];
      
      if (categoryDiff !== 0) return categoryDiff;
      
      // Then by confidence
      return b.confidence - a.confidence;
    });
  }
  
  /**
   * Mark a suggestion as applied
   */
  public markSuggestionApplied(suggestionId: string): void {
    this.appliedSuggestions.add(suggestionId);
    this.suggestionHistory.push(
      ...this.suggestionHistory.filter(s => s.id === suggestionId)
    );
  }
  
  /**
   * Clear applied suggestions tracking
   */
  public clearAppliedSuggestions(): void {
    this.appliedSuggestions.clear();
  }
  
  /**
   * Get suggestion history
   */
  public getSuggestionHistory(): AiDesignSuggestion[] {
    return [...this.suggestionHistory];
  }
  
  /**
   * Update user preferences
   */
  public updateUserPreference(key: string, value: any): void {
    this.userPreferences[key] = value;
    
    // Save to localStorage
    try {
      localStorage.setItem('aiDesignPreferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.error('Error saving AI preferences:', error);
    }
  }
  
  /**
   * Get empty design suggestions
   */
  private getEmptyDesignSuggestions(
    shape: 'rectangle' | 'circle' | 'square'
  ): AiDesignSuggestion[] {
    // Provide suggestions for empty designs
    const suggestions: AiDesignSuggestion[] = [];
    
    if (shape === 'circle') {
      suggestions.push({
        id: `empty-circle-${Date.now()}`,
        type: 'layout',
        category: 'recommended',
        title: 'Start with circular text',
        description: 'For circular stamps, start with text around the perimeter and a logo or main text in the center.',
        confidence: 0.95
      });
    } else {
      suggestions.push({
        id: `empty-rect-${Date.now()}`,
        type: 'content',
        category: 'recommended',
        title: 'Add your business details',
        description: 'Start with your business name, then add address or contact information below.',
        confidence: 0.9
      });
    }
    
    return suggestions;
  }
  
  /**
   * Generate layout suggestions based on content analysis
   */
  private async generateLayoutSuggestions(
    design: StampDesign,
    analysis: ContentAnalysisResult,
    productShape: 'rectangle' | 'circle' | 'square',
    applyCallback: (newDesign: Partial<StampDesign>) => void
  ): Promise<AiDesignSuggestion[]> {
    const suggestions: AiDesignSuggestion[] = [];
    
    // Detect layout issues
    if (analysis.problems.imbalanced) {
      // Suggest balanced layout for the shape
      if (productShape === 'circle') {
        suggestions.push({
          id: `balance-circle-${Date.now()}`,
          type: 'layout',
          category: 'critical',
          title: 'Balance your circular design',
          description: 'Circular stamps look best with curved text around the edge and centered content in the middle.',
          confidence: 0.9,
          action: {
            apply: () => {
              const newLines = [...design.lines];
              
              // Apply curved text to outer lines
              if (newLines.length >= 3) {
                // Make first line curved at top
                newLines[0] = { 
                  ...newLines[0], 
                  curved: true,
                  curvature: 'top',
                  alignment: 'center' as 'center'
                };
                
                // Make last line curved at bottom
                newLines[newLines.length - 1] = { 
                  ...newLines[newLines.length - 1], 
                  curved: true,
                  curvature: 'bottom',
                  alignment: 'center' as 'center'
                };
                
                // Center middle lines
                for (let i = 1; i < newLines.length - 1; i++) {
                  newLines[i] = {
                    ...newLines[i],
                    alignment: 'center' as 'center',
                    curved: false
                  };
                }
              }
              
              applyCallback({
                lines: newLines,
                borderStyle: 'double'
              });
            }
          }
        });
      } else {
        // For rectangular stamps
        suggestions.push({
          id: `balance-rect-${Date.now()}`,
          type: 'layout',
          category: 'recommended',
          title: 'Balance your rectangular design',
          description: 'Center-align your text and distribute it evenly for a professional look.',
          confidence: 0.85,
          action: {
            apply: () => {
              const newLines = design.lines.map(line => ({
                ...line,
                alignment: 'center' as 'center'
              }));
              
              applyCallback({
                lines: newLines
              });
            }
          }
        });
      }
    }
    
    // Check for contact information layout
    if (analysis.hasAddress && productShape !== 'circle') {
      suggestions.push({
        id: `address-format-${Date.now()}`,
        type: 'layout',
        category: 'recommended',
        title: 'Format address properly',
        description: 'Improve the formatting of your address with proper line breaks and emphasis.',
        confidence: 0.8,
        action: {
          apply: () => {
            // This would require more complex logic to identify and format address lines
            // For this example, we'll just emphasize the business name and center align
            const newLines = design.lines.map((line, index) => ({
              ...line,
              fontSize: index === 0 ? Math.max(line.fontSize, 18) : line.fontSize,
              bold: index === 0 ? true : line.bold,
              alignment: 'center' as 'center'
            }));
            
            applyCallback({
              lines: newLines
            });
          }
        }
      });
    }
    
    // Specific suggestion for overcrowded designs
    if (analysis.problems.overcrowded) {
      suggestions.push({
        id: `reduce-content-${Date.now()}`,
        type: 'layout',
        category: 'critical',
        title: 'Reduce content for better readability',
        description: 'Your stamp has too much text. Consider removing less important information or using abbreviations.',
        confidence: 0.95,
        action: {
          apply: () => {
            // No automatic action for this, would require user judgment
            console.log("This suggestion requires manual user action");
          }
        }
      });
    }
    
    return suggestions;
  }
  
  /**
   * Generate style suggestions
   */
  private async generateStyleSuggestions(
    design: StampDesign,
    analysis: ContentAnalysisResult,
    productShape: 'rectangle' | 'circle' | 'square',
    applyCallback: (newDesign: Partial<StampDesign>) => void
  ): Promise<AiDesignSuggestion[]> {
    const suggestions: AiDesignSuggestion[] = [];
    
    // Border style suggestions based on content type
    if (analysis.contentType === 'legal' || analysis.contentType === 'business') {
      if (design.borderStyle === 'none') {
        suggestions.push({
          id: `add-border-${Date.now()}`,
          type: 'style',
          category: 'recommended',
          title: 'Add a professional border',
          description: `A ${productShape === 'circle' ? 'circular' : 'rectangular'} border will give your ${analysis.contentType} stamp a more official appearance.`,
          confidence: 0.85,
          action: {
            apply: () => {
              applyCallback({
                borderStyle: analysis.contentType === 'legal' ? 'double' : 'single'
              });
            }
          }
        });
      }
    }
    
    // Logo suggestions for business stamps
    if (analysis.contentType === 'business' && !design.includeLogo) {
      suggestions.push({
        id: `add-logo-${Date.now()}`,
        type: 'style',
        category: 'recommended',
        title: 'Add your business logo',
        description: 'Including your logo will make your business stamp more recognizable and professional.',
        confidence: 0.8,
        action: {
          apply: () => {
            applyCallback({
              includeLogo: true,
              logoPosition: productShape === 'circle' ? 'center' : 'left'
            });
          }
        }
      });
    }
    
    return suggestions;
  }
  
  /**
   * Generate content suggestions
   */
  private async generateContentSuggestions(
    design: StampDesign,
    analysis: ContentAnalysisResult,
    applyCallback: (newDesign: Partial<StampDesign>) => void
  ): Promise<AiDesignSuggestion[]> {
    const suggestions: AiDesignSuggestion[] = [];
    
    // Simple content improvement examples
    if (analysis.contentType === 'business' && !analysis.hasContact) {
      suggestions.push({
        id: `add-contact-${Date.now()}`,
        type: 'content',
        category: 'optional',
        title: 'Add contact information',
        description: 'Consider adding a phone number or website to make your stamp more useful.',
        confidence: 0.7
        // No automatic action, would need user input
      });
    }
    
    // Check for text that could be improved
    const allText = design.lines.map(line => line.text).join(' ');
    if (allText.includes('DRAFT') || allText.includes('SAMPLE')) {
      suggestions.push({
        id: `replace-draft-${Date.now()}`,
        type: 'content',
        category: 'critical',
        title: 'Replace placeholder text',
        description: 'Replace "DRAFT" or "SAMPLE" text with your actual content before finalizing your design.',
        confidence: 0.98
      });
    }
    
    return suggestions;
  }
  
  /**
   * Generate font suggestions
   */
  private async generateFontSuggestions(
    design: StampDesign,
    analysis: ContentAnalysisResult,
    productShape: 'rectangle' | 'circle' | 'square',
    applyCallback: (newDesign: Partial<StampDesign>) => void
  ): Promise<AiDesignSuggestion[]> {
    const suggestions: AiDesignSuggestion[] = [];
    
    // Font consistency fixes
    if (analysis.problems.inconsistentFonts) {
      suggestions.push({
        id: `font-consistency-${Date.now()}`,
        type: 'font',
        category: 'recommended',
        title: 'Use consistent fonts',
        description: 'Using too many different fonts makes your stamp look unprofessional. Standardize your font choices.',
        confidence: 0.85,
        action: {
          apply: () => {
            // Find the most common font in the design
            const fontCounts = new Map<string, number>();
            design.lines.forEach(line => {
              const font = line.fontFamily;
              fontCounts.set(font, (fontCounts.get(font) || 0) + 1);
            });
            
            let mostCommonFont = 'Arial';
            let maxCount = 0;
            
            fontCounts.forEach((count, font) => {
              if (count > maxCount) {
                mostCommonFont = font;
                maxCount = count;
              }
            });
            
            // Apply the most common font to all lines
            const newLines = design.lines.map(line => ({
              ...line,
              fontFamily: mostCommonFont
            }));
            
            applyCallback({
              lines: newLines
            });
          }
        }
      });
    }
    
    // Font recommendations by content type
    if (analysis.contentType === 'legal') {
      const hasSerifFont = design.lines.some(line => 
        ['Times New Roman', 'Georgia', 'Garamond', 'serif'].includes(line.fontFamily)
      );
      
      if (!hasSerifFont) {
        suggestions.push({
          id: `legal-font-${Date.now()}`,
          type: 'font',
          category: 'recommended',
          title: 'Use a serif font for legal stamps',
          description: 'Serif fonts like Times New Roman convey authority and formality, perfect for legal stamps.',
          confidence: 0.8,
          action: {
            apply: () => {
              const newLines = design.lines.map(line => ({
                ...line,
                fontFamily: 'Times New Roman'
              }));
              
              applyCallback({
                lines: newLines
              });
            }
          }
        });
      }
    }
    
    return suggestions;
  }
  
  /**
   * Generate color suggestions
   */
  private async generateColorSuggestions(
    design: StampDesign,
    analysis: ContentAnalysisResult,
    applyCallback: (newDesign: Partial<StampDesign>) => void
  ): Promise<AiDesignSuggestion[]> {
    const suggestions: AiDesignSuggestion[] = [];
    
    // Color recommendations by content type
    if (analysis.contentType === 'legal' && design.inkColor !== 'blue' && design.inkColor !== 'black') {
      suggestions.push({
        id: `legal-color-${Date.now()}`,
        type: 'color',
        category: 'recommended',
        title: 'Use blue or black for legal stamps',
        description: 'For legal documents, blue or black ink provides the best official appearance and readability.',
        confidence: 0.9,
        action: {
          apply: () => {
            applyCallback({
              inkColor: 'blue'
            });
          }
        }
      });
    } else if (analysis.contentType === 'business' && design.inkColor === 'red') {
      suggestions.push({
        id: `business-color-${Date.now()}`,
        type: 'color',
        category: 'optional',
        title: 'Consider a professional ink color',
        description: 'Red can be seen as aggressive. For business stamps, blue, black, or green project professionalism.',
        confidence: 0.75,
        action: {
          apply: () => {
            applyCallback({
              inkColor: 'blue'
            });
          }
        }
      });
    }
    
    return suggestions;
  }
  
  /**
   * Generate industry-specific suggestions
   */
  private async generateIndustrySuggestions(
    design: StampDesign,
    analysis: ContentAnalysisResult,
    productShape: 'rectangle' | 'circle' | 'square',
    applyCallback: (newDesign: Partial<StampDesign>) => void
  ): Promise<AiDesignSuggestion[]> {
    const suggestions: AiDesignSuggestion[] = [];
    
    // Specific industry recommendations
    switch(analysis.industry) {
      case 'medical':
        suggestions.push({
          id: `medical-format-${Date.now()}`,
          type: 'layout',
          category: 'recommended',
          title: 'Format for medical use',
          description: 'Medical stamps should have clear practitioner credentials and standardized layout.',
          confidence: 0.85,
          industry: 'medical',
          action: {
            apply: () => {
              // For medical stamps, emphasize the name and credentials
              const newLines = design.lines.map((line, index) => ({
                ...line,
                fontSize: index === 0 ? Math.max(line.fontSize, 18) : line.fontSize,
                bold: index === 0,
                alignment: 'center' as 'center'
              }));
              
              applyCallback({
                lines: newLines,
                borderStyle: 'double'
              });
            }
          }
        });
        break;
        
      case 'legal':
        suggestions.push({
          id: `legal-format-${Date.now()}`,
          type: 'style',
          category: 'recommended',
          title: 'Format for legal use',
          description: 'Legal stamps benefit from double borders and formal text layout with appropriate spacing.',
          confidence: 0.9,
          industry: 'legal',
          action: {
            apply: () => {
              applyCallback({
                borderStyle: 'double',
                inkColor: 'blue'
              });
            }
          }
        });
        break;
        
      case 'education':
        suggestions.push({
          id: `education-format-${Date.now()}`,
          type: 'layout',
          category: 'recommended',
          title: 'Format for educational use',
          description: 'Educational stamps should include the institution name prominently and official department details.',
          confidence: 0.8,
          industry: 'education',
          action: {
            apply: () => {
              // For education stamps, emphasize the institution name
              const newLines = design.lines.map((line, index) => ({
                ...line,
                fontSize: index === 0 ? Math.max(line.fontSize, 18) : line.fontSize,
                bold: index === 0,
                alignment: 'center' as 'center'
              }));
              
              applyCallback({
                lines: newLines,
                borderStyle: 'single',
                includeLogo: true
              });
            }
          }
        });
        break;
    }
    
    return suggestions;
  }
  
  /**
   * Generate a unique key for the design to use in caching
   */
  private generateDesignCacheKey(design: StampDesign): string {
    const textContent = design.lines.map(line => line.text).join('|');
    const styling = `${design.borderStyle}|${design.inkColor}|${design.includeLogo}`;
    return `${textContent}|${styling}`;
  }
  
  /**
   * Check if text contains business-related identifiers
   */
  private containsBusinessIdentifiers(text: string): boolean {
    const businessKeywords = [
      'inc', 'llc', 'ltd', 'company', 'co', 'corporation', 'business',
      'gmbh', 'enterprises', 'services', 'office', 'dept', 'department',
      'inc.', 'llc.', 'ltd.', 'corp.', 'association', 'assoc.',
      'professional', 'partners', 'consultants', 'solutions'
    ];
    
    const lowercaseText = text.toLowerCase();
    return businessKeywords.some(keyword => lowercaseText.includes(keyword));
  }
  
  /**
   * Check if text contains legal identifiers
   */
  private containsLegalIdentifiers(text: string): boolean {
    const legalKeywords = [
      'attorney', 'lawyer', 'law office', 'legal', 'notary', 'public',
      'certified', 'licensed', 'court', 'judge', 'filing', 'filed',
      'approved', 'denied', 'received', 'official', 'document'
    ];
    
    const lowercaseText = text.toLowerCase();
    return legalKeywords.some(keyword => lowercaseText.includes(keyword));
  }
  
  /**
   * Check if text contains date patterns
   */
  private containsDatePatterns(text: string): boolean {
    // Simple date pattern detection
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{2,4}/,  // MM/DD/YYYY
      /\d{1,2}-\d{1,2}-\d{2,4}/,    // MM-DD-YYYY
      /\d{1,2}\.\d{1,2}\.\d{2,4}/,  // MM.DD.YYYY
      /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i, // Month names
      /January|February|March|April|June|July|August|September|October|November|December/i,
      /\d{1,2} \w+ \d{2,4}/,        // DD Month YYYY
      /received|dated|issued on|approved on|processed/i  // Date-related words
    ];
    
    return datePatterns.some(pattern => pattern.test(text));
  }
  
  /**
   * Detect industry from text content
   */
  private detectIndustry(text: string): string | undefined {
    const lowercaseText = text.toLowerCase();
    
    // Industry keywords
    const industries = {
      'medical': ['doctor', 'dr.', 'physician', 'medical', 'health', 'clinic', 'hospital', 'pharmacy', 'md', 'dental', 'dentist'],
      'legal': ['attorney', 'lawyer', 'law firm', 'legal', 'notary', 'paralegal', 'court', 'justice'],
      'education': ['school', 'university', 'college', 'academy', 'institute', 'education', 'learning', 'teacher', 'professor'],
      'retail': ['store', 'shop', 'retail', 'market', 'sale', 'discount', 'merchandise'],
      'finance': ['bank', 'financial', 'accounting', 'cpa', 'tax', 'insurance', 'investment'],
      'real estate': ['realty', 'real estate', 'property', 'agent', 'broker', 'housing'],
      'government': ['government', 'dept.', 'department', 'agency', 'bureau', 'office of', 'federal', 'state of']
    };
    
    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        return industry;
      }
    }
    
    return undefined;
  }
  
  /**
   * Detect language from text
   */
  private detectLanguage(text: string): string | undefined {
    if (!text || text.trim().length === 0) {
      return undefined;
    }
    
    // Simple language detection based on common words and characters
    // This is a simplification; real language detection would use more sophisticated methods
    
    const frenchIndicators = ['le', 'la', 'les', 'un', 'une', 'des', 'du', 'au', 'et', 'de', 'à'];
    const spanishIndicators = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'de', 'del'];
    const germanIndicators = ['der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'für', 'mit'];
    
    // Count indicators for each language
    const words = text.toLowerCase().split(/\s+/);
    let frenchCount = 0, spanishCount = 0, germanCount = 0, englishCount = 0;
    
    words.forEach(word => {
      if (frenchIndicators.includes(word)) frenchCount++;
      if (spanishIndicators.includes(word)) spanishCount++;
      if (germanIndicators.includes(word)) germanCount++;
      
      // English has no special characters, so check if word contains only ASCII
      if (/^[a-zA-Z0-9\s.,!?;:'"-]+$/.test(word)) englishCount++;
    });
    
    // Special character detection
    if (/[éèêëàâäôöùûüÿç]/i.test(text)) frenchCount += 2;
    if (/[áéíóúüñ]/i.test(text)) spanishCount += 2;
    if (/[äöüß]/i.test(text)) germanCount += 2;
    
    // Determine the most likely language
    const counts = [
      { lang: 'en', count: englishCount },
      { lang: 'fr', count: frenchCount },
      { lang: 'es', count: spanishCount },
      { lang: 'de', count: germanCount }
    ];
    
    const highestCount = Math.max(...counts.map(c => c.count));
    const mostLikely = counts.find(c => c.count === highestCount);
    
    // Only return if we have some confidence
    return (highestCount > 0) ? mostLikely?.lang : undefined;
  }
  
  /**
   * Detect if text contains an address pattern
   */
  private detectAddress(text: string): boolean {
    // Address detection patterns
    const addressPatterns = [
      /\d+ \w+ (st|street|ave|avenue|blvd|boulevard|rd|road|ln|lane|drive|dr|way|place|pl|court|ct)/i,
      /p\.?o\.? box \d+/i,
      /\b[A-Z]{2} \d{5}\b/,  // State code + ZIP
      /\b\d{5}(-\d{4})?\b/   // ZIP or ZIP+4
    ];
    
    return addressPatterns.some(pattern => pattern.test(text));
  }
  
  /**
   * Detect if text contains contact information
   */
  private detectContactInfo(text: string): boolean {
    // Contact info detection patterns
    const contactPatterns = [
      /\(\d{3}\) \d{3}-\d{4}/,  // (555) 555-5555
      /\d{3}-\d{3}-\d{4}/,     // 555-555-5555
      /\b\d{10}\b/,            // 5555555555
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email
      /https?:\/\/[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,           // Website
      /www\.[A-Za-z0-9.-]+\.[A-Za-z]{2,}/                  // www website
    ];
    
    return contactPatterns.some(pattern => pattern.test(text));
  }
  
  /**
   * Detect if the design has imbalanced layout
   */
  private detectImbalance(design: StampDesign): boolean {
    // Simple imbalance detection based on text alignment and position
    
    // Check if text lines have different alignments
    const alignments = new Set(design.lines.map(line => line.alignment));
    if (alignments.size > 1) {
      return true;
    }
    
    // Check for inconsistent positioning
    const positions = design.lines.map(line => ({x: line.xPosition, y: line.yPosition}));
    if (positions.some(p => Math.abs(p.x) > 50 || Math.abs(p.y) > 50)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Detect if the design has inconsistent fonts
   */
  private detectInconsistentFonts(lines: StampTextLine[]): boolean {
    // Check if there are too many different fonts
    const fonts = new Set(lines.map(line => line.fontFamily));
    return fonts.size > 2;
  }
  
  /**
   * Detect if the design has poor readability
   */
  private detectPoorReadability(design: StampDesign): boolean {
    // Simple readability detection
    // Check if font sizes are too small or text is too dense
    return design.lines.some(line => line.fontSize < 10) || 
           design.lines.reduce((sum, line) => sum + line.text.length, 0) > 120;
  }
}

// Export a singleton instance
export const enhancedAiDesignService = new EnhancedAiDesignService();
