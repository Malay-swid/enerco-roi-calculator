import React from 'react';

interface BankingRegimeProps {
  monthlySlots: string;
  capPerSlot: string;
  sunset: string;
  sizeBand: string;
  intro: string;
  text: string;
}

export function BankingRegime({ monthlySlots, capPerSlot, sunset, sizeBand, intro, text }: BankingRegimeProps) {
  return (
    <section className="h-full rounded-[16px] border-2 border-[#dce8f3] bg-white px-5 py-6 md:px-5 md:py-7 2xl:px-10 2xl:py-8">
      <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-7">
        <h2 className="text-[22px] font-extrabold leading-tight text-[#0f172a] xl:text-[20px] 2xl:text-[32px]">
          Banking regime for this size
        </h2>
        <span className="shrink-0 rounded-[8px] bg-[#e5f0fa] px-3 py-2 text-[15px] font-extrabold text-[#0f61ab] xl:text-[15px] 2xl:px-4 2xl:text-[24px]">
          {sizeBand}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-3 2xl:gap-4">
        <div className="rounded-[12px] bg-[#f1f6fb] px-3 py-4 md:px-3 2xl:px-6 2xl:py-5">
          <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748b] xl:text-[14px] 2xl:text-[22px]">Monthly slots</div>
          <div className="mt-1 text-[28px] font-extrabold leading-tight text-[#0f172a] xl:text-[30px] 2xl:text-[44px]">{monthlySlots}</div>
        </div>
        <div className="rounded-[12px] bg-[#f1f6fb] px-3 py-4 md:px-3 2xl:px-6 2xl:py-5">
          <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748b] xl:text-[14px] 2xl:text-[22px]">Cap per slot</div>
          <div className="mt-1 text-[28px] font-extrabold leading-tight text-[#0f172a] xl:text-[30px] 2xl:text-[44px]">{capPerSlot}</div>
        </div>
        <div className="rounded-[12px] bg-[#f1f6fb] px-3 py-4 md:px-3 2xl:px-6 2xl:py-5">
          <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748b] xl:text-[14px] 2xl:text-[22px]">Sunset</div>
          <div className="mt-1 text-[28px] font-extrabold leading-tight text-[#0f172a] xl:text-[30px] 2xl:text-[44px]">{sunset}</div>
        </div>
      </div>

      <p className="mt-5 text-[17px] leading-[1.5] text-[#334155] xl:text-[18px] 2xl:text-[28px]">
        {intro}
      </p>
      <p className="mt-3 text-[15px] leading-[1.5] text-[#64748b] xl:text-[16px] 2xl:text-[24px]">
        {text}
      </p>
    </section>
  );
}
