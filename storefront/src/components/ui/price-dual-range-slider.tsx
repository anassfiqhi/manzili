'use client';

import * as React from 'react';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

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
  className = "w-full space-y-5 px-3",
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

    // Transform currency codes to display characters
    let displayCurrency = currency;
    if (currency) {
      const currencyCode = currency.toUpperCase();
      switch (currencyCode) {
        case 'MAD':
          displayCurrency = 'DH';
          break;
        case 'USD':
          displayCurrency = '$';
          break;
        case 'EUR':
          displayCurrency = '€';
          break;
        case 'GBP':
          displayCurrency = '£';
          break;
        case 'JPY':
          displayCurrency = '¥';
          break;
        case 'CAD':
          displayCurrency = 'C$';
          break;
        case 'AUD':
          displayCurrency = 'A$';
          break;
        default:
          displayCurrency = currency;
      }
    }

    return <><span>{value}</span>&nbsp;<span>{displayCurrency}</span></>;
  };

  return (
    <div className={cn('mt-5 flex justify-center items-center gap-6',className)}>
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
