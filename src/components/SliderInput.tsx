import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}

const formatValue = (value: number, suffix?: string) => {
  const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  return `${formatted}${suffix ? ` ${suffix}` : ''}`;
};

export function SliderInput({ label, value, min, max, step, suffix, onChange }: SliderInputProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] font-semibold text-[#64748b]">
        <span>{label}</span>
        <span className="text-[#7a8a85]">{formatValue(value, suffix)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-[#0f61ab]"
        aria-label={label}
      />
    </div>
  );
}
