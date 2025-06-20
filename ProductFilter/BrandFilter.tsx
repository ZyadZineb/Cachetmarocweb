
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BrandFilterProps {
  brands: string[];
  selectedBrands: string[];
  onChange: (brands: string[]) => void;
}

const BrandFilter = ({ brands, selectedBrands, onChange }: BrandFilterProps) => {
  const [open, setOpen] = React.useState(true);
  
  const handleBrandChange = (brand: string) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onChange(updatedBrands);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Brands</h3>
        <CollapsibleTrigger className="hover:bg-gray-100 rounded-full p-1">
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {brands.map((brand) => (
          <div key={brand} className="flex items-center space-x-2">
            <Checkbox
              id={`brand-${brand}`}
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => handleBrandChange(brand)}
            />
            <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
              {brand}
            </Label>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BrandFilter;
