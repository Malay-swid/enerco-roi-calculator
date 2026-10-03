import React from 'react';

interface OptionToggleProps {
  items: Array<{ label: string; helper?: string; value: string }>;
  selected: string;
  onSelect: (value: string) => void;
  columns?: number;
}

export function OptionToggle({ items, selected, onSelect, columns = 2 }: OptionToggleProps) {
  const columnClasses: Record<number, string> = {
    1: 'sm:grid-cols-1 md:grid-cols-1',
    2: 'sm:grid-cols-2 md:grid-cols-2',
    3: 'sm:grid-cols-3 md:grid-cols-3',
  };

  return (
    <div className={`grid grid-cols-1 gap-2 ${columnClasses[columns] ?? columnClasses[2]}`}>
      {items.map((item) => {
        const isSelected = selected === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onSelect(item.value)}
            className={`rounded-[4px] border px-2 py-2 text-left transition ${
              isSelected
                ? 'border-[#0f61ab] bg-[#e8f2fb] text-[#0b4f8b] shadow-sm'
                : 'border-[#d9e2ec] bg-white text-[#64748b] hover:bg-[#f1f6fa]'
            }`}
          >
            <div className="text-[11px] font-semibold leading-[1.2]">{item.label}</div>
            {item.helper ? <div className="mt-1 text-[10px] text-current/80">{item.helper}</div> : null}
          </button>
        );
      })}
    </div>
  );
}
