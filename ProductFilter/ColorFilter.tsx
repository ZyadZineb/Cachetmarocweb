
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorFilterProps {
  colors: Array<{ id: string; name: string; hex: string }>;
  selectedColors: string[];
  onChange: (colors: string[]) => void;
}

const ColorFilter = ({ colors, selectedColors, onChange }: ColorFilterProps) => {
  const [open, setOpen] = React.useState(true);

  const handleColorChange = (color: string) => {
    if (selectedColors.includes(color)) {
      onChange(selectedColors.filter((c) => c !== color));
    } else {
      onChange([...selectedColors, color]);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Ink Colors</h3>
        <CollapsibleTrigger className="hover:bg-gray-100 rounded-full p-1">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {colors.map((color) => (
              <Tooltip key={color.id}>
                <TooltipTrigger asChild>
                  <button
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColors.includes(color.id) ? 'border-gray-800' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleColorChange(color.id)}
                    aria-label={color.name}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{color.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ColorFilter;
