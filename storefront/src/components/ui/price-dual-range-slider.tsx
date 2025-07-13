'use client';

import * as React from 'react';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from "@lib/util/format-currency"

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
  className = "w-full space-y-5 px-4",
  onValueChange,
  labelFormatter
}) => {
  const [values, setValues] = useState<[number, number]>(defaultValue);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Sync with external value changes
  useEffect(() => {
    setValues(defaultValue);
  }, [defaultValue]);

  // Debounced handler
  const debouncedOnValueChange = useCallback((newValues: [number, number]) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onValueChange?.(newValues);
    }, 300);
  }, [onValueChange]);

  const handleValueChange = (newValues: [number, number]) => {
    setValues(newValues);
    debouncedOnValueChange(newValues);
  };

  const formatLabel = (value: number | undefined) => {
    if (value === undefined) return '';
    if (labelFormatter) {
      return labelFormatter(value);
    }

    return formatCurrency(value, currency || '');
  };

  return (
    <div className={cn('mt-5 flex justify-center items-center gap-6 lg:gap-3',className)}>
      {min && <span className='!mt-0'>{formatLabel(min)}</span>}
      <DualRangeSlider
        label={(value) => <span>{formatLabel(value)}</span>}
        value={values}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        className='!mt-0'
        showLabelOnPress
      />
      {max && <span className='!mt-0'>{formatLabel(max)}</span>}
    </div>
  );
};

export default PriceDualRangeSlider;
