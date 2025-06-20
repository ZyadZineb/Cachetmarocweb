import { StampTextLine } from '@/types';

export class TextPositioningService {
  // Safe zone margin in percentage (1mm = 2% of stamp size)
  static readonly MARGIN_PERCENT: number = 2;
  
  /**
   * Gets a default position for a line based on its index and total lines
   */
  static getDefaultLinePosition(
    index: number,
    totalLines: number,
    shape: 'rectangle' | 'circle' | 'square'
  ): Partial<StampTextLine> {
    // Base line properties
    const line: Partial<StampTextLine> = {
      xPosition: 0,
      yPosition: 0,
      curved: false,
      curvature: 'top',
      fontSize: 16
    };
    
    // For circles, automatic curved text on top/bottom
    if (shape === 'circle' && totalLines >= 2) {
      if (index === 0) {
        line.curved = true;
        line.curvature = 'top';
        line.yPosition = -70; // Near top edge with safe margin
        line.fontSize = 14;
      } else if (index === totalLines - 1) {
        line.curved = true;
        line.curvature = 'bottom';
        line.yPosition = 70; // Near bottom edge with safe margin
        line.fontSize = 14;
      } else {
        // Middle lines are straight and distributed evenly
        const middleLineCount = totalLines - 2;
        if (middleLineCount > 0) {
          const middleIndex = index - 1;
          const spacing = 100 / (middleLineCount + 1);
          line.yPosition = -40 + (middleIndex + 1) * spacing;
        }
      }
    } else {
      // For rectangle/square or circles with 1 line, distribute evenly
      const availableHeight = 180; // -90 to 90 with 10% margin on each side
      const spacing = totalLines > 1 ? availableHeight / totalLines : 0;
      const startY = -availableHeight / 2 + spacing / 2;
      line.yPosition = startY + index * spacing;
      
      // Adjust font size for many lines
      if (totalLines > 3) {
        line.fontSize = Math.max(12, 18 - totalLines);
      }
    }
    
    return line;
  }
  
  /**
   * Distribute text lines evenly within the stamp area
   */
  static distributeLines(
    lines: StampTextLine[],
    shape: 'rectangle' | 'circle' | 'square'
  ): StampTextLine[] {
    if (!lines || lines.length === 0) return [];
    
    // Calculate available height based on shape
    const availableHeight = shape === 'circle' ? 160 : 180; // Leave 10% margin for safe zone
    
    // Calculate total space needed for all lines
    const totalTextHeight = lines.reduce((total, line) => {
      // Calculate height based on font size (approximate)
      const lineHeight = line.fontSize * 1.2;
      return total + lineHeight;
    }, 0);
    
    // Calculate spacing between lines
    const lineCount = lines.length;
    const spacing = lineCount > 1 
      ? (availableHeight - totalTextHeight) / (lineCount - 1)
      : 0;
    
    // Distribute lines evenly
    let currentY = -availableHeight / 2;
    
    return lines.map((line, index) => {
      const lineHeight = line.fontSize * 1.2;
      
      // Calculate position for this line
      const yPosition = currentY + (lineHeight / 2);
      
      // Update current Y for next line
      currentY += lineHeight + spacing;
      
      const newLine = { ...line };
      
      // For circles, apply curved text to first and last line
      if (shape === 'circle' && lineCount > 1) {
        if (index === 0) {
          newLine.curved = true;
          newLine.curvature = 'top';
        } else if (index === lineCount - 1) {
          newLine.curved = true;
          newLine.curvature = 'bottom';
        } else {
          newLine.curved = false;
        }
      }
      
      // Convert to -100 to 100 range
      newLine.yPosition = (yPosition / (availableHeight / 2)) * 100;
      
      return newLine;
    });
  }
  
  /**
   * Keeps text within the safe zone boundaries
   */
  static enforceSafeZone(
    line: StampTextLine,
    shape: 'rectangle' | 'circle' | 'square'
  ): StampTextLine {
    const newLine = { ...line };
    const margin = this.MARGIN_PERCENT;
    
    // Boundary depends on shape
    if (shape === 'circle') {
      // For circle, use the inscribed square as boundary
      // Pythagorean theorem: radius is 100
      const safeRadius = 100 - margin * Math.sqrt(2); // Adjust radius for diagonal safety margin
      const distanceFromCenter = Math.sqrt(
        Math.pow(line.xPosition || 0, 2) + Math.pow(line.yPosition || 0, 2)
      );
      
      if (distanceFromCenter > safeRadius) {
        // Normalize the position to keep the same angle but reduce the distance
        const ratio = safeRadius / distanceFromCenter;
        newLine.xPosition = (line.xPosition || 0) * ratio;
        newLine.yPosition = (line.yPosition || 0) * ratio;
      }
    } else {
      // For rectangle/square, use simple min/max bounds
      const safeMax = 100 - margin;
      const safeMin = -safeMax;
      
      newLine.xPosition = Math.min(Math.max(line.xPosition || 0, safeMin), safeMax);
      newLine.yPosition = Math.min(Math.max(line.yPosition || 0, safeMin), safeMax);
    }
    
    return newLine;
  }
  
  /**
   * Check if a text line is outside the safe zone
   */
  static isOutsideSafeZone(
    line: StampTextLine,
    shape: 'rectangle' | 'circle' | 'square'
  ): boolean {
    const margin = this.MARGIN_PERCENT;
    
    if (shape === 'circle') {
      // For circle, check distance from center
      const safeRadius = 100 - margin * Math.sqrt(2);
      const distanceFromCenter = Math.sqrt(
        Math.pow(line.xPosition || 0, 2) + Math.pow(line.yPosition || 0, 2)
      );
      return distanceFromCenter > safeRadius;
    } else {
      // For rectangle/square, check bounds
      const safeMax = 100 - margin;
      const safeMin = -safeMax;
      
      return (
        (line.xPosition || 0) > safeMax || 
        (line.xPosition || 0) < safeMin || 
        (line.yPosition || 0) > safeMax || 
        (line.yPosition || 0) < safeMin
      );
    }
  }
  
  /**
   * Detect if any text lines are overlapping
   */
  static detectLineCollisions(
    lines: StampTextLine[],
    shape: 'rectangle' | 'circle' | 'square'
  ): boolean {
    if (!lines || lines.length < 2) return false;
    
    // Simple collision detection based on Y position and font size
    for (let i = 0; i < lines.length - 1; i++) {
      const line1 = lines[i];
      const line1Height = line1.fontSize || 16;
      
      for (let j = i + 1; j < lines.length; j++) {
        const line2 = lines[j];
        const line2Height = line2.fontSize || 16;
        
        // Calculate vertical distances
        const yDistance = Math.abs((line1.yPosition || 0) - (line2.yPosition || 0));
        const minRequiredDistance = (line1Height + line2Height) * 0.6; // 60% of combined height
        
        // Calculate horizontal distances
        const xDistance = Math.abs((line1.xPosition || 0) - (line2.xPosition || 0));
        const textWidth1 = (line1.text || '').length * (line1.fontSize || 16) * 0.6; // Approximate width
        const textWidth2 = (line2.text || '').length * (line2.fontSize || 16) * 0.6; // Approximate width
        const horizontalOverlap = xDistance < (textWidth1 + textWidth2) / 2;
        
        if (yDistance < minRequiredDistance && horizontalOverlap) {
          return true; // Collision detected
        }
      }
    }
    
    return false;
  }
  
  /**
   * Calculate available height for text based on shape
   */
  static calculateAvailableHeight(shape: 'rectangle' | 'circle' | 'square'): number {
    return shape === 'circle' ? 160 : 180; // 10% margin for safety
  }
  
  /**
   * Get safe zone margins for a given shape
   * @param shape The shape of the stamp
   * @returns Object with top, right, bottom, left margin values in percentage
   */
  static getSafeZone(shape: 'rectangle' | 'circle' | 'square'): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    const margin = this.MARGIN_PERCENT;
    
    // For all shapes, we use a consistent margin
    return {
      top: margin,
      right: margin,
      bottom: margin,
      left: margin
    };
  }
  
  /**
   * Check if text is fully within the safe zone, accounting for text dimensions
   * @param text The text content
   * @param line The text line with position and font size
   * @param shape The shape of the stamp
   * @returns Boolean indicating if text is fully within safe zone
   */
  static isTextWithinSafeZone(
    text: string,
    line: StampTextLine,
    shape: 'rectangle' | 'circle' | 'square'
  ): boolean {
    // If no text, consider it within bounds
    if (!text || text.length === 0) return true;
    
    const { xPosition, yPosition, fontSize, curved } = line;
    
    // Estimate text dimensions (approximation)
    // For a more accurate calculation, we would need a canvas context
    const estimatedCharWidth = fontSize * 0.6;
    const estimatedTextWidth = text.length * estimatedCharWidth;
    const estimatedTextHeight = fontSize * 1.2;
    
    // Calculate text boundaries
    const textLeft = (xPosition || 0) - (estimatedTextWidth / 2);
    const textRight = (xPosition || 0) + (estimatedTextWidth / 2);
    const textTop = (yPosition || 0) - (estimatedTextHeight / 2);
    const textBottom = (yPosition || 0) + (estimatedTextHeight / 2);
    
    // Get safe zone dimensions
    const safeZone = this.getSafeZone(shape);
    const safeLeft = -100 + safeZone.left;
    const safeRight = 100 - safeZone.right;
    const safeTop = -100 + safeZone.top;
    const safeBottom = 100 - safeZone.bottom;
    
    if (shape === 'rectangle' || shape === 'square') {
      // For rectangular shapes, check if text is within safe rectangle
      return (
        textLeft >= safeLeft &&
        textRight <= safeRight &&
        textTop >= safeTop &&
        textBottom <= safeBottom
      );
    } else if (shape === 'circle') {
      // For circular stamps, use different calculations based on whether text is curved
      if (curved) {
        // For curved text, calculate distance from center to text arc
        // This is a better approximation for curved text
        const safeRadius = 100 - Math.max(safeZone.top, safeZone.right, safeZone.bottom, safeZone.left);
        const distanceFromCenter = Math.abs(yPosition || 0);  // For curved text, yPosition represents distance from center
        
        return distanceFromCenter + (estimatedTextHeight / 2) <= safeRadius;
      } else {
        // For straight text in a circle, use Pythagorean theorem
        const safeRadius = 100 - Math.max(safeZone.top, safeZone.right, safeZone.bottom, safeZone.left);
        const distanceFromCenter = Math.sqrt(
          Math.pow(xPosition || 0, 2) + Math.pow(yPosition || 0, 2)
        );
        
        // Check both distance and the farthest point of the text box
        const textBoxDiagonal = Math.sqrt(
          Math.pow(estimatedTextWidth / 2, 2) + Math.pow(estimatedTextHeight / 2, 2)
        );
        
        return distanceFromCenter + textBoxDiagonal <= safeRadius;
      }
    }
    
    return true;  // Default fallback
  }
  
  /**
   * Check if any part of the text is outside the safe zone
   * @param lines Array of text lines to check
   * @param shape The shape of the stamp
   * @returns Array of indices of lines that are outside the safe zone
   */
  static getLinesOutsideSafeZone(
    lines: StampTextLine[],
    shape: 'rectangle' | 'circle' | 'square'
  ): number[] {
    if (!lines || lines.length === 0) return [];
    
    const outsideLines: number[] = [];
    
    lines.forEach((line, index) => {
      if (!this.isTextWithinSafeZone(line.text, line, shape)) {
        outsideLines.push(index);
      }
    });
    
    return outsideLines;
  }
  
  /**
   * Render curved text for circular stamps on a canvas context
   * @param ctx Canvas rendering context
   * @param text Text to render
   * @param centerX X coordinate of the center point
   * @param centerY Y coordinate of the center point
   * @param radius Radius for the text arc
   * @param line Text line properties
   * @returns void
   */
  static renderCurvedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    radius: number,
    line: StampTextLine
  ): void {
    if (!text || text.length === 0) return;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Determine if this is bottom text (based on curvature)
    const isBottomText = line.curvature === 'bottom';
    
    // For bottom text, we need to invert it
    if (isBottomText) {
      ctx.rotate(Math.PI);
    }
    
    // Set text properties
    ctx.font = `${line.italic ? 'italic ' : ''}${line.bold ? 'bold ' : ''}${line.fontSize}px ${line.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black'; // Default color, can be overridden
    
    const textLength = text.length;
    
    // Calculate start and end angles based on position
    const startAngle = isBottomText ? Math.PI / 4 : -Math.PI / 4;
    const endAngle = isBottomText ? (Math.PI * 7) / 4 : Math.PI / 4;
    
    const arcLength = Math.abs(endAngle - startAngle);
    const charAngle = arcLength / textLength;
    
    // Start at the beginning angle
    let currentAngle = startAngle;
    
    // Draw each character along the arc
    for (let i = 0; i < textLength; i++) {
      ctx.save();
      
      // Rotate to the current angle
      ctx.rotate(currentAngle);
      
      // Move to the correct radius
      ctx.translate(0, -radius);
      
      // For bottom text, rotate each character 180 degrees
      if (isBottomText) {
        ctx.rotate(Math.PI);
      }
      
      // Draw the character
      ctx.fillText(text[i], 0, 0);
      
      ctx.restore();
      
      // Move to the next character angle
      currentAngle += charAngle;
    }
    
    ctx.restore();
  }
  
  /**
   * Get optimal radius for curved text based on line position and stamp size
   * @param line Text line properties
   * @param stampRadius Radius of the stamp
   * @returns Optimal radius for curved text
   */
  static getCurvedTextRadius(line: StampTextLine, stampRadius: number): number {
    // Base radius is 80% of stamp radius
    let radius = stampRadius * 0.8;
    
    // Adjust based on yPosition - closer to edge means larger radius
    if (line.yPosition) {
      const absPosition = Math.abs(line.yPosition);
      // As position approaches edge (100), increase radius
      if (absPosition > 50) {
        radius += (stampRadius * 0.15) * ((absPosition - 50) / 50);
      }
    }
    
    // Ensure we don't exceed the safe zone
    const safeRadius = stampRadius * (1 - this.MARGIN_PERCENT / 100);
    radius = Math.min(radius, safeRadius);
    
    return radius;
  }
  
  /**
   * Get appropriate start and end angles for curved text based on curvature
   * @param line Text line properties
   * @returns Object with start and end angles in radians
   */
  static getCurvedTextAngles(line: StampTextLine): { startAngle: number, endAngle: number } {
    // Default angles for top curved text
    let startAngle = -Math.PI / 4;
    let endAngle = Math.PI / 4;
    
    // Adjust angles based on curvature
    if (line.curvature === 'bottom') {
      startAngle = Math.PI / 4;
      endAngle = (Math.PI * 7) / 4;
    }
    
    return { startAngle, endAngle };
  }
}
