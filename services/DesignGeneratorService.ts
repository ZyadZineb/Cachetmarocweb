
import { v4 as uuidv4 } from 'uuid';
import { 
  GeneratedDesign, 
  TemplateVariation,
  StampTemplate,
  ContentAnalysisResult,
  ContentPattern
} from '@/types/designTemplates';
import { StampDesign, StampTextLine } from '@/types';
import { getAllTemplates, getTemplateById, getTemplatesByShape, getTemplatesByPurpose } from '@/data/stampTemplates';

/**
 * Service for generating stamp design suggestions based on templates
 */
class DesignGeneratorService {
  /**
   * Analyze text content to determine patterns and suitable templates
   */
  analyzeContent(design: StampDesign): ContentAnalysisResult {
    const patterns: ContentPattern[] = [];
    let textCount = 0;
    let complexity = 0;
    
    // Analyze each line of text
    design.lines.forEach(line => {
      const text = line.text.trim();
      if (!text) return;
      
      textCount++;
      complexity += text.length / 15; // Rough complexity factor based on length
      
      // Look for common content patterns
      if (/^[A-Z\s]+$/i.test(text) && text.length > 10) {
        // Likely a company name or organization name
        patterns.push({
          type: 'company',
          text,
          confidence: 0.8
        });
      } 
      else if (/(\d+\s+[\w\s]+\,?\s+\w+\,?\s+\w{2}\s+\d{5})/i.test(text)) {
        // Likely an address
        patterns.push({
          type: 'address',
          text,
          confidence: 0.9
        });
      }
      else if (/(\(\d{3}\)\s*\d{3}-\d{4})|(\d{3}-\d{3}-\d{4})/i.test(text)) {
        // Phone number
        patterns.push({
          type: 'phone',
          text,
          confidence: 0.95
        });
      }
      else if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(text)) {
        // Email
        patterns.push({
          type: 'email',
          text,
          confidence: 0.95
        });
      }
      else if (/approved|certified|notarized|authorized/i.test(text)) {
        // Likely approval or certification text
        patterns.push({
          type: 'title',
          text,
          confidence: 0.7
        });
      }
    });
    
    // Determine overall content type
    let contentType: 'business' | 'official' | 'personal' | 'unknown' = 'unknown';
    
    const hasBusinessIndicators = patterns.some(p => 
      p.type === 'company' || p.type === 'email' || 
      (p.type === 'address' && design.lines.length >= 3)
    );
    
    const hasOfficialIndicators = patterns.some(p => 
      p.text.match(/department|office|state|government|official|notary|certified/i)
    );
    
    const hasPersonalIndicators = !hasBusinessIndicators && 
      patterns.length <= 2 && 
      design.lines.some(l => l.text.match(/family|home|from the desk of/i));
    
    if (hasBusinessIndicators) contentType = 'business';
    else if (hasOfficialIndicators) contentType = 'official';
    else if (hasPersonalIndicators) contentType = 'personal';
    
    return {
      patterns,
      contentType,
      complexity,
      textCount
    };
  }
  
  /**
   * Generate design suggestions based on the current design and product
   */
  generateDesignSuggestions(
    design: StampDesign, 
    count: number = 3,
    categoryFilter?: string,
    shapeFilter?: string
  ): GeneratedDesign[] {
    const contentAnalysis = this.analyzeContent(design);
    const suggestions: GeneratedDesign[] = [];
    
    // Get templates suitable for this design
    let templates = getAllTemplates();
    
    // Apply shape filter if provided
    if (shapeFilter) {
      templates = templates.filter(t => t.compatibility.includes(shapeFilter));
    }
    
    // Apply category filter if provided
    if (categoryFilter && categoryFilter !== 'all') {
      templates = templates.filter(t => t.purpose === categoryFilter);
    }
    
    // If we have determined a content type, prioritize those templates
    if (contentAnalysis.contentType !== 'unknown') {
      templates.sort((a, b) => {
        const aMatchesPurpose = a.purpose === contentAnalysis.contentType ? 1 : 0;
        const bMatchesPurpose = b.purpose === contentAnalysis.contentType ? 1 : 0;
        return bMatchesPurpose - aMatchesPurpose;
      });
    }
    
    // If we don't have enough templates, just use what we have
    const availableCount = Math.min(count, templates.length);
    
    // Take top templates based on match and popularity
    for (let i = 0; i < availableCount; i++) {
      const template = templates[i];
      
      // Create a design from this template
      const generatedDesign = this.createDesignFromTemplate(design, template);
      
      // Calculate a "match score" based on how well the template fits the content
      const score = this.calculateTemplateMatchScore(template, contentAnalysis);
      
      suggestions.push({
        id: uuidv4(),
        templateId: template.id,
        templateName: template.name,
        design: generatedDesign,
        score,
        generatedAt: new Date()
      });
    }
    
    // Sort by score
    return suggestions.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Calculate how well a template matches the analyzed content
   */
  private calculateTemplateMatchScore(template: StampTemplate, analysis: ContentAnalysisResult): number {
    let score = 0.5; // Start with 50%
    
    // Check if the template purpose matches the content type
    if (template.purpose === analysis.contentType) {
      score += 0.2;
    }
    
    // Check if the template has enough text zones for the content
    if (template.textZones.length >= analysis.textCount) {
      score += 0.15;
    } else {
      // Penalty if not enough zones
      score -= 0.1;
    }
    
    // Check if the template complexity matches the content complexity
    // Complex templates are better for more complex content
    const templateComplexity = template.textZones.length / 3; // Rough measure
    const complexityDiff = Math.abs(templateComplexity - analysis.complexity) / Math.max(templateComplexity, analysis.complexity);
    score += (1 - complexityDiff) * 0.1;
    
    // Add some randomness to avoid always getting the same templates
    score += Math.random() * 0.1;
    
    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Create a StampDesign from a template
   */
  private createDesignFromTemplate(currentDesign: StampDesign, template: StampTemplate): StampDesign {
    // Start with a copy of the current design
    const newDesign: StampDesign = JSON.parse(JSON.stringify(currentDesign));
    
    // Apply template settings
    newDesign.borderStyle = template.borderStyle;
    
    // Create text lines based on the template's text zones
    const newLines: StampTextLine[] = [];
    
    // For each text zone in the template
    template.textZones.forEach((zone, index) => {
      // Try to find existing text that matches this zone's purpose
      let text = '';
      let foundMatch = false;
      
      if (index < currentDesign.lines.length) {
        text = currentDesign.lines[index].text;
        foundMatch = true;
      }
      
      // Create new text line with template formatting
      const newLine: StampTextLine = {
        text: text,
        fontSize: zone.fontSize,
        fontFamily: 'Arial', // Default font
        bold: zone.bold,
        italic: false,
        alignment: zone.alignment,
        curved: zone.curved,
        curvature: zone.curvature,
        letterSpacing: 0,
        xPosition: 0,
        yPosition: this.calculateYPositionFromZone(zone.position),
        isDragging: false
      };
      
      newLines.push(newLine);
    });
    
    // Apply lines to the new design
    newDesign.lines = newLines;
    
    // Apply logo position if the template specifies one
    if (template.logoPosition) {
      newDesign.includeLogo = currentDesign.includeLogo;
      
      // Position logo based on template positioning
      switch (template.logoPosition) {
        case 'top':
          newDesign.logoX = 0;
          newDesign.logoY = -50;
          break;
        case 'bottom':
          newDesign.logoX = 0;
          newDesign.logoY = 50;
          break;
        case 'left':
          newDesign.logoX = -50;
          newDesign.logoY = 0;
          break;
        case 'right':
          newDesign.logoX = 50;
          newDesign.logoY = 0;
          break;
        case 'center':
          newDesign.logoX = 0;
          newDesign.logoY = 0;
          break;
      }
    }
    
    return newDesign;
  }
  
  /**
   * Convert position string to y-coordinate value
   */
  private calculateYPositionFromZone(position: string): number {
    switch (position) {
      case 'top': return -40;
      case 'top-right': return -40;
      case 'top-left': return -40;
      case 'middle': return 0;
      case 'middle-top': return -20;
      case 'middle-bottom': return 20;
      case 'bottom': return 40;
      case 'bottom-right': return 40;
      case 'bottom-left': return 40;
      case 'center': return 0;
      case 'center-top': return -15;
      case 'center-bottom': return 15;
      case 'perimeter-top': return -40;
      case 'perimeter-bottom': return 40;
      default: return 0;
    }
  }
  
  /**
   * Generate design variations based on a specific design
   */
  generateDesignVariations(baseDesign: StampDesign, templateId: string, count: number = 3): GeneratedDesign[] {
    const template = getTemplateById(templateId);
    const variations: GeneratedDesign[] = [];
    
    if (!template) {
      return [];
    }
    
    // Create variations using the template's variation options or by modifying properties
    for (let i = 0; i < count; i++) {
      // Copy the base design
      const variation: StampDesign = JSON.parse(JSON.stringify(baseDesign));
      
      // Apply some variations
      
      // Variation 1: Try different font
      if (i === 0) {
        if (template.recommendedFonts.length > 1) {
          const fontIndex = Math.floor(Math.random() * template.recommendedFonts.length);
          variation.lines = variation.lines.map(line => ({
            ...line,
            fontFamily: template.recommendedFonts[fontIndex]
          }));
        }
      }
      
      // Variation 2: Different border style
      else if (i === 1) {
        const borderStyles: Array<'single' | 'double' | 'triple' | 'none'> = ['single', 'double', 'triple', 'none'];
        const currentIndex = borderStyles.indexOf(variation.borderStyle as any);
        const nextIndex = (currentIndex + 1) % borderStyles.length;
        variation.borderStyle = borderStyles[nextIndex];
      }
      
      // Variation 3: Different text spacing and positions
      else {
        variation.lines = variation.lines.map(line => ({
          ...line,
          letterSpacing: Math.floor(Math.random() * 2), // 0 or 1
          yPosition: line.yPosition + (Math.random() * 10 - 5) // Slight position shift
        }));
      }
      
      // Calculate a slightly different score for each variation
      const baseScore = 0.5 + Math.random() * 0.3;
      
      variations.push({
        id: uuidv4(),
        templateId: template.id,
        templateName: `${template.name} (Variation ${i+1})`,
        design: variation,
        score: baseScore,
        generatedAt: new Date()
      });
    }
    
    return variations;
  }
}

export const designGeneratorService = new DesignGeneratorService();
