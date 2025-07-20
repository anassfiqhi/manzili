'use client';

import * as React from 'react';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from "@lib/util/format-currency"
import { convertToLocale } from '@/lib/util/money';

interface PriceDualRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  currency?: string;
  className?: string;
  onValueChange?: (values: [number, number]) => void;
  labelFormatter?: (value: number) => string;
  showMinLabel?: boolean; // NEW
  showMaxLabel?: boolean; // NEW
}

const PriceDualRangeSlider: React.FC<PriceDualRangeSliderProps> = ({
  min,
  max,
  step = 10,
  defaultValue = [0, 0],
  currency = 'USD',
  className = "w-full space-y-5 px-4",
  onValueChange,
  labelFormatter,
  showMinLabel = false,
  showMaxLabel = false,
}) => {
  const [values, setValues] = useState<[number, number]>(defaultValue);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Check if component should be disabled
  const isDisabled = min === undefined || min === null || max === undefined || max === null || min === max;

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
    if (isDisabled) return;
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

  // If disabled, show a disabled message
  // if (isDisabled) {
  //   return (
  //     <div className={cn('mt-5 flex justify-center items-center gap-6 lg:gap-3 opacity-50', className)}>
  //       <span className="text-sm text-gray-500">Price range unavailable</span>
  //     </div>
  //   );
  // }

  return (
    <div className={cn('mt-8 flex-col justify-center items-center gap-6 lg:gap-3', className, 'px-0', isDisabled && 'opacity-50 pointer-events-none')}>

      <DualRangeSlider
        label={(value) => <span>{convertToLocale({ amount: value || 0, currency_code: currency })}</span>}
        value={values}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        className='!mt-0'
        showLabelOnPress
        disabled={isDisabled}
      />
      <div className='flex justify-between'>
        {showMinLabel && min !== undefined && (
          <span className={cn('!mt-0', isDisabled && 'text-gray-400')}>
            {convertToLocale({ amount: min, currency_code: currency })}
          </span>
        )}
        {showMaxLabel && max !== undefined && (
          <span className={cn('!mt-0', isDisabled && 'text-gray-400')}>
            {convertToLocale({ amount: max, currency_code: currency })}
          </span>
        )}
        {/* {showMinLabel && min !== undefined && (
          <span className={cn('!mt-0 hidden lg:block', isDisabled && 'text-gray-400')}>
            {convertToLocale({ amount: min, currency_code: currency })}
          </span>
        )}
        {showMaxLabel && max !== undefined && (
          <span className={cn('!mt-0 hidden lg:block', isDisabled && 'text-gray-400')}>
            {convertToLocale({ amount: max, currency_code: currency })}
          </span>
        )} */}
      </div>

    </div>
  );
};

export default PriceDualRangeSlider;
