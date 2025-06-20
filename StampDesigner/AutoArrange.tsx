
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Wand } from 'lucide-react';
import { HelpTooltip } from '@/components/ui/tooltip-custom';
import { StampDesign, StampTextLine } from '@/types';

interface AutoArrangeProps {
  design: StampDesign;
  onArrange: (updatedLines: StampTextLine[]) => void;
  shape: 'rectangle' | 'circle' | 'square';
}

const AutoArrange: React.FC<AutoArrangeProps> = ({ design, onArrange, shape }) => {
  const { t } = useTranslation();
  
  const handleAutoArrange = () => {
    // Create a copy of the design lines
    const updatedLines = [...design.lines];
    const nonEmptyLines = updatedLines.filter(line => line.text.trim().length > 0);
    
    if (nonEmptyLines.length === 0) return;
    
    // Distribute the lines evenly based on shape
    if (shape === 'circle') {
      // For circular stamps, identify which lines should be on top/bottom arcs and which in center
      const centerLines: StampTextLine[] = [];
      const topArcLines: StampTextLine[] = [];
      const bottomArcLines: StampTextLine[] = [];
      
      // Enhanced arrangement:
      // 1. Longer lines in the center (not curved)
      // 2. Shorter lines on the perimeter (curved)
      // 3. Distribute lines between top and bottom arcs
      
      // Sort lines based on length and content type
      nonEmptyLines.forEach((line, index) => {
        // Heuristic: Analyze content and length to determine placement
        if (line.text.length > 15 || 
            (line.text.includes(',') && line.text.length > 10) ||
            line.text.match(/^\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4}$/) // Date format detection
           ) {
          centerLines.push({...line, curved: false, curvature: 'top'});
        } else {
          // Alternate between top and bottom for short lines
          if (index % 2 === 0 || bottomArcLines.length >= Math.ceil(nonEmptyLines.length / 3)) {
            topArcLines.push({...line, curved: true, curvature: 'top'});
          } else {
            bottomArcLines.push({...line, curved: true, curvature: 'bottom'});
          }
        }
      });
      
      // Position top arc lines
      if (topArcLines.length > 0) {
        topArcLines.forEach((line, index) => {
          // Set curved for circle stamps
          line.curved = true;
          line.curvature = 'top';
          
          // Adjust position - higher up on the circle
          line.yPosition = -70;
          
          // Distribute x-position evenly if multiple lines
          if (topArcLines.length > 1) {
            // Distribute x positions for better spacing between multiple top arc lines
            const xOffset = ((index / (topArcLines.length - 1)) * 40) - 20;
            line.xPosition = xOffset;
          } else {
            line.xPosition = 0;
          }
          
          // Adjust font size based on line count and length
          line.fontSize = Math.max(16, 24 - topArcLines.length * 1.5 - Math.min(5, line.text.length / 10));
          
          // Ensure alignment is centered for curved text
          line.alignment = 'center';
          
          // Add letter spacing for better curved text readability
          line.letterSpacing = 0.5;
        });
      }
      
      // Position bottom arc lines - properly oriented for readability
      if (bottomArcLines.length > 0) {
        bottomArcLines.forEach((line, index) => {
          // Set curved for circle stamps
          line.curved = true;
          line.curvature = 'bottom';
          
          // Adjust position - lower on the circle
          line.yPosition = 70;
          
          // Distribute x-position evenly if multiple lines
          if (bottomArcLines.length > 1) {
            // Distribute x positions for better spacing between multiple bottom arc lines
            const xOffset = ((index / (bottomArcLines.length - 1)) * 40) - 20;
            line.xPosition = xOffset;
          } else {
            line.xPosition = 0;
          }
          
          // Adjust font size based on line count and length
          line.fontSize = Math.max(16, 24 - bottomArcLines.length * 1.5 - Math.min(5, line.text.length / 10));
          
          // Ensure alignment is centered for curved text
          line.alignment = 'center';
          
          // Add letter spacing for better curved text readability
          line.letterSpacing = 0.5;
        });
      }
      
      // Position center lines in the middle of the stamp
      if (centerLines.length > 0) {
        centerLines.forEach((line, index) => {
          // Calculate vertical position for center lines
          const totalLines = centerLines.length;
          const middleIndex = (totalLines - 1) / 2;
          const relativePosition = index - middleIndex;
          
          // Adjust spacing based on number of lines
          const spacing = totalLines > 2 ? 15 : 20; // Tighter spacing for more lines
          
          line.curved = false;
          line.yPosition = relativePosition * spacing;
          line.xPosition = 0; // center horizontally
          
          // Adjust font size based on line count and length
          line.fontSize = Math.max(14, 20 - centerLines.length * 1.2 - Math.min(5, line.text.length / 20));
          
          // Center alignment for better appearance
          line.alignment = 'center';
        });
      }
      
      // Combine all sets of lines in optimal order (top arc, center, bottom arc)
      const arrangedLines = [...topArcLines, ...centerLines, ...bottomArcLines];
      
      // Merge with empty lines
      const emptyLines = updatedLines.filter(line => !line.text.trim().length);
      const finalLines = [...arrangedLines, ...emptyLines];
      
      onArrange(finalLines);
    } else {
      // For rectangular or square stamps, use enhanced vertical distribution
      // Sort lines by content type for better arrangement
      const addressLines: StampTextLine[] = [];
      const titleLines: StampTextLine[] = [];
      const dateLines: StampTextLine[] = [];
      const otherLines: StampTextLine[] = [];
      
      // Categorize lines by likely content
      nonEmptyLines.forEach(line => {
        const text = line.text.toLowerCase();
        // Check for address patterns (has commas, numbers and streets)
        if (text.includes(',') && (
            text.match(/\d+/) || 
            text.includes('street') || 
            text.includes('ave') || 
            text.includes('road')
           )) {
          addressLines.push({...line});
        }
        // Check for title patterns (all caps, longer words)
        else if (line.text === line.text.toUpperCase() && line.text.length > 10) {
          titleLines.push({...line});
        }
        // Check for date patterns
        else if (text.match(/\d{1,2}[-\/\.]\d{1,2}[-\/\.]\d{2,4}/) || 
                text.includes('date') || 
                text.includes('approved')) {
          dateLines.push({...line});
        }
        else {
          otherLines.push({...line});
        }
      });
      
      // Arrange by content type - titles at top, then address, then other content, dates at bottom
      const arrangementOrder = [...titleLines, ...addressLines, ...otherLines, ...dateLines];
      
      // Distribute evenly
      arrangementOrder.forEach((line, index) => {
        // Calculate position for evenly distributed lines
        const totalHeight = 160; // arbitrary value for distribution calculation
        const totalLines = arrangementOrder.length;
        
        // Calculate spacing based on line count
        const spacing = totalHeight / (totalLines + 1);
        
        // Calculate position, accounting for balanced margins
        const yOffset = (index + 1) * spacing - totalHeight / 2;
        
        // Adjust position based on line type for better layout
        let adjustedYOffset = yOffset;
        if (titleLines.includes(line)) {
          // Move titles slightly higher
          adjustedYOffset = yOffset - 10;
        } else if (dateLines.includes(line)) {
          // Move dates slightly lower
          adjustedYOffset = yOffset + 10;
        }
        
        line.yPosition = adjustedYOffset;
        line.xPosition = 0; // center horizontally
        line.curved = false;
        
        // Adjust font size based on line count, line type and length
        if (titleLines.includes(line)) {
          // Titles slightly larger
          line.fontSize = Math.max(16, 22 - nonEmptyLines.length);
          line.bold = true;
        } else if (dateLines.includes(line)) {
          // Dates slightly smaller
          line.fontSize = Math.max(12, 16 - nonEmptyLines.length);
        } else {
          // Regular text
          line.fontSize = Math.max(14, 18 - nonEmptyLines.length);
        }
        
        // Adjust alignment based on content type
        if (addressLines.includes(line)) {
          // Center addresses
          line.alignment = 'center';
        } else if (dateLines.includes(line)) {
          // Right-align dates
          line.alignment = 'right';
        } else {
          // Center alignment for other text
          line.alignment = 'center';
        }
      });
      
      // Merge updated arranged lines with empty lines
      const emptyLines = updatedLines.filter(line => !line.text.trim().length);
      const finalLines = [...arrangementOrder, ...emptyLines];
      
      onArrange(finalLines);
    }
  };

  return (
    <div className="mb-4">
      <HelpTooltip content={t('design.autoArrangeTooltip', "Intelligently arrange text for optimal layout based on your stamp shape. Places curved text along the edges and centered text in the middle.")}>
        <Button 
          onClick={handleAutoArrange} 
          variant="outline" 
          className="w-full flex items-center justify-center"
        >
          <Wand className="mr-2" size={16} />
          {t('design.autoArrange', "Auto-Arrange")}
        </Button>
      </HelpTooltip>
    </div>
  );
};

export default AutoArrange;
