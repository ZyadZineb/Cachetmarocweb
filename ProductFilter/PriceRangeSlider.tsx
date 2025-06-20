
import React, { memo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeSlider = memo(({
  minPrice,
  maxPrice,
  value,
  onChange,
}: PriceRangeSliderProps) => {
  const handleChange = (newValue: number[]) => {
    onChange([newValue[0], newValue[1]]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="price-range">Price Range</Label>
        <span className="text-sm text-gray-500" aria-live="polite">
          {value[0]} MAD - {value[1]} MAD
        </span>
      </div>
      <Slider
        id="price-range"
        min={minPrice}
        max={maxPrice}
        step={10}
        value={value}
        onValueChange={handleChange}
        className="my-4"
        aria-label={`Price range from ${value[0]} to ${value[1]} MAD`}
        aria-valuemin={minPrice}
        aria-valuemax={maxPrice}
        aria-valuenow={value[0]}
        aria-valuetext={`${value[0]} to ${value[1]} MAD`}
      />
    </div>
  );
});

PriceRangeSlider.displayName = 'PriceRangeSlider';

export default PriceRangeSlider;
