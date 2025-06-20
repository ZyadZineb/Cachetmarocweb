import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';
import { Product, StampDesign, StampTextLine } from '@/types';

export interface UseStampDesignerReturn {
  design: StampDesign;
  updateLine: (index: number, updates: Partial<StampTextLine>) => void;
  addLine: () => void;
  removeLine: (index: number) => void;
  setInkColor: (color: string) => void;
  toggleLogo: () => void;
  setLogoPosition: (position: 'top' | 'bottom' | 'left' | 'right' | 'center') => void;
  updateLogoPosition: (x: number, y: number) => void;
  setBorderStyle: (style: 'single' | 'double' | 'triple' | 'none') => void;
  toggleCurvedText: (index: number, position?: 'top' | 'bottom') => void; 
  updateTextPosition: (index: number, x: number, y: number) => void;
  startTextDrag: (index: number) => void;
  startLogoDrag: () => void;
  stopDragging: () => void;
  handleDrag: (e: any, rect: DOMRect) => void;
  previewImage: string | null;
  previewError: string | null;
  downloadAsPng: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomLevel: number;
  applyTemplate: (template: Partial<StampDesign>) => void;
  updateMultipleLines: (updatedLines: StampTextLine[]) => void;
  distributeTextLines: () => void;
  enforceTextBoundaries: () => void;
  detectTextCollisions: () => boolean;
  generatePreview?: () => void;
  forceUpdatePreview: () => void;
  validateDesign: (step: string) => string[];
  saveDesign: () => void;
  loadDesign: () => void;
  hasSavedDesign: () => boolean;
  clearSavedDesign: () => void;
  svgRef: MutableRefObject<string | null>;
}

// Default stamp text line with positioning
const defaultLine: StampTextLine = {
  text: '',
  fontSize: 16,
  fontFamily: 'Arial',
  bold: false,
  italic: false,
  alignment: 'center',
  curved: false,
  curvature: 'top',
  letterSpacing: 0,
  xPosition: 0,
  yPosition: 0
};

export const useStampDesigner = (product: Product | null): UseStampDesignerReturn => {
  // Initialize design state
  const [design, setDesign] = useState<StampDesign>({
    lines: [],
    inkColor: 'blue',
    includeLogo: false,
    logoPosition: 'center',
    logoImage: null,
    logoX: 0,
    logoY: 0,
    shape: 'rectangle',
    borderStyle: 'single',
    logoDragging: false,
    elements: []
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ 
    isDragging: boolean; 
    type: 'text' | 'logo' | null;
    lineIndex: number | null;
  }>({
    isDragging: false,
    type: null,
    lineIndex: null
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const svgRef = useRef<string | null>(null);

  // Initialize design when product changes
  useEffect(() => {
    if (product) {
      const initialLines = [];
      
      // Create initial lines based on product
      for (let i = 0; i < Math.min(2, product.lines); i++) {
        initialLines.push({
          ...defaultLine,
          yPosition: i === 0 ? -30 : 30,
          xPosition: 0
        });
      }

      setDesign(prevDesign => ({
        ...prevDesign,
        lines: initialLines,
        shape: product.shape || 'rectangle',
        inkColor: product.inkColors?.[0] || 'blue'
      }));
    }
  }, [product]);

  // Helper function to calculate safe positions
  const calculateSafePosition = (lineIndex: number, totalLines: number): number => {
    if (totalLines === 1) return 0;
    if (totalLines === 2) return lineIndex === 0 ? -25 : 25;
    if (totalLines === 3) return [-30, 0, 30][lineIndex];
    if (totalLines === 4) return [-35, -15, 15, 35][lineIndex];
    
    // For 5+ lines, distribute evenly
    const spacing = 70 / (totalLines - 1);
    return -35 + (lineIndex * spacing);
  };

  // Helper function to redistribute lines
  const redistributeLines = (lines: StampTextLine[]): StampTextLine[] => {
    return lines.map((line, index) => ({
      ...line,
      yPosition: calculateSafePosition(index, lines.length)
    }));
  };

  // Add a new text line with proper spacing
  const addLine = useCallback(() => {
    if (!product) {
      console.error('No product selected');
      return;
    }

    if (design.lines.length >= product.lines) {
      console.log(`Maximum lines reached: ${product.lines}`);
      return;
    }

    // Create new line
    const newLine: StampTextLine = {
      ...defaultLine,
      yPosition: 0,
      xPosition: 0
    };

    // Update state with the new line
    setDesign(currentDesign => {
      const newLines = [...currentDesign.lines, newLine];
      console.log('Adding line, new count:', newLines.length);
      
      // Redistribute all lines to prevent overlap
      const redistributedLines = redistributeLines(newLines);
      
      return {
        ...currentDesign,
        lines: redistributedLines
      };
    });
  }, [design.lines.length, product]);

  // Update a text line with new properties
  const updateLine = useCallback((index: number, properties: Partial<StampTextLine>) => {
    setDesign(currentDesign => {
      if (index < 0 || index >= currentDesign.lines.length) {
        console.error('Invalid line index:', index);
        return currentDesign;
      }

      const newLines = [...currentDesign.lines];
      newLines[index] = { ...newLines[index], ...properties };

      return {
        ...currentDesign,
        lines: newLines
      };
    });
  }, []);

  // Remove a text line and redistribute remaining lines
  const removeLine = useCallback((index: number) => {
    setDesign(currentDesign => {
      if (currentDesign.lines.length <= 1) {
        console.log('Cannot remove last line');
        return currentDesign;
      }

      const newLines = currentDesign.lines.filter((_, i) => i !== index);
      
      // Redistribute remaining lines
      const redistributedLines = redistributeLines(newLines);
      
      return {
        ...currentDesign,
        lines: redistributedLines
      };
    });
  }, []);

  // Update multiple lines at once
  const updateMultipleLines = useCallback((updatedLines: StampTextLine[]) => {
    setDesign(currentDesign => ({
      ...currentDesign,
      lines: updatedLines
    }));
  }, []);

  // Set ink color
  const setInkColor = useCallback((color: string) => {
    setDesign(prev => ({ ...prev, inkColor: color }));
  }, []);

  // Toggle logo inclusion
  const toggleLogo = useCallback(() => {
    setDesign(prev => ({ ...prev, includeLogo: !prev.includeLogo }));
  }, []);

  // Set logo position
  const setLogoPosition = useCallback((position: 'top' | 'bottom' | 'left' | 'right' | 'center') => {
    setDesign(prev => ({ ...prev, logoPosition: position }));
  }, []);

  // Set border style
  const setBorderStyle = useCallback((style: 'single' | 'double' | 'triple' | 'none') => {
    setDesign(prev => ({ ...prev, borderStyle: style }));
  }, []);

  // Toggle curved text for a line
  const toggleCurvedText = useCallback((index: number, position: 'top' | 'bottom' = 'top') => {
    setDesign(currentDesign => {
      if (index < 0 || index >= currentDesign.lines.length) {
        return currentDesign;
      }
      
      const currentLine = currentDesign.lines[index];
      const newLines = [...currentDesign.lines];
      
      // If not curved, make curved with specified position
      // If already curved, toggle between positions or turn off
      if (!currentLine.curved) {
        newLines[index] = { 
          ...currentLine, 
          curved: true, 
          curvature: position 
        };
      } else if (currentLine.curvature !== position) {
        newLines[index] = { 
          ...currentLine, 
          curvature: position 
        };
      } else {
        newLines[index] = { 
          ...currentLine, 
          curved: false 
        };
      }
      
      return {
        ...currentDesign,
        lines: newLines
      };
    });
  }, []);

  // Update text position for a line
  const updateTextPosition = useCallback((index: number, x: number, y: number) => {
    setDesign(currentDesign => {
      if (index < 0 || index >= currentDesign.lines.length) {
        return currentDesign;
      }
      
      const newLines = [...currentDesign.lines];
      newLines[index] = { 
        ...newLines[index], 
        xPosition: x, 
        yPosition: y 
      };
      
      return {
        ...currentDesign,
        lines: newLines
      };
    });
  }, []);

  // Update logo position
  const updateLogoPosition = useCallback((x: number, y: number) => {
    setDesign(prev => ({ ...prev, logoX: x, logoY: y }));
  }, []);

  // Start dragging a text line
  const startTextDrag = useCallback((index: number) => {
    setDragState({
      isDragging: true,
      type: 'text',
      lineIndex: index
    });
  }, []);

  // Start dragging the logo
  const startLogoDrag = useCallback(() => {
    setDragState({
      isDragging: true,
      type: 'logo',
      lineIndex: null
    });
  }, []);

  // Stop dragging
  const stopDragging = useCallback(() => {
    setDragState({
      isDragging: false,
      type: null,
      lineIndex: null
    });
  }, []);

  // Handle drag movement
  const handleDrag = useCallback((e: any, rect: DOMRect) => {
    if (!dragState.isDragging) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    
    if (!clientX && !clientY) return;
    
    const relativeX = ((clientX - rect.left) / rect.width * 2 - 1) * 100;
    const relativeY = ((clientY - rect.top) / rect.height * 2 - 1) * 100;
    
    if (dragState.type === 'text' && dragState.lineIndex !== null) {
      updateTextPosition(dragState.lineIndex, relativeX, relativeY);
    } else if (dragState.type === 'logo') {
      updateLogoPosition(relativeX, relativeY);
    }
  }, [dragState, updateLogoPosition, updateTextPosition]);

  // Apply a template
  const applyTemplate = useCallback((template: Partial<StampDesign>) => {
    setDesign(current => ({
      ...current,
      ...template
    }));
  }, []);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  }, []);
  
  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  }, []);

  // Distribute text lines evenly
  const distributeTextLines = useCallback(() => {
    if (!design.shape) return;
    
    const adjustedLines = redistributeLines(design.lines);
    updateMultipleLines(adjustedLines);
  }, [design.lines, design.shape, updateMultipleLines]);

  // Enforce text boundaries
  const enforceTextBoundaries = useCallback(() => {
    if (!design.lines) return;
    
    // Constrain each line's position within boundaries
    const adjustedLines = design.lines.map(line => {
      const x = Math.max(-100, Math.min(100, line.xPosition || 0));
      const y = Math.max(-100, Math.min(100, line.yPosition || 0));
      return { ...line, xPosition: x, yPosition: y };
    });
    
    updateMultipleLines(adjustedLines);
  }, [design.lines, updateMultipleLines]);

  // Detect text collisions
  const detectTextCollisions = useCallback((): boolean => {
    if (!design.lines) return false;
    
    // Simple collision detection (can be improved)
    for (let i = 0; i < design.lines.length; i++) {
      for (let j = i + 1; j < design.lines.length; j++) {
        const line1 = design.lines[i];
        const line2 = design.lines[j];
        
        // Skip empty lines
        if (!line1.text || !line2.text) continue;
        
        // Calculate distance between lines
        const dx = (line1.xPosition || 0) - (line2.xPosition || 0);
        const dy = (line1.yPosition || 0) - (line2.yPosition || 0);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Consider collision if lines are too close
        // The threshold can be adjusted based on font size
        if (distance < 20) return true;
      }
    }
    
    return false;
  }, [design.lines]);

  // Helper function for curved text rendering
  const renderCurvedText = useCallback((ctx: CanvasRenderingContext2D, line: StampTextLine, centerX: number, centerY: number, radius: number) => {
    const text = line.text;
    if (!text) return;
    
    const isBottomText = (line.yPosition || 0) > 0;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    if (isBottomText) {
      ctx.rotate(Math.PI);
    }
    
    const textLength = text.length;
    const arcLength = Math.PI * 1.2;
    const charAngle = textLength > 0 ? arcLength / textLength : 0;
    
    let currentAngle = -arcLength / 2;
    
    for (let i = 0; i < textLength; i++) {
      ctx.save();
      ctx.rotate(currentAngle);
      ctx.translate(0, -radius);
      
      if (isBottomText) {
        ctx.rotate(Math.PI);
      }
      
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
      
      currentAngle += charAngle;
    }
    
    ctx.restore();
  }, []);

  // Generate preview using Canvas API
  const generatePreview = useCallback(() => {
    if (!product) {
      console.log('No product available for preview');
      return null;
    }

    try {
      console.log('Generating preview for:', product.name, 'with design:', design);
      
      // Create canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get canvas context');
        return null;
      }
      
      // Set canvas size
      canvas.width = 400;
      canvas.height = 400;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Clear canvas with white background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set up drawing properties
      ctx.strokeStyle = design.inkColor || 'blue';
      ctx.fillStyle = design.inkColor || 'blue';
      ctx.lineWidth = 2;
      
      // Draw stamp border based on shape
      if (product.shape === 'rectangle') {
        const width = canvas.width * 0.8;
        const height = canvas.height * 0.6;
        
        // Draw border
        if (design.borderStyle === 'single') {
          ctx.strokeRect(centerX - width/2, centerY - height/2, width, height);
        } else if (design.borderStyle === 'double') {
          ctx.strokeRect(centerX - width/2, centerY - height/2, width, height);
          ctx.strokeRect(centerX - width/2 + 5, centerY - height/2 + 5, width - 10, height - 10);
        } else if (design.borderStyle === 'triple') {
          ctx.strokeRect(centerX - width/2, centerY - height/2, width, height);
          ctx.strokeRect(centerX - width/2 + 5, centerY - height/2 + 5, width - 10, height - 10);
          ctx.strokeRect(centerX - width/2 + 10, centerY - height/2 + 10, width - 20, height - 20);
        }
        
        // Draw safe zone indicator
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(centerX - width/2 + 8, centerY - height/2 + 8, width - 16, height - 16);
        ctx.setLineDash([]);
        ctx.strokeStyle = design.inkColor || 'blue';
        
      } else if (product.shape === 'circle') {
        const radius = Math.min(canvas.width, canvas.height) * 0.35;
        
        // Draw border
        if (design.borderStyle === 'single') {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (design.borderStyle === 'double') {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2);
          ctx.stroke();
        } else if (design.borderStyle === 'triple') {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius - 16, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Draw safe zone
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = design.inkColor || 'blue';
        
      } else if (product.shape === 'square') {
        const size = canvas.width * 0.7;
        
        // Draw border
        if (design.borderStyle === 'single') {
          ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
        } else if (design.borderStyle === 'double') {
          ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
          ctx.strokeRect(centerX - size/2 + 5, centerY - size/2 + 5, size - 10, size - 10);
        } else if (design.borderStyle === 'triple') {
          ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
          ctx.strokeRect(centerX - size/2 + 5, centerY - size/2 + 5, size - 10, size - 10);
          ctx.strokeRect(centerX - size/2 + 10, centerY - size/2 + 10, size - 20, size - 20);
        }
        
        // Draw safe zone
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(centerX - size/2 + 8, centerY - size/2 + 8, size - 16, size - 16);
        ctx.setLineDash([]);
        ctx.strokeStyle = design.inkColor || 'blue';
      }
      
      // Draw logo if included
      if (design.includeLogo && design.logoImage) {
        const logoWidth = canvas.width * 0.2;
        const logoHeight = canvas.height * 0.2;
        
        // Calculate logo position
        const logoX = centerX + (design.logoX / 100) * (canvas.width/2 - logoWidth/2);
        const logoY = centerY + (design.logoY / 100) * (canvas.height/2 - logoHeight/2);
        
        // Create image element and draw it when loaded
        const img = new Image();
        img.src = design.logoImage;
        
        // We can't use the async/await pattern here, so we'll update the canvas
        // when the image loads (which is not ideal for the preview function)
        img.onload = () => {
          if (ctx) {
            ctx.drawImage(img, logoX - logoWidth/2, logoY - logoHeight/2, logoWidth, logoHeight);
            
            // Update the preview with the logo
            const updatedDataUrl = canvas.toDataURL('image/png');
            setPreviewImage(updatedDataUrl);
          }
        };
      }
      
      // Draw text lines
      ctx.fillStyle = design.inkColor || 'blue';
      
      if (design.lines && design.lines.length > 0) {
        design.lines.forEach((line, index) => {
          if (!line.text || line.text.trim() === '') return;
          
          console.log(`Drawing line ${index}:`, line);
          
          // Set font properties
          const fontSize = line.fontSize || 12;
          const fontFamily = line.fontFamily || 'Arial';
          const fontWeight = line.bold ? 'bold' : 'normal';
          const fontStyle = line.italic ? 'italic' : 'normal';
          
          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.textAlign = line.alignment || 'center';
          ctx.textBaseline = 'middle';
          
          if (line.curved && product.shape === 'circle') {
            // Render curved text for circular stamps
            renderCurvedText(ctx, line, centerX, centerY, canvas.width * 0.3);
          } else {
            // Render normal text
            const x = centerX + ((line.xPosition || 0) * 1.5);
            const y = centerY + ((line.yPosition || 0) * 1.5);
            
            console.log(`Drawing text "${line.text}" at position (${x}, ${y})`);
            ctx.fillText(line.text, x, y);
          }
        });
      }
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      console.log('Preview generated successfully');
      return dataUrl;
      
    } catch (error) {
      console.error('Error generating preview:', error);
      return null;
    }
  }, [design, product, renderCurvedText]);

  // Safe preview generation with error handling
  const generatePreviewSafe = useCallback(() => {
    try {
      setPreviewError(null);
      const preview = generatePreview();
      
      if (!preview) {
        setPreviewError('Failed to generate preview');
        return null;
      }
      
      return preview;
    } catch (error: any) {
      console.error('Preview generation error:', error);
      setPreviewError(error.message);
      return null;
    }
  }, [generatePreview]);

  // Force preview update function for debugging
  const forceUpdatePreview = useCallback(() => {
    console.log('Forcing preview update...');
    const preview = generatePreviewSafe();
    setPreviewImage(preview);
  }, [generatePreviewSafe]);

  // Update preview whenever design changes
  useEffect(() => {
    console.log('Design changed, updating preview...');
    const preview = generatePreviewSafe();
    setPreviewImage(preview);
  }, [design, generatePreviewSafe]);

  // Validate design
  const validateDesign = useCallback((step: string): string[] => {
    const errors: string[] = [];
    
    if (step === 'text') {
      if (design.lines.every(line => !line.text || line.text.trim() === '')) {
        errors.push('At least one line must have text');
      }
    }
    
    return errors;
  }, [design.lines]);

  // Storage functions
  const saveDesign = useCallback(() => {
    if (!product) return;
    try {
      localStorage.setItem(`stamp-design-${product.id}`, JSON.stringify(design));
    } catch (error) {
      console.error('Error saving design:', error);
    }
  }, [design, product]);

  const loadDesign = useCallback(() => {
    if (!product) return;
    try {
      const saved = localStorage.getItem(`stamp-design-${product.id}`);
      if (saved) {
        const parsedDesign = JSON.parse(saved) as StampDesign;
        setDesign(parsedDesign);
      }
    } catch (error) {
      console.error('Error loading design:', error);
    }
  }, [product]);

  const hasSavedDesign = useCallback((): boolean => {
    if (!product) return false;
    const saved = localStorage.getItem(`stamp-design-${product.id}`);
    return !!saved;
  }, [product]);

  const clearSavedDesign = useCallback(() => {
    if (!product) return;
    localStorage.removeItem(`stamp-design-${product.id}`);
  }, [product]);

  // Download as PNG
  const downloadAsPng = useCallback(() => {
    if (!previewImage) return;
    
    const link = document.createElement('a');
    link.download = 'stamp-design.png';
    link.href = previewImage;
    link.click();
  }, [previewImage]);

  return {
    design,
    updateLine,
    addLine,
    removeLine,
    setInkColor,
    toggleLogo,
    setLogoPosition,
    updateLogoPosition,
    setBorderStyle,
    toggleCurvedText,
    updateTextPosition,
    startTextDrag,
    startLogoDrag,
    stopDragging,
    handleDrag,
    previewImage,
    previewError,
    downloadAsPng,
    zoomIn,
    zoomOut,
    zoomLevel,
    applyTemplate,
    updateMultipleLines,
    distributeTextLines,
    enforceTextBoundaries,
    detectTextCollisions,
    generatePreview,
    forceUpdatePreview,
    validateDesign,
    saveDesign,
    loadDesign,
    hasSavedDesign,
    clearSavedDesign,
    svgRef
  };
};
