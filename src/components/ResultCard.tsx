import React from 'react';

interface ResultCardProps {
  label: string;
  value: string;
  subtitle: string;
  highlight?: boolean;
  dark?: boolean;
}

export function ResultCard({ label, value, subtitle, highlight = false, dark = false }: ResultCardProps) {
  const base = dark
    ? 'border border-[#14a969] bg-[#0f8b5c] text-white'
    : highlight
      ? 'border border-[#9adab7] bg-[#ebf9f1] text-[#163d2d]'
      : 'border border-[#dfe7df] bg-white text-[#163d2d]';

  return (
    <div className={`rounded-[4px] p-3 ${base}`}>
      <div className="text-[9px] font-bold uppercase tracking-[0.12em] opacity-90">{label}</div>
      <div className="mt-2 text-[18px] font-black tracking-[-0.05em]">{value}</div>
      <div className="mt-1 text-[10px] opacity-80">{subtitle}</div>
    </div>
  );
}
