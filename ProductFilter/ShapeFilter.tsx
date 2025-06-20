
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Square, Circle } from 'lucide-react';

interface ShapeFilterProps {
  selectedShape: string | null;
  onChange: (shape: string | null) => void;
}

const ShapeFilter = ({ selectedShape, onChange }: ShapeFilterProps) => {
  const [open, setOpen] = React.useState(true);

  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'square', name: 'Square', icon: Square },
  ];

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Shape</h3>
        <CollapsibleTrigger className="hover:bg-gray-100 rounded-full p-1">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ToggleGroup
          type="single"
          value={selectedShape || ''}
          onValueChange={(value) => onChange(value || null)}
          className="flex flex-wrap gap-2 justify-start"
        >
          {shapes.map((shape) => (
            <ToggleGroupItem
              key={shape.id}
              value={shape.id}
              aria-label={shape.name}
              className="flex flex-col items-center p-2 data-[state=on]:bg-gray-100"
            >
              <shape.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{shape.name}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ShapeFilter;
