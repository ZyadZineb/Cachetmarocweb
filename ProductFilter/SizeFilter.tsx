
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SizeGroup {
  name: string;
  sizes: string[];
}

interface SizeFilterProps {
  sizeGroups: SizeGroup[];
  selectedSizes: string[];
  onChange: (sizes: string[]) => void;
}

const SizeFilter = ({ sizeGroups, selectedSizes, onChange }: SizeFilterProps) => {
  const [open, setOpen] = React.useState(true);

  const handleSizeChange = (size: string) => {
    const updatedSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    onChange(updatedSizes);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Size</h3>
        <CollapsibleTrigger className="hover:bg-gray-100 rounded-full p-1">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-3">
        {sizeGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            <h4 className="text-xs text-gray-500">{group.name}</h4>
            {group.sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={() => handleSizeChange(size)}
                />
                <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SizeFilter;
