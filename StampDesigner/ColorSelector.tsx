
import React from 'react';
import { Check } from 'lucide-react';

interface ColorSelectorProps {
  inkColors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  largeControls?: boolean;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  inkColors,
  selectedColor,
  onColorSelect,
  largeControls = false
}) => {
  return (
    <div className="space-y-3">
      <h3 className={`font-medium text-gray-800 ${largeControls ? 'text-lg' : ''}`}>Ink Color</h3>
      <div className="flex flex-wrap gap-3">
        {inkColors.map((color) => (
          <button 
            key={color}
            onClick={() => onColorSelect(color)}
            className={`${largeControls ? 'w-10 h-10' : 'w-8 h-8'} rounded-full border-2 ${selectedColor === color ? 'border-gray-900' : 'border-gray-300'}`}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <Check size={largeControls ? 20 : 16} className="text-white mx-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
