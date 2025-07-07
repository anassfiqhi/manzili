import React, { useState } from "react";

interface CounterProps {
  initial?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

const Counter: React.FC<CounterProps> = ({ initial = 1, min = 1, max = 99, onChange }) => {
  const [value, setValue] = useState(initial);

  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(e.target.value, 10);
    if (isNaN(newValue)) newValue = min;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center border-2 border-gray-400 rounded-full px-6 py-1 font-inherit select-none">
      <button
        onClick={handleDecrement}
        className={`text-3xl w-10 h-10 flex items-center justify-center text-gray-800 transition-colors ${
          value > min 
            ? "cursor-pointer hover:text-gray-600" 
            : "cursor-not-allowed text-gray-400"
        }`}
        style={{ background: "none", border: "none" }}
        aria-label="Decrease"
        disabled={value <= min}
      >
        –
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={handleInputChange}
        className="text-center font-semibold text-3xl border-none outline-none bg-transparent w-16"
        aria-label="Quantity"
      />
      <button
        onClick={handleIncrement}
        className={`text-3xl w-10 h-10 flex items-center justify-center text-gray-800 transition-colors ${
          value < max 
            ? "cursor-pointer hover:text-gray-600" 
            : "cursor-not-allowed text-gray-400"
        }`}
        style={{ background: "none", border: "none" }}
        aria-label="Increase"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default Counter; 