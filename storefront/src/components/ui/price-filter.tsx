'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import PriceDualRangeSlider from "./price-dual-range-slider";

interface PriceFilterProps {
  min?: number;
  max?: number;
  currency?: string;
}

const PriceFilter = ({ 
  min = 0, 
  max = 1000, 
  currency = '$'
}: PriceFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current price filter values from URL
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : min;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : max;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePriceChange = useCallback((values: [number, number]) => {
    const [newMin, newMax] = values;
    
    // Only update if values are different from current URL params
    if (newMin !== minPrice || newMax !== maxPrice) {
      const params = new URLSearchParams(searchParams);
      params.set('minPrice', newMin.toString());
      params.set('maxPrice', newMax.toString());
      // Reset page when filtering
      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [minPrice, maxPrice, searchParams, pathname, router]);

  return (
    <PriceDualRangeSlider 
      min={min}
      max={max}
      step={10}
      defaultValue={[minPrice, maxPrice]}
      currency={currency}
      onValueChange={handlePriceChange}
    />
  );
};

export default PriceFilter