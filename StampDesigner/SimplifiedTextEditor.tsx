
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Trash2, MoveVertical, MoveHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StampTextLine } from '@/types';
import { TextPositioningService } from '@/utils/TextPositioningService';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface SimplifiedTextEditorProps {
  lines: StampTextLine[];
  maxLines: number;
  shape: 'rectangle' | 'circle' | 'square';
  activeLineIndex: number | null;
  setActiveLineIndex: (index: number | null) => void;
  updateLine: (index: number, updates: Partial<StampTextLine>) => void;
  addLine: () => void;
  removeLine: (index: number) => void;
  toggleCurvedText?: (index: number, position?: 'top' | 'bottom') => void;
  distributeTextLines?: () => void;
  enforceTextBoundaries?: () => void;
  detectTextCollisions?: () => boolean;
  largeControls?: boolean;
}

const SimplifiedTextEditor: React.FC<SimplifiedTextEditorProps> = ({
  lines,
  maxLines,
  shape,
  activeLineIndex,
  setActiveLineIndex,
  updateLine,
  addLine,
  removeLine,
  toggleCurvedText,
  distributeTextLines,
  enforceTextBoundaries,
  detectTextCollisions,
  largeControls = false
}) => {
  const { t } = useTranslation();
  
  const handleAlignmentChange = (index: number, alignment: 'left' | 'center' | 'right') => {
    updateLine(index, { alignment });
  };

  const handleFontSizeChange = (index: number, value: string) => {
    const fontSize = parseInt(value);
    if (!isNaN(fontSize)) {
      updateLine(index, { fontSize });
      // After changing font size, enforce text boundaries
      if (enforceTextBoundaries) {
        setTimeout(enforceTextBoundaries, 50);
      }
    }
  };

  const hasCollisions = detectTextCollisions ? detectTextCollisions() : false;

  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 28];
  
  const fontFamilies = ['Arial', 'Times New Roman', 'Verdana', 'Georgia', 'Courier New'];
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">
        {t('textEditor.title', 'Text Content')}
      </h2>
      
      {/* Distribute text lines button */}
      {distributeTextLines && (
        <Button 
          variant="outline" 
          className="w-full mb-2"
          onClick={distributeTextLines}
          size={largeControls ? "lg" : "default"}
        >
          <MoveVertical className="mr-2" size={largeControls ? 18 : 15} />
          {t('textEditor.distributeLines', 'Distribute Lines Evenly')}
        </Button>
      )}
      
      {/* Collision warning */}
      {hasCollisions && (
        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-800 mb-4">
          <p className="font-medium">{t('textEditor.textOverlap', 'Text Overlap Detected')}</p>
          <p className="text-xs mt-1">{t('textEditor.clickDistribute', 'Click "Distribute Lines Evenly" above to fix overlapping text')}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {lines.map((line, index) => {
          const isOutsideSafeZone = TextPositioningService.isOutsideSafeZone(line, shape);
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                activeLineIndex === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : isOutsideSafeZone
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white'
              }`}
              onClick={() => setActiveLineIndex(index)}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="font-medium text-sm text-gray-700">
                  {t('textEditor.line', 'Line {{number}}', { number: index + 1 })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLine(index)}
                  title={t('textEditor.removeLine', 'Remove Line')}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </div>
              
              {isOutsideSafeZone && (
                <div className="p-2 bg-yellow-100 text-yellow-800 text-xs rounded mb-2">
                  {t('textEditor.outsideSafeZone', 'This text may be too close to the stamp border')}
                </div>
              )}
              
              <div className="space-y-3">
                {/* Text input */}
                <Input
                  type="text"
                  value={line.text}
                  onChange={(e) => updateLine(index, { text: e.target.value })}
                  placeholder={t('textEditor.enterText', 'Enter text...')}
                  className={`w-full ${largeControls ? 'text-lg py-3' : ''}`}
                />
                
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Font family dropdown */}
                  <Select 
                    value={line.fontFamily} 
                    onValueChange={(value) => updateLine(index, { fontFamily: value })}
                  >
                    <SelectTrigger className={`w-[140px] ${largeControls ? 'h-12' : ''}`}>
                      <SelectValue placeholder="Font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Font size dropdown */}
                  <Select 
                    value={line.fontSize.toString()} 
                    onValueChange={(value) => handleFontSizeChange(index, value)}
                  >
                    <SelectTrigger className={`w-[80px] ${largeControls ? 'h-12' : ''}`}>
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Style and alignment controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {/* Bold toggle */}
                    <Button
                      variant={line.bold ? "default" : "outline"}
                      size="icon"
                      onClick={() => updateLine(index, { bold: !line.bold })}
                      title={t('textEditor.bold', 'Bold')}
                      className={largeControls ? 'h-10 w-10' : ''}
                    >
                      <Bold size={largeControls ? 18 : 15} />
                    </Button>
                    
                    {/* Italic toggle */}
                    <Button
                      variant={line.italic ? "default" : "outline"}
                      size="icon"
                      onClick={() => updateLine(index, { italic: !line.italic })}
                      title={t('textEditor.italic', 'Italic')}
                      className={largeControls ? 'h-10 w-10' : ''}
                    >
                      <Italic size={largeControls ? 18 : 15} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {/* Alignment buttons unified in a button group */}
                    <div className="flex border rounded-md overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAlignmentChange(index, 'left')}
                        className={`rounded-none border-r ${
                          line.alignment === 'left' ? 'bg-gray-200' : ''
                        } ${largeControls ? 'h-10 w-10' : ''}`}
                        title={t('textEditor.alignLeft', 'Align Left')}
                      >
                        <AlignLeft size={largeControls ? 18 : 15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAlignmentChange(index, 'center')}
                        className={`rounded-none border-r ${
                          line.alignment === 'center' ? 'bg-gray-200' : ''
                        } ${largeControls ? 'h-10 w-10' : ''}`}
                        title={t('textEditor.alignCenter', 'Align Center')}
                      >
                        <AlignCenter size={largeControls ? 18 : 15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAlignmentChange(index, 'right')}
                        className={`rounded-none ${
                          line.alignment === 'right' ? 'bg-gray-200' : ''
                        } ${largeControls ? 'h-10 w-10' : ''}`}
                        title={t('textEditor.alignRight', 'Align Right')}
                      >
                        <AlignRight size={largeControls ? 18 : 15} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Only show curved text option for circular stamps */}
                {shape === 'circle' && toggleCurvedText && (
                  <div className="flex items-center mt-2">
                    <Select 
                      value={line.curved ? (line.curvature || 'top') : 'none'} 
                      onValueChange={(value) => {
                        if (value === 'none') {
                          updateLine(index, { curved: false });
                        } else {
                          toggleCurvedText(index, value as 'top' | 'bottom');
                        }
                      }}
                    >
                      <SelectTrigger className={`w-full ${largeControls ? 'h-12' : ''}`}>
                        <SelectValue placeholder={t('textEditor.textStyle', 'Text Style')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t('textEditor.straightText', 'Straight Text')}</SelectItem>
                        <SelectItem value="top">{t('textEditor.curvedTop', 'Curved (Top)')}</SelectItem>
                        <SelectItem value="bottom">{t('textEditor.curvedBottom', 'Curved (Bottom)')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Add text line button */}
      {lines.length < maxLines && (
        <Button
          onClick={addLine}
          variant="outline"
          className="w-full mt-2"
          size={largeControls ? "lg" : "default"}
        >
          {t('textEditor.addLine', '+ Add Text Line')}
        </Button>
      )}
      
      {/* Safe zone instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
        <p>{t('textEditor.safeZoneTip', 'Tip: Keep text within the safe zone to ensure it does not touch the stamp border')}</p>
      </div>
    </div>
  );
};

export default SimplifiedTextEditor;
