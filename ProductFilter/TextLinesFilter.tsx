
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TextLinesFilterProps {
  selectedLines: number | null;
  onChange: (lines: number | null) => void;
}

const TextLinesFilter = ({ selectedLines, onChange }: TextLinesFilterProps) => {
  const [open, setOpen] = React.useState(true);

  const lineOptions = [
    { value: 2, label: '1-2 lines' },
    { value: 4, label: '3-4 lines' },
    { value: 5, label: '5+ lines' },
  ];

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Text Lines</h3>
        <CollapsibleTrigger className="hover:bg-gray-100 rounded-full p-1">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <RadioGroup 
          value={selectedLines?.toString() || ''} 
          onValueChange={(value) => {
            onChange(value ? parseInt(value, 10) : null);
          }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="lines-all" />
            <Label htmlFor="lines-all" className="text-sm cursor-pointer">All</Label>
          </div>
          {lineOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value.toString()} id={`lines-${option.value}`} />
              <Label htmlFor={`lines-${option.value}`} className="text-sm cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TextLinesFilter;
