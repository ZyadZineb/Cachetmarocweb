
import React from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Plus, 
  Minus, 
  Trash2,
  TextQuote,
  MoveHorizontal,
  MoveVertical,
  RotateCw,
  CornerDownRight
} from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StampTextLine } from '@/types';
import { TextPositioningService } from '@/utils/TextPositioningService';

// Available fonts that can be used for the text
const availableFonts = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Tahoma', label: 'Tahoma' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Palatino', label: 'Palatino' },
  { value: 'Garamond', label: 'Garamond' },
  { value: 'Bookman', label: 'Bookman' },
  { value: 'Avant Garde', label: 'Avant Garde' },
];

interface TextLinesEditorProps {
  lines: StampTextLine[];
  maxLines: number;
  shape: 'rectangle' | 'circle' | 'square';
  activeLineIndex: number | null;
  setActiveLineIndex: (index: number | null) => void;
  updateLine: (index: number, updates: Partial<StampTextLine>) => void;
  addLine: () => void;
  removeLine: (index: number) => void;
  toggleCurvedText: (index: number) => void;
  updateTextPosition: (index: number, x: number, y: number) => void;
  largeControls?: boolean;
  distributeTextLines?: () => void;
}

const TextLinesEditor: React.FC<TextLinesEditorProps> = ({
  lines,
  maxLines,
  shape,
  activeLineIndex,
  setActiveLineIndex,
  updateLine,
  addLine,
  removeLine,
  toggleCurvedText,
  updateTextPosition,
  largeControls = false,
  distributeTextLines
}) => {
  const resetLineToDefault = (index: number) => {
    const defaultPosition = TextPositioningService.getDefaultLinePosition(index, lines.length, shape);
    updateLine(index, {
      xPosition: defaultPosition.xPosition,
      yPosition: defaultPosition.yPosition,
      curved: defaultPosition.curved,
      curvature: defaultPosition.curvature,
      fontSize: defaultPosition.fontSize,
      bold: defaultPosition.bold
    });
  };
  
  // Format coordinate as mm from center
  const formatPositionLabel = (value: number) => {
    // In our coordinate system, 100 units = half the width/height
    // So 200 units = full stamp size
    // If 1mm = 2% of stamp size (as per TextPositioningService.MARGIN_PERCENT),
    // then 1mm = 4 coordinate units (2% of 200)
    const mmValue = value / 4;
    return `${mmValue.toFixed(1)}mm`;
  };
  
  // Toggle curved text with curvature option
  const handleToggleCurvedText = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    const line = lines[index];
    // If not curved, make it curved with top curvature
    if (!line.curved) {
      toggleCurvedText(index);
      return;
    }
    
    // If already curved, toggle between top and bottom
    const newCurvature = line.curvature === 'top' ? 'bottom' : 'top';
    updateLine(index, { curvature: newCurvature });
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-800">Text Lines</h3>
          <p className="text-xs text-gray-500">This stamp can have up to {maxLines} lines of text</p>
        </div>
        
        {distributeTextLines && (
          <Button 
            onClick={distributeTextLines}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <RotateCw size={16} />
            <span>Auto-Arrange</span>
          </Button>
        )}
      </div>
      
      {lines.map((line, index) => (
        <div 
          key={index} 
          className={`space-y-2 p-3 border rounded-md ${activeLineIndex === index ? 'border-brand-blue ring-2 ring-blue-100' : 'border-gray-200'}`}
          onClick={() => setActiveLineIndex(index)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Line {index + 1}</span>
            {activeLineIndex === index && (
              <span className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-1 rounded">Selected</span>
            )}
            {line.curved && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Curved ({line.curvature === 'top' ? 'Top' : 'Bottom'})
              </span>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeLine(index);
                if (activeLineIndex === index) setActiveLineIndex(null);
              }}
              className="ml-auto text-red-500 hover:text-red-700"
              disabled={lines.length <= 1}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <input
            type="text"
            value={line.text}
            onChange={(e) => updateLine(index, { text: e.target.value })}
            placeholder={`Line ${index + 1} text`}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue ${largeControls ? 'text-lg py-3' : ''}`}
          />
          <div className="flex flex-wrap gap-2">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateLine(index, { alignment: 'left' });
                }}
                className={`p-1 ${line.alignment === 'left' ? 'bg-brand-blue text-white' : 'bg-gray-100'} ${largeControls ? 'p-2' : ''}`}
                title="Align Left"
              >
                <AlignLeft size={largeControls ? 20 : 16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateLine(index, { alignment: 'center' });
                }}
                className={`p-1 ${line.alignment === 'center' ? 'bg-brand-blue text-white' : 'bg-gray-100'} ${largeControls ? 'p-2' : ''}`}
                title="Align Center"
              >
                <AlignCenter size={largeControls ? 20 : 16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateLine(index, { alignment: 'right' });
                }}
                className={`p-1 ${line.alignment === 'right' ? 'bg-brand-blue text-white' : 'bg-gray-100'} ${largeControls ? 'p-2' : ''}`}
                title="Align Right"
              >
                <AlignRight size={largeControls ? 20 : 16} />
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateLine(index, { bold: !line.bold });
              }}
              className={`p-1 border rounded-md ${line.bold ? 'bg-brand-blue text-white' : 'bg-gray-100'} ${largeControls ? 'p-2' : ''}`}
              title="Bold"
            >
              <Bold size={largeControls ? 20 : 16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateLine(index, { italic: !line.italic });
              }}
              className={`p-1 border rounded-md ${line.italic ? 'bg-brand-blue text-white' : 'bg-gray-100'} ${largeControls ? 'p-2' : ''}`}
              title="Italic"
            >
              <Italic size={largeControls ? 20 : 16} />
            </button>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateLine(index, { fontSize: Math.max(10, line.fontSize - 2) });
                }}
                className={`p-1 bg-gray-100 ${largeControls ? 'p-2' : ''}`}
                title="Decrease Font Size"
              >
                <Minus size={largeControls ? 20 : 16} />
              </button>
              <span className={`px-2 ${largeControls ? 'text-base' : 'text-sm'}`}>{line.fontSize}px</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateLine(index, { fontSize: Math.min(24, line.fontSize + 2) });
                }}
                className={`p-1 bg-gray-100 ${largeControls ? 'p-2' : ''}`}
                title="Increase Font Size"
              >
                <Plus size={largeControls ? 20 : 16} />
              </button>
            </div>
            {/* Only show curved text for circle shapes */}
            {shape === 'circle' && (
              <button
                onClick={(e) => handleToggleCurvedText(index, e)}
                className={`p-1 border rounded-md flex items-center gap-1 ${line.curved ? 'bg-brand-blue text-white' : 'bg-gray-100'} ${largeControls ? 'p-2' : ''}`}
                title={line.curved ? `Curved (${line.curvature})` : "Toggle Curved Text"}
              >
                <TextQuote size={largeControls ? 20 : 16} />
                <span className={`${largeControls ? 'text-sm' : 'text-xs'}`}>
                  {line.curved ? (line.curvature === 'top' ? 'Top' : 'Bottom') : 'Curved'}
                </span>
              </button>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                resetLineToDefault(index);
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              title="Reset to default position"
            >
              <RotateCw size={16} />
              <span className={`${largeControls ? 'text-sm' : 'text-xs'}`}>Reset</span>
            </Button>
          </div>
          
          {/* Font family selection */}
          <div className="mt-2">
            <Label htmlFor={`font-family-${index}`} className={`text-xs text-gray-500 block mb-1 ${largeControls ? 'text-sm' : ''}`}>
              Font Family
            </Label>
            <Select
              value={line.fontFamily}
              onValueChange={(value) => updateLine(index, { fontFamily: value })}
            >
              <SelectTrigger id={`font-family-${index}`} className={`w-full ${largeControls ? 'text-lg h-12' : ''}`}>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {availableFonts.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Position controls */}
          <div className="mt-3 grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor={`x-position-${index}`} className={`text-xs text-gray-500 flex items-center justify-between mb-1 ${largeControls ? 'text-sm' : ''}`}>
                <div className="flex items-center gap-1">
                  <MoveHorizontal size={largeControls ? 16 : 14} /> Horizontal Position
                </div>
                <span className="font-mono text-brand-blue">
                  {formatPositionLabel(line.xPosition || 0)}
                </span>
              </Label>
              <Slider
                id={`x-position-${index}`}
                min={-100}
                max={100}
                step={1}
                value={[line.xPosition || 0]}
                onValueChange={(value) => updateTextPosition(index, value[0], line.yPosition || 0)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor={`y-position-${index}`} className={`text-xs text-gray-500 flex items-center justify-between mb-1 ${largeControls ? 'text-sm' : ''}`}>
                <div className="flex items-center gap-1">
                  <MoveVertical size={largeControls ? 16 : 14} /> Vertical Position
                </div>
                <span className="font-mono text-brand-blue">
                  {formatPositionLabel(line.yPosition || 0)}
                </span>
              </Label>
              <Slider
                id={`y-position-${index}`}
                min={-100}
                max={100}
                step={1}
                value={[line.yPosition || 0]}
                onValueChange={(value) => updateTextPosition(index, line.xPosition || 0, value[0])}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Position indicators */}
          <div className="mt-2 bg-gray-50 p-2 rounded border text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Position: </span>
              <span className="font-mono">
                X: {formatPositionLabel(line.xPosition || 0)}, Y: {formatPositionLabel(line.yPosition || 0)}
              </span>
            </div>
            {TextPositioningService.isOutsideSafeZone(line, shape) && (
              <div className="mt-1 text-red-500 flex items-center gap-1">
                <CornerDownRight size={12} />
                <span>Warning: Text may be outside the 1mm safe zone</span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {lines.length < maxLines && (
        <button
          onClick={addLine}
          className={`flex items-center gap-1 text-brand-blue hover:text-blue-700 ${largeControls ? 'text-base' : 'text-sm'}`}
        >
          <Plus size={largeControls ? 20 : 16} /> Add another line
        </button>
      )}
    </div>
  );
};

export default TextLinesEditor;
