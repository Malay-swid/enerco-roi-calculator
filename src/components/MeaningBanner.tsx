import React from 'react';
import { Zap } from 'lucide-react';

interface MeaningBannerProps {
  paybackPenalty: number | null;
  bessStandalonePayback: number | null;
}

export function MeaningBanner({ paybackPenalty, bessStandalonePayback }: MeaningBannerProps) {
  const penaltyText = paybackPenalty === null ? '0.0' : paybackPenalty.toFixed(1);
  const standaloneText = bessStandalonePayback === null ? '0.0' : bessStandalonePayback.toFixed(1);

  return (
    <div className="rounded-[6px] border border-[#d8eadb] bg-[#eefbf3] p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#153d32]">
          <Zap className="h-4 w-4" />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em]">What this means</span>
        </div>
        <div className="rounded-full border border-[#58b684] bg-[#dff7e7] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#0d5847]">Widget</div>
      </div>

      <div className="mt-2 text-[13px] leading-6 text-[#385b53]">
        Storage earns its keep here. The BESS recovers its own cost in {standaloneText} yrs by rescuing excess energy the new banking rules would strand.
        Overall payback moves by {paybackPenalty !== null && paybackPenalty < 0 ? '-' : ''}{penaltyText} yrs.
      </div>
    </div>
  );
}
