import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";

interface CounterProps {
  value?: number;
  initial?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

const Counter: React.FC<CounterProps> = ({ value: controlledValue, initial = 1, min = 1, max = 99, onChange }) => {
  const [internalValue, setInternalValue] = useState(initial);
  
  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - 1;
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      const newValue = value + 1;
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) newValue = min;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center border border-solid border-gray-400 rounded-full font-inherit select-none w-[100px] h-[35px]">
      <button
        onClick={handleDecrement}
        className={`w-[33px] h-[33px] flex items-center justify-center text-gray-800 transition-colors text-sm ${
          value > min 
            ? "cursor-pointer hover:text-gray-600" 
            : "cursor-not-allowed text-gray-400"
        }`}
        style={{ background: "none", border: "none" }}
        aria-label="Decrease"
        disabled={value <= min}
      >
        <MinusIcon className="w-3 h-3" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={handleInputChange}
        className="text-center font-semibold text-sm border-none outline-none bg-transparent flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <button
        onClick={handleIncrement}
        className={`w-[33px] h-[33px] flex items-center justify-center text-gray-800 transition-colors text-sm ${
          value < max 
            ? "cursor-pointer hover:text-gray-600" 
            : "cursor-not-allowed text-gray-400"
        }`}
        style={{ background: "none", border: "none" }}
        aria-label="Increase"
        disabled={value >= max}
      >
        <PlusIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default Counter; 