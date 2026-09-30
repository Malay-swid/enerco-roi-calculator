import React from 'react';
import { Leaf } from 'lucide-react';

interface HeaderProps {
  title?: string;
  accent?: string;
}

export function Header({ title = 'SWID', accent = 'Working towards a better tomorrow' }: HeaderProps) {
  return (
    <header className="bg-[#ebf4ed]">
      <div className="flex flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b6d4f] text-white shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="text-[30px] font-black tracking-[-0.08em] text-[#1a2f2a]">{title}</div>
        </div>

        <div className="max-w-full rounded-[4px] border border-[#b7d7c4] bg-[#ecf8f1] px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f5e47]">
          FREE MH BESS RoI Payback Calculator
        </div>
      </div>

      <div className="border-t border-[#d4dfd5] bg-[#f5faf6] px-4 py-2 text-[11px] text-[#4a645f] sm:text-[12px]">
        {accent}
      </div>
    </header>
  );
}
