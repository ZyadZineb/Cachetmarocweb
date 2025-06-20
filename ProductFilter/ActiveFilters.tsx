
import React from 'react';
import { X } from 'lucide-react';
import { FilterState } from '@/hooks/useProductFilter';

interface ActiveFiltersProps {
  filters: FilterState;
  brands: string[];
  colorOptions: Array<{ id: string; name: string }>;
  onRemove: (filterType: string, value?: string | number) => void;
  onClearAll: () => void;
}

const ActiveFilters = ({
  filters,
  brands,
  colorOptions,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) => {
  // Check if any filters are active
  const hasActiveFilters =
    filters.selectedBrands.length > 0 ||
    filters.selectedColors.length > 0 ||
    filters.selectedSizes.length > 0 ||
    filters.selectedShape !== null ||
    filters.selectedLines !== null ||
    (filters.priceRange[0] > filters.minPrice || 
     filters.priceRange[1] < filters.maxPrice) ||
    filters.searchQuery !== '';

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Active Filters</h3>
        <button
          onClick={onClearAll}
          className="text-xs text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.searchQuery && (
          <FilterTag
            label={`Search: "${filters.searchQuery}"`}
            onRemove={() => onRemove('searchQuery')}
          />
        )}
        
        {(filters.priceRange[0] > filters.minPrice || filters.priceRange[1] < filters.maxPrice) && (
          <FilterTag
            label={`Price: ${filters.priceRange[0]} - ${filters.priceRange[1]} MAD`}
            onRemove={() => onRemove('priceRange')}
          />
        )}
        
        {filters.selectedShape && (
          <FilterTag
            label={`Shape: ${filters.selectedShape}`}
            onRemove={() => onRemove('shape')}
          />
        )}
        
        {filters.selectedLines && (
          <FilterTag
            label={`Lines: ${filters.selectedLines}+`}
            onRemove={() => onRemove('lines')}
          />
        )}
        
        {filters.selectedBrands.map((brand) => (
          <FilterTag
            key={`brand-${brand}`}
            label={`Brand: ${brand}`}
            onRemove={() => onRemove('brand', brand)}
          />
        ))}
        
        {filters.selectedColors.map((colorId) => {
          const color = colorOptions.find((c) => c.id === colorId);
          return (
            <FilterTag
              key={`color-${colorId}`}
              label={`Color: ${color?.name || colorId}`}
              onRemove={() => onRemove('color', colorId)}
            />
          );
        })}
        
        {filters.selectedSizes.map((size) => (
          <FilterTag
            key={`size-${size}`}
            label={`Size: ${size}`}
            onRemove={() => onRemove('size', size)}
          />
        ))}
      </div>
    </div>
  );
};

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = ({ label, onRemove }: FilterTagProps) => {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 text-gray-500 hover:text-gray-700"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default ActiveFilters;
