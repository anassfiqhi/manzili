'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import PriceDualRangeSlider from "./price-dual-range-slider";

interface PriceFilterProps {
  min?: number;
  max?: number;
  currency?: string;
  title?: string;
}

const PriceFilter = ({
  min = 0,
  max = 0,
  currency = 'USD',
  title = 'Fourchette de Prix'
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

  // const formatLabel = (value: number | undefined) => {
  //   if (value === undefined) return '';

  //   // Transform currency codes to display characters
  //   let displayCurrency = currency;
  //   if (currency) {
  //     const currencyCode = currency.toUpperCase();
  //     switch (currencyCode) {
  //       case 'MAD':
  //         displayCurrency = 'DH';
  //         break;
  //       case 'USD':
  //         displayCurrency = '$';
  //         break;
  //       case 'EUR':
  //         displayCurrency = '€';
  //         break;
  //       case 'GBP':
  //         displayCurrency = '£';
  //         break;
  //       case 'JPY':
  //         displayCurrency = '¥';
  //         break;
  //       case 'CAD':
  //         displayCurrency = 'C$';
  //         break;
  //       case 'AUD':
  //         displayCurrency = 'A$';
  //         break;
  //       default:
  //         displayCurrency = currency;
  //     }
  //   }

  //   return <><span>{value}</span>&nbsp;<span>{displayCurrency}</span></>;
  // };

  return (
    <div className='py-4 small:px-0 pl-6 small:mx-[1.675rem]'>
      {title && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
      )}
      {/* {min && (
        <span className='flex justify-center items-center'>
          De&nbsp;{formatLabel(min)}
        </span>
      )} */}
      <PriceDualRangeSlider
        min={min}
        max={max}
        step={1}
        defaultValue={[minPrice, maxPrice]}
        currency={currency}
        onValueChange={handlePriceChange}
        showMinLabel
        showMaxLabel
      />
      {/* {max && min !== max && <span className='flex justify-center items-center'>À&nbsp;{formatLabel(max)}</span>} */}
    </div>
  );
};

export default PriceFilter