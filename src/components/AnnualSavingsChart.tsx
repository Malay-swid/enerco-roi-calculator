import React from 'react';

interface AnnualSavingsChartProps {
  solarOnlySavings: number;
  solarPlusBessSavings: number;
  annualExcessSolar: number;
  solarGeneration: number;
  bankedExcessSavings: number;
  bessTimeShiftSavings: number;
  demandSavings: number;
  excessAbsorbedPercent: number;
  bessOM: number;
}

export function AnnualSavingsChart({
  solarOnlySavings,
  solarPlusBessSavings,
  annualExcessSolar,
  solarGeneration,
  bankedExcessSavings,
  bessTimeShiftSavings,
  demandSavings,
  excessAbsorbedPercent,
  bessOM,
}: AnnualSavingsChartProps) {
  const maxValue = Math.max(solarOnlySavings, solarPlusBessSavings, 1);
  const solarOnlyWidth = Math.max(0, (solarOnlySavings / maxValue) * 100);
  const solarPlusBessSegments = [
    { color: '#078b0b', value: Math.max(0, solarOnlySavings) },
    { color: '#9fd3a1', value: Math.max(0, bankedExcessSavings) },
    { color: '#075808', value: Math.max(0, bessTimeShiftSavings) },
    { color: '#818b80', value: Math.max(0, demandSavings) },
  ];
  const solarPlusBessSegmentTotal = solarPlusBessSegments.reduce((total, segment) => total + segment.value, 0);
  const scaleFactor = solarPlusBessSegmentTotal > 0 ? solarPlusBessSavings / solarPlusBessSegmentTotal : 0;

  return (
    <section className="rounded-[14px] border-2 border-[#dce7dc] bg-white px-5 py-6 md:px-9 md:py-8">
      <div className="mb-5 flex flex-col gap-4 xl:mb-7 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-[22px] font-extrabold leading-tight text-[#1e2d20] md:text-[32px]">
          Annual savings, year 1, net of O&amp;M
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-[#626d63] md:gap-x-6 md:text-[18px]">
          {[
            ['#078b0b', 'Self-consumed solar'],
            ['#9fd3a1', 'Banked excess'],
            ['#075808', 'BESS time-shift'],
            ['#818b80', 'Demand relief'],
          ].map(([color, label]) => (
            <span className="inline-flex items-center gap-2" key={label}>
              <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-[minmax(105px,0.2fr)_minmax(0,1fr)_auto] items-center gap-3 md:gap-5">
          <span className="text-[15px] font-extrabold text-[#1e2d20] md:text-[24px]">Solar only</span>
          <div className="h-8 min-w-0 overflow-hidden rounded-[7px] bg-[#edf1ec] md:h-[52px]">
            <div className="h-full rounded-l-[7px] bg-[#078b0b]" style={{ width: `${solarOnlyWidth}%` }} />
          </div>
          <span className="min-w-[86px] text-right text-[16px] font-extrabold text-[#1e2d20] md:min-w-[120px] md:text-[24px]">
            ₹{solarOnlySavings.toFixed(2)} Cr
          </span>
        </div>

        <div className="grid grid-cols-[minmax(105px,0.2fr)_minmax(0,1fr)_auto] items-center gap-3 md:gap-5">
          <span className="text-[15px] font-extrabold text-[#1e2d20] md:text-[24px]">Solar + BESS</span>
          <div className="flex h-8 min-w-0 overflow-hidden rounded-[7px] bg-[#edf1ec] md:h-[52px]">
            {solarPlusBessSegments.map((segment) => (
              <div
                className="h-full shrink-0 border-r-2 border-white last:border-r-0"
                key={segment.color}
                style={{
                  backgroundColor: segment.color,
                  width: `${Math.max(0, (segment.value * scaleFactor / maxValue) * 100)}%`,
                }}
              />
            ))}
          </div>
          <span className="min-w-[86px] text-right text-[16px] font-extrabold text-[#1e2d20] md:min-w-[120px] md:text-[24px]">
            ₹{solarPlusBessSavings.toFixed(2)} Cr
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-[#e4ebe3] pt-4 md:mt-7 md:grid-cols-4 md:gap-6 md:pt-6">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#626d63] md:text-[17px]">Solar generation</div>
          <div className="mt-1 text-[18px] font-extrabold text-[#1e2d20] md:text-[26px]">{(solarGeneration / 1000000).toFixed(2)} MU/yr</div>
        </div>
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#626d63] md:text-[17px]">Excess over load</div>
          <div className="mt-1 text-[18px] font-extrabold text-[#1e2d20] md:text-[26px]">{(annualExcessSolar / 1000000).toFixed(2)} MU/yr</div>
        </div>
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#626d63] md:text-[17px]">Excess absorbed by BESS</div>
          <div className="mt-1 text-[18px] font-extrabold text-[#1e2d20] md:text-[26px]">{excessAbsorbedPercent.toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#626d63] md:text-[17px]">BESS O&amp;M (2% capex)</div>
          <div className="mt-1 text-[18px] font-extrabold text-[#1e2d20] md:text-[26px]">₹{bessOM.toFixed(2)} Cr/yr</div>
        </div>
      </div>
    </section>
  );
}
