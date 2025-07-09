'use client';

import PriceDualRangeSlider from "./price-dual-range-slider";

interface PriceFilterProps {
  min?: number;
  max?: number;
  currency?: string;
  onValueChange?: (values: [number, number]) => void;
}

const PriceFilter = ({ 
  min = 0, 
  max = 1000, 
  currency = '$',
  onValueChange 
}: PriceFilterProps) => {
  return (
    <PriceDualRangeSlider 
      min={min}
      max={max}
      step={10}
      defaultValue={[min, max]}
      currency={currency}
      onValueChange={onValueChange || ((values) => {
        // TODO: Implement price filtering logic
        console.log('Price range changed:', values);
      })}
    />
  );
};

export default PriceFilter