import { useState, useEffect, useRef } from 'react';
import { StampDesign, StampTextLine, Product, TextEffect, StampElement } from '../types';

interface DesignHistoryState {
  past: StampDesign[];
  present: StampDesign;
  future: StampDesign[];
}

// Main hook function
const useStampDesignerEnhanced = (product: Product | null) => {
  const defaultLine: StampTextLine = {
    text: '',
    fontSize: 16,
    fontFamily: 'Arial',
    bold: false,
    italic: false,
    alignment: 'center',
    curved: false,
    curvature: 'top', // New property for curved text position
    xPosition: 0,
    yPosition: 0,
    isDragging: false,
    letterSpacing: 0
  };

  const initializeLines = () => {
    if (!product) return [{ ...defaultLine }];
    
    // Create empty lines based on product capacity
    const lines: StampTextLine[] = [];
    for (let i = 0; i < (product?.lines || 1); i++) {
      lines.push({ ...defaultLine });
    }
    return lines;
  };

  const initialDesign: StampDesign = {
    lines: initializeLines(),
    inkColor: product?.inkColors[0] || 'blue',
    includeLogo: false,
    logoPosition: 'top',
    logoX: 0,
    logoY: 0,
    logoDragging: false,
    shape: product?.shape || 'rectangle',
    borderStyle: 'single',
    elements: [] // Add elements array for QR codes, barcodes, etc.
  };

  // Design history for undo/redo functionality
  const [history, setHistory] = useState<DesignHistoryState>({
    past: [],
    present: initialDesign,
    future: []
  });

  // Active design comes from history.present
  const design = history.present;

  // Extract methods from history management
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  // Store the SVG content as a string, not as an SVGSVGElement
  const svgRef = useRef<string | null>(null);

  // Update design when product changes
  useEffect(() => {
    if (product) {
      const updatedDesign = {
        ...design,
        lines: initializeLines(),
        inkColor: product?.inkColors[0] || design.inkColor,
        shape: product?.shape || 'rectangle'
      };
      
      // Update history with new design but don't track this as a user action
      setHistory({
        past: [],
        present: updatedDesign,
        future: []
      });
    }
  }, [product]);

  // Auto-generate preview whenever design changes
  useEffect(() => {
    if (product) {
      generatePreview();
    }
  }, [design, product]);

  // Helper function to update history when design changes
  const updateHistory = (updatedDesign: StampDesign) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: updatedDesign,
      future: []
    }));
  };

  // Undo functionality
  const undo = () => {
    if (!canUndo) return;
    
    setHistory(prev => {
      const newPresent = prev.past[prev.past.length - 1];
      return {
        past: prev.past.slice(0, -1),
        present: newPresent,
        future: [prev.present, ...prev.future]
      };
    });
  };

  // Redo functionality
  const redo = () => {
    if (!canRedo) return;
    
    setHistory(prev => {
      const newPresent = prev.future[0];
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: prev.future.slice(1)
      };
    });
  };

  // Update text line with history tracking
  const updateLine = (index: number, updates: Partial<StampTextLine>) => {
    const newLines = [...design.lines];
    newLines[index] = { ...newLines[index], ...updates };
    
    const updatedDesign = { ...design, lines: newLines };
    updateHistory(updatedDesign);
  };
  
  // Update multiple lines at once (for auto-arrange)
  const updateMultipleLines = (updatedLines: StampTextLine[]) => {
    // Validate that we aren't trying to add more lines than exist
    if (updatedLines.length > design.lines.length) {
      updatedLines = updatedLines.slice(0, design.lines.length);
    }
    
    // Create a new array with the same length as the original
    const newLines = [...design.lines];
    
    // Update only the lines that are provided
    updatedLines.forEach((line, index) => {
      if (index < newLines.length) {
        newLines[index] = { ...newLines[index], ...line };
      }
    });
    
    const updatedDesign = { ...design, lines: newLines };
    updateHistory(updatedDesign);
  };

  // Add line with history tracking
  const addLine = () => {
    if (design.lines.length < (product?.lines || 5)) {
      const updatedDesign = {
        ...design,
        lines: [...design.lines, { ...defaultLine }]
      };
      updateHistory(updatedDesign);
    }
  };

  // Remove line with history tracking
  const removeLine = (index: number) => {
    const newLines = design.lines.filter((_, i) => i !== index);
    const updatedDesign = { ...design, lines: newLines };
    updateHistory(updatedDesign);
  };

  // Set ink color with history tracking
  const setInkColor = (color: string) => {
    const updatedDesign = { ...design, inkColor: color };
    updateHistory(updatedDesign);
  };

  // Toggle logo inclusion with history tracking
  const toggleLogo = () => {
    const updatedDesign = { ...design, includeLogo: !design.includeLogo };
    updateHistory(updatedDesign);
  };

  // Set logo position with history tracking
  const setLogoPosition = (position: 'top' | 'bottom' | 'left' | 'right' | 'center') => {
    const updatedDesign = { ...design, logoPosition: position };
    updateHistory(updatedDesign);
  };

  // Set logo image with history tracking
  const setLogoImage = (imageUrl: string) => {
    const updatedDesign = { ...design, logoImage: imageUrl };
    updateHistory(updatedDesign);
  };

  // Set border style with history tracking
  const setBorderStyle = (style: 'single' | 'double' | 'triple' | 'none') => {
    const updatedDesign = { ...design, borderStyle: style };
    updateHistory(updatedDesign);
  };

  // Toggle curved text with orientation parameter
  const toggleCurvedText = (index: number, position: 'top' | 'bottom' = 'top') => {
    const newLines = [...design.lines];
    const currentLine = newLines[index];
    
    // Toggle curved state
    const isCurved = !currentLine.curved;
    
    // Update curvature position based on y-position and provided position parameter
    const curvature = position || (currentLine.yPosition > 0 ? 'bottom' : 'top');
    
    updateLine(index, { 
      curved: isCurved,
      curvature: isCurved ? curvature : 'top' // Only set curvature if curved is true
    });
  };

  // Update text position with history tracking
  const updateTextPosition = (index: number, x: number, y: number) => {
    // Constrain the movement within -100 to 100 range
    const constrainedX = Math.max(-100, Math.min(100, x));
    const constrainedY = Math.max(-100, Math.min(100, y));
    
    const newLines = [...design.lines];
    newLines[index] = { 
      ...newLines[index], 
      xPosition: constrainedX, 
      yPosition: constrainedY
    };
    
    const updatedDesign = { ...design, lines: newLines };
    setHistory(prev => ({
      ...prev,
      present: updatedDesign
    }));
  };

  // Start text drag
  const startTextDrag = (index: number) => {
    const newLines = [...design.lines];
    newLines.forEach((line, i) => {
      line.isDragging = i === index;
    });
    
    setHistory(prev => ({
      ...prev,
      present: {...design, lines: newLines, logoDragging: false}
    }));
  };

  // Start logo drag
  const startLogoDrag = () => {
    const newLines = [...design.lines];
    newLines.forEach(line => {
      line.isDragging = false;
    });
    
    setHistory(prev => ({
      ...prev,
      present: {...design, lines: newLines, logoDragging: true}
    }));
  };

  // Stop dragging
  const stopDragging = () => {
    const newLines = [...design.lines];
    newLines.forEach(line => {
      line.isDragging = false;
    });
    
    const updatedDesign = {...design, lines: newLines, logoDragging: false};
    updateHistory(updatedDesign);
  };

  // Handle drag event
  const handleDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, previewRect: DOMRect) => {
    // Get mouse/touch position relative to preview area
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const centerX = previewRect.left + previewRect.width / 2;
    const centerY = previewRect.top + previewRect.height / 2;
    
    // Calculate position as percentage from center (-100 to 100)
    const relativeX = ((clientX - centerX) / (previewRect.width / 2)) * 100;
    const relativeY = ((clientY - centerY) / (previewRect.height / 2)) * 100;
    
    // Update the position of the dragging element
    const draggingLineIndex = design.lines.findIndex(line => line.isDragging);
    
    if (draggingLineIndex !== -1) {
      // Update text position
      const newLines = [...design.lines];
      newLines[draggingLineIndex] = {
        ...newLines[draggingLineIndex],
        xPosition: relativeX,
        yPosition: relativeY
      };
      
      setHistory(prev => ({
        ...prev,
        present: {...design, lines: newLines}
      }));
    } else if (design.logoDragging && design.includeLogo) {
      // Update logo position
      setHistory(prev => ({
        ...prev,
        present: {
          ...design,
          logoX: relativeX,
          logoY: relativeY
        }
      }));
    }
  };

  // Update logo position with history tracking
  const updateLogoPosition = (x: number, y: number) => {
    // Constrain the movement within -100 to 100 range
    const constrainedX = Math.max(-100, Math.min(100, x));
    const constrainedY = Math.max(-100, Math.min(100, y));
    
    const updatedDesign = {
      ...design,
      logoX: constrainedX,
      logoY: constrainedY
    };
    
    setHistory(prev => ({
      ...prev,
      present: updatedDesign
    }));
  };

  // Save design to local storage
  const saveDesign = () => {
    if (!product) return;
    
    try {
      const designData = {
        designId: `stamp-${product.id}`,
        productId: product.id,
        design: design,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem('savedStampDesign', JSON.stringify(designData));
      return true;
    } catch (error) {
      console.error('Error saving design:', error);
      return false;
    }
  };

  // Check if there is a saved design
  const hasSavedDesign = () => {
    try {
      const savedData = localStorage.getItem('savedStampDesign');
      if (!savedData) return false;
      
      const { productId } = JSON.parse(savedData);
      return productId === product?.id;
    } catch (error) {
      console.error('Error checking for saved design:', error);
      return false;
    }
  };

  // Load saved design from local storage
  const loadDesign = () => {
    try {
      const savedData = localStorage.getItem('savedStampDesign');
      if (!savedData) return false;
      
      const { design: savedDesign, productId } = JSON.parse(savedData);
      
      if (productId === product?.id && savedDesign) {
        // Update history with saved design
        setHistory({
          past: [],
          present: savedDesign,
          future: []
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error loading saved design:', error);
      return false;
    }
  };

  // Clear saved design
  const clearSavedDesign = () => {
    try {
      localStorage.removeItem('savedStampDesign');
      return true;
    } catch (error) {
      console.error('Error clearing saved design:', error);
      return false;
    }
  };

  // Apply a template to the current design
  const applyTemplate = (template: Partial<StampDesign>) => {
    if (!template) return;
    
    const updatedDesign = {
      ...design,
      ...template,
      // Maintain product-specific properties
      shape: design.shape
    };
    
    updateHistory(updatedDesign);
  };

  // Add or update custom element (like QR code or barcode)
  const addElement = (element: { type: string, dataUrl: string, width: number, height: number }) => {
    // Parse dimensions from product size
    const sizeDimensions = product?.size ? product.size.split('x').map(dim => parseInt(dim.trim(), 10)) : [60, 40];
    
    // Define centerX and centerY based on viewBox dimensions
    const centerX = sizeDimensions[0] ? sizeDimensions[0] / 2 : 30;
    const centerY = sizeDimensions[1] ? sizeDimensions[1] / 2 : 20;
    
    const newElement = {
      ...element,
      id: `element-${Date.now()}`,
      x: 0,
      y: 0,
      isDragging: false
    };
    
    const updatedDesign = { 
      ...design, 
      elements: [...(design.elements || []), newElement] 
    };
    
    updateHistory(updatedDesign);
  };

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1));
  };

  // Validate design based on current step
  const validateDesign = (step: string): string[] => {
    const errors: string[] = [];
    
    if (step === 'text') {
      // Check if at least one line has text
      const hasText = design.lines.some(line => line.text.trim().length > 0);
      if (!hasText) {
        errors.push('Add at least one line of text to your stamp');
      }
      
      // Check for lines that are too long
      design.lines.forEach((line, index) => {
        if (line.text.length > 30) {
          errors.push(`Line ${index + 1} is too long. Keep it under 30 characters for better readability.`);
        }
      });
    }
    
    if (step === 'logo' && design.includeLogo && !design.logoImage) {
      errors.push('Please upload a logo image or disable the logo option');
    }
    
    if (step === 'preview') {
      // Final validation before adding to cart
      const hasText = design.lines.some(line => line.text.trim().length > 0);
      if (!hasText) {
        errors.push('Your stamp needs at least one line of text');
      }
      
      if (design.includeLogo && !design.logoImage) {
        errors.push('Logo option is enabled but no logo has been uploaded');
      }
    }
    
    return errors;
  };

  // Implement applyTextEffect function
  const applyTextEffect = (lineIndex: number, effect: {
    type: 'shadow' | 'outline' | 'bold' | 'italic' | 'none';
    color?: string;
    blur?: number;
    thickness?: number;
  }) => {
    const updatedLines = [...design.lines];
    if (updatedLines[lineIndex]) {
      updatedLines[lineIndex] = {
        ...updatedLines[lineIndex],
        textEffect: {
          type: effect.type === 'bold' || effect.type === 'italic' ? 'none' : effect.type,
          color: effect.color || '#000000',
          blur: effect.blur || 2,
          thickness: effect.thickness || 1
        },
        bold: effect.type === 'bold' ? true : updatedLines[lineIndex].bold,
        italic: effect.type === 'italic' ? true : updatedLines[lineIndex].italic
      };
      
      const updatedDesign = {
        ...design,
        lines: updatedLines
      };
      
      updateHistory(updatedDesign);
      generatePreview();
    }
  };

  // Generate preview image
  const generatePreview = (): string => {
    if (!product) {
      return '';
    }

    // Parse dimensions from product.size (format: "60x40")
    const sizeDimensions = product.size.split('x').map(dim => parseInt(dim.trim(), 10));
    let width = 300;
    let height = 200;
    
    // Fix for vertical stamps - swap width and height if height > width
    let viewWidth = sizeDimensions[0] || 60;
    let viewHeight = sizeDimensions[1] || 40;
    
    // If height is greater than width, it's a vertical stamp
    const isVertical = viewHeight > viewWidth;
    if (isVertical) {
      // Swap the dimensions for proper rendering
      [viewWidth, viewHeight] = [viewHeight, viewWidth];
    }
    
    // Set aspect ratio based on product dimensions
    if (sizeDimensions.length === 2) {
      // Calculate SVG dimensions to maintain aspect ratio but fit within a reasonable size
      if (design.shape === 'circle') {
        // For circular stamps, use the smaller dimension
        const size = Math.min(viewWidth, viewHeight);
        width = height = size * 5; // Scale for better visibility
      } else {
        // For rectangular stamps, maintain aspect ratio
        const aspectRatio = viewWidth / viewHeight;
        // Base width on 300px, height calculated to maintain aspect ratio
        width = 300;
        height = width / aspectRatio;
      }
    } else if (design.shape === 'circle') {
      // Default for circle if no dimensions are available
      width = height = 300;
    }
    
    // Start building the SVG
    let svgContent = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- No filters needed since we removed shadows -->
        </defs>
        <rect width="100%" height="100%" fill="white"/>
    `;
    
    // Add appropriate shape
    if (design.shape === 'circle') {
      // For circular stamps
      const centerX = viewWidth / 2;
      const centerY = viewHeight / 2;
      const radius = Math.min(viewWidth, viewHeight) / 2 - 1; // Slightly smaller for border
      
      // Add concentric border circles with proper spacing
      if (design.borderStyle === 'single') {
        svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        svgContent += `
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
          <circle cx="${centerX}" cy="${centerY}" r="${radius - 1.5}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
        `;
      } else if (design.borderStyle === 'triple') {
        svgContent += `
          <circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
          <circle cx="${centerX}" cy="${centerY}" r="${radius - 1.5}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
          <circle cx="${centerX}" cy="${centerY}" r="${radius - 3}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
        `;
      }
      
      // Add logo if included - position it properly for circular stamps
      if (design.includeLogo) {
        const logoSize = radius / 3;
        // Use custom logo position if available
        const logoX = centerX + (design.logoX || 0) / 100 * (radius - logoSize);
        const logoY = centerY + (design.logoY || 0) / 100 * (radius - logoSize);
        
        if (design.logoImage) {
          svgContent += `
            <image href="${design.logoImage}" x="${logoX - logoSize}" y="${logoY - logoSize}" 
                   width="${logoSize * 2}" height="${logoSize * 2}" 
                   preserveAspectRatio="xMidYMid meet" />
          `;
        }
      }
      
      // Improved handling of text lines for circular stamps with proper text orientation
      design.lines.forEach((line, index) => {
        if (!line.text.trim()) return; // Skip empty lines
        
        // Calculate font size scaled to viewBox
        const scaledFontSize = (line.fontSize / 20) * (radius / 10);
        
        // Enhanced curved text implementation with proper orientation
        if (line.curved) {
          // Generate unique ID for each text path
          const pathId = `textPath${Math.random().toString(36).substr(2, 9)}`;
          
          // Calculate proper radius for text path based on line position in the stamp
          // This creates concentric text rings with proper spacing
          let textPathRadius = radius;
          if (index === 0) { 
            // Outer ring - close to the border
            textPathRadius = radius - scaledFontSize / 2;
          } else if (index === design.lines.length - 1 && design.lines.length > 2) {
            // Inner ring (if there are more than 2 lines)
            textPathRadius = radius * 0.65;
          } else {
            // Middle rings with proper spacing
            textPathRadius = radius - (index * (radius / (design.lines.length + 1)));
          }
          
          // Determine if text should be on top or bottom half
          // Check for explicit curvature setting first, then fall back to y position
          const isBottomHalf = line.curvature === 'bottom' || (line.curvature !== 'top' && line.yPosition > 0);
          
          // Create precise circular path for text, with proper direction for top/bottom
          if (isBottomHalf) {
            // For bottom text - properly oriented for readability
            svgContent += `
              <defs>
                <path id="${pathId}" d="M ${centerX - textPathRadius}, ${centerY} 
                  a ${textPathRadius},${textPathRadius} 0 1,0 ${textPathRadius * 2},0 
                  a ${textPathRadius},${textPathRadius} 0 1,0 -${textPathRadius * 2},0" />
              </defs>
            `;
          } else {
            // For top text - normal direction
            svgContent += `
              <defs>
                <path id="${pathId}" d="M ${centerX - textPathRadius}, ${centerY} 
                  a ${textPathRadius},${textPathRadius} 0 1,1 ${textPathRadius * 2},0 
                  a ${textPathRadius},${textPathRadius} 0 1,1 -${textPathRadius * 2},0" />
              </defs>
            `;
          }
          
          // Calculate proper text offset based on the circumference of the circle
          // This ensures even text distribution around the circle
          const textStartOffset = `${50 + (line.xPosition || 0) / 2}%`;
          
          // Add letter-spacing for curved text to prevent distortion
          const letterSpacing = line.letterSpacing ? `${line.letterSpacing}px` : '0.5px';
          
          svgContent += `
            <text font-family="${line.fontFamily}" font-size="${scaledFontSize}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''} 
                  fill="${design.inkColor}"
                  letter-spacing="${letterSpacing}" text-anchor="middle">
              <textPath href="#${pathId}" startOffset="${textStartOffset}" ${isBottomHalf ? 'side="right"' : ''}>
                ${line.text}
              </textPath>
            </text>
          `;
        } else {
          // Non-curved text for center content
          // Apply position adjustments for proper center alignment
          const xOffset = (line.xPosition || 0) / 100 * (radius / 2);
          const yOffset = (line.yPosition || 0) / 100 * (radius / 2);
          
          // For center content, ensure proper vertical distribution
          // Calculate vertical offset based on number of center lines
          const centerLines = design.lines.filter(l => !l.curved).length;
          const lineIndex = design.lines.filter((l, i) => !l.curved && i < index).length;
          
          // Calculate vertical spacing
          let verticalPosition = centerY;
          if (centerLines > 1) {
            // Distribute lines evenly in the center area
            const totalHeight = centerLines * scaledFontSize * 1.2; // Account for line height
            const startY = centerY - totalHeight / 2 + scaledFontSize / 2;
            verticalPosition = startY + lineIndex * scaledFontSize * 1.2;
          }
          
          const textX = centerX + xOffset;
          const textY = verticalPosition + yOffset;
          
          // Set text-anchor based on alignment for proper text positioning
          let textAnchor;
          if (line.alignment === 'left') textAnchor = 'start';
          else if (line.alignment === 'right') textAnchor = 'end';
          else textAnchor = 'middle';
          
          // Add letter-spacing if specified
          const letterSpacing = line.letterSpacing ? `letter-spacing="${line.letterSpacing}px"` : '';
          
          svgContent += `
            <text x="${textX}" y="${textY}" 
                  font-family="${line.fontFamily}" 
                  font-size="${scaledFontSize}" 
                  text-anchor="${textAnchor}" 
                  fill="${design.inkColor}"
                  ${line.bold ? 'font-weight="bold"' : ''} 
                  ${line.italic ? 'font-style="italic"' : ''} 
                  ${letterSpacing}>
              ${line.text}
            </text>
          `;
        }
      });
    } else {
      // For rectangular stamps
      const cornerRadius = viewWidth * 0.05; // 5% of width as corner radius
      
      // Add border(s)
      if (design.borderStyle === 'single') {
        svgContent += `<rect x="0.5" y="0.5" width="${viewWidth - 1}" height="${viewHeight - 1}" rx="${cornerRadius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>`;
      } else if (design.borderStyle === 'double') {
        svgContent += `
          <rect x="0.5" y="0.5" width="${viewWidth - 1}" height="${viewHeight - 1}" rx="${cornerRadius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
          <rect x="2" y="2" width="${viewWidth - 4}" height="${viewHeight - 4}" rx="${cornerRadius - 0.5}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
        `;
      } else if (design.borderStyle === 'triple') {
        svgContent += `
          <rect x="0.5" y="0.5" width="${viewWidth - 1}" height="${viewHeight - 1}" rx="${cornerRadius}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
          <rect x="2" y="2" width="${viewWidth - 4}" height="${viewHeight - 4}" rx="${cornerRadius - 0.5}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
          <rect x="3.5" y="3.5" width="${viewWidth - 7}" height="${viewHeight - 7}" rx="${cornerRadius - 1}" stroke="${design.inkColor}" stroke-width="0.5" fill="none"/>
        `;
      }
      
      // Add logo if included
      const logoWidth = viewWidth * 0.2;
      const logoHeight = viewHeight * 0.2;
      
      // Center coordinates
      const centerX = viewWidth / 2;
      const centerY = viewHeight / 2;
      
      // Use custom position if available, otherwise use preset positions
      let logoX, logoY;
      
      if (design.logoX !== undefined && design.logoY !== undefined) {
        // Convert from -100,100 range to viewBox coordinates
        logoX = centerX + (design.logoX / 100) * (viewWidth/2 - logoWidth/2);
        logoY = centerY + (design.logoY / 100) * (viewHeight/2 - logoHeight/2);
      } else {
        // Fallback to preset positions
        logoX = centerX - logoWidth / 2;
        logoY = centerY - logoHeight / 2;
        
        switch (design.logoPosition) {
          case 'top':
            logoY = viewHeight * 0.1;
            break;
          case 'bottom':
            logoY = viewHeight - logoHeight - viewHeight * 0.1;
            break;
          case 'left':
            logoX = viewWidth * 0.1;
            logoY = centerY - logoHeight / 2;
            break;
          case 'right':
            logoX = viewWidth - logoWidth - viewWidth * 0.1;
            logoY = centerY - logoHeight / 2;
            break;
        }
      }
      
      if (design.includeLogo) {
        svgContent += `
          ${design.logoImage ? 
            `<image href="${design.logoImage}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet" />` : 
            `<rect x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" fill="#ddd"/>`}
        `;
      }
      
      // Add text without shadow or outline effects
      design.lines.forEach((line) => {
        if (!line.text.trim()) return; // Skip empty lines
        
        // Calculate font size scaled to viewBox
        const scaledFontSize = (line.fontSize / 20) * (viewHeight / 10);
        
        // Apply position adjustments
        const xOffset = (line.xPosition || 0) / 100 * (viewWidth / 3);
        const yOffset = (line.yPosition || 0) / 100 * (viewHeight / 3);
        
        // Base position plus offset
        const textX = centerX + xOffset;
        const textY = centerY + yOffset;
        
        // Add letter-spacing if specified
        const letterSpacing = line.letterSpacing ? `letter-spacing="${line.letterSpacing}px"` : '';
        
        // Set text-anchor based on alignment
        let textAnchor;
        if (line.alignment === 'left') textAnchor = 'start';
        else if (line.alignment === 'right') textAnchor = 'end';
        else textAnchor = 'middle';
        
        svgContent += `
          <text x="${textX}" y="${textY}" font-family="${line.fontFamily}" font-size="${scaledFontSize}" 
                text-anchor="${textAnchor}" fill="${design.inkColor}"
                ${line.bold ? 'font-weight="bold"' : ''} ${line.italic ? 'font-style="italic"' : ''} 
                ${letterSpacing}>
            ${line.text}
          </text>
        `;
      });
    }
    
    // Add custom elements (QR codes, barcodes, etc.)
    if (design.elements && design.elements.length > 0) {
      // Calculate center coordinates for element positioning
      const centerX = viewWidth / 2;
      const centerY = viewHeight / 2;
      
      design.elements.forEach((element) => {
        const elementX = centerX + (element.x / 100) * (viewWidth/2 - element.width/2);
        const elementY = centerY + (element.y / 100) * (viewHeight/2 - element.height/2);
        
        svgContent += `
          <image href="${element.dataUrl}" x="${elementX}" y="${elementY}" 
                width="${element.width}" height="${element.height}" 
                preserveAspectRatio="xMidYMid meet" />
        `;
      });
    }
    
    // Close the SVG
    svgContent += `</svg>`;
    
    const previewUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    // Store the SVG content as a string
    svgRef.current = svgContent;
    setPreviewImage(previewUrl);
    return previewUrl;
  };

  // Download preview as PNG
  const downloadAsPng = () => {
    if (!svgRef.current || !product) return;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions (scale up for better quality)
    canvas.width = 1000;
    canvas.height = 800;
    
    // Create an image from the SVG
    const img = new Image();
    // Create a blob from the SVG string, not from the SVGSVGElement
    const svgBlob = new Blob([svgRef.current], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Draw image to canvas (white background)
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${product.name}-stamp.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  return {
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
  };
};

export default useStampDesignerEnhanced;
