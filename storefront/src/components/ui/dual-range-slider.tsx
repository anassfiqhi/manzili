'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

interface DualRangeSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: 'top' | 'bottom' | ['top' | 'bottom', 'top' | 'bottom'];
  label?: (value: number | undefined, index: number) => React.ReactNode;
  showLabelOnPress?: boolean;
  alwaysShowLabel?: boolean;
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ className, label, labelPosition = 'top', showLabelOnPress = false, alwaysShowLabel = false, ...props }, ref) => {
  const initialValue = Array.isArray(props.value) ? props.value : [props.min, props.max];
  const [pressedThumb, setPressedThumb] = React.useState<number | null>(null);

  // Helper to get label position for each thumb
  const getLabelPosition = (index: number) => {
    if (Array.isArray(labelPosition)) {
      return labelPosition[index] || 'top';
    }
    return labelPosition;
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className={cn("relative h-1 w-full grow overflow-hidden rounded-full bg-[rgba(228,228,231,1)]")}>
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {initialValue.map((value, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb 
            className={cn("relative block h-4 w-4 bg-white rounded-full border-2 border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50")}
            onPointerDown={showLabelOnPress ? () => setPressedThumb(index) : undefined}
            onPointerUp={showLabelOnPress ? () => setPressedThumb(null) : undefined}
            onPointerLeave={showLabelOnPress ? () => setPressedThumb(null) : undefined}
          >
            {label && ((alwaysShowLabel || (showLabelOnPress ? pressedThumb === index : false))) && (
              <span
                className={cn(
                  'absolute flex w-full justify-center',
                  getLabelPosition(index) === 'top' && '-top-7',
                  getLabelPosition(index) === 'bottom' && 'top-4',
                )}
              >
                {label(value, index)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});
DualRangeSlider.displayName = 'DualRangeSlider';

export { DualRangeSlider };
