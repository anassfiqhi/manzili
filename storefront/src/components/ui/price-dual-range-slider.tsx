'use client';

import * as React from 'react';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { useState, useEffect } from 'react';

interface PriceDualRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  currency?: string;
  className?: string;
  onValueChange?: (values: [number, number]) => void;
  labelFormatter?: (value: number) => string;
}

const PriceDualRangeSlider: React.FC<PriceDualRangeSliderProps> = ({
  min = 0,
  max = 1000,
  step = 10,
  defaultValue = [0, 1000],
  currency = '$',
  className = "w-full space-y-5 px-10",
  onValueChange,
  labelFormatter
}) => {
  const [values, setValues] = useState<[number, number]>(defaultValue);

  // Sync with external value changes
  useEffect(() => {
    setValues(defaultValue);
  }, [defaultValue]);

  const handleValueChange = (newValues: [number, number]) => {
    setValues(newValues);
    onValueChange?.(newValues);
  };

  const formatLabel = (value: number | undefined) => {
    if (value === undefined) return '';
    if (labelFormatter) {
      return labelFormatter(value);
    }
    
    // Replace Moroccan currency code "MAD" with "DH" (case insensitive)
    const displayCurrency = currency?.toUpperCase() === 'MAD' ? 'DH' : currency;
    return `${value} ${displayCurrency}`;
  };

  return (
    <div className={className}>
      <DualRangeSlider
        label={(value) => <span>{formatLabel(value)}</span>}
        value={values}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

export default PriceDualRangeSlider;
