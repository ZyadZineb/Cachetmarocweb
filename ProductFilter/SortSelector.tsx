
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectorProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

const SortSelector = ({ options, value, onChange }: SortSelectorProps) => {
  return (
    <div className="inline-flex flex-col">
      <label htmlFor="sort-selector" className="sr-only">Sort products by</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className="w-[180px]" 
          id="sort-selector"
          aria-label="Sort products"
        >
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelector;
