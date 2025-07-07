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

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "2px solid #bdbdbd",
        borderRadius: "9999px",
        padding: "0.25rem 1.5rem",
        width: "fit-content",
        fontFamily: "inherit",
        userSelect: "none",
      }}
    >
      <button
        onClick={handleDecrement}
        style={{
          background: "none",
          border: "none",
          fontSize: "2rem",
          cursor: value > min ? "pointer" : "not-allowed",
          color: "#222",
          width: "2.5rem",
          height: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Decrease"
        disabled={value <= min}
      >
        –
      </button>
      <span
        style={{
          minWidth: "2.5rem",
          textAlign: "center",
          fontWeight: 600,
          fontSize: "2rem",
        }}
      >
        {value}
      </span>
      <button
        onClick={handleIncrement}
        style={{
          background: "none",
          border: "none",
          fontSize: "2rem",
          cursor: value < max ? "pointer" : "not-allowed",
          color: "#222",
          width: "2.5rem",
          height: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Increase"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default Counter; 