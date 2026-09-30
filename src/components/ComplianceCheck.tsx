import React from 'react';

interface ComplianceCheckProps {
  complianceStatus: boolean;
  requiredStorage: number;
  bessPower: number;
  bessEnergy: number;
  transformerHeadroom: number;
  solarCapacity: number;
  transformerRatingMVA: number;
  applicationWindow: 'up_to_2030' | 'after_2030';
}

export function ComplianceCheck({
  complianceStatus,
  requiredStorage,
  bessPower,
  bessEnergy,
  transformerHeadroom,
  solarCapacity,
  transformerRatingMVA,
  applicationWindow,
}: ComplianceCheckProps) {
  const storageMandatory = solarCapacity > 0.1;
  const storageFloorDescription = applicationWindow === 'up_to_2030'
    ? '1 MWh per MW sanctioned connectivity (to 2030)'
    : '2 MWh per MW sanctioned connectivity';

  return (
    <section className="rounded-[16px] border-2 border-[#dce7dc] bg-white px-5 py-6 md:px-5 md:py-7 2xl:px-10 2xl:py-8">
      <h2 className="mb-5 text-[25px] font-extrabold leading-tight text-[#1e2d20] md:mb-6 2xl:mb-7 2xl:text-[32px]">
        Compliance check
      </h2>

      <div className="divide-y divide-[#e4ebe3]">
        <div className="flex flex-col items-start gap-2 py-4 first:pt-0 md:flex-row md:items-center md:justify-between md:gap-4 md:py-5">
          <div className="min-w-0">
            <div className="text-[18px] leading-snug text-[#344136] xl:text-[20px] 2xl:text-[28px]">Storage mandatory?</div>
            <div className="mt-1 text-[15px] leading-snug text-[#626d63] xl:text-[16px] 2xl:text-[24px]">
              New rooftop, BTM or grid-interactive OA above 100 kW
            </div>
          </div>
          <span className={`shrink-0 rounded-[8px] px-3 py-2 text-[16px] font-extrabold xl:text-[17px] 2xl:px-4 2xl:text-[24px] ${storageMandatory ? 'bg-[#fbe7e4] text-[#a52d20]' : 'bg-[#eef1ed] text-[#344136]'}`}>
            {storageMandatory ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="flex flex-col items-start gap-2 py-4 md:flex-row md:items-center md:justify-between md:gap-4 md:py-5">
          <div className="min-w-0">
            <div className="text-[18px] leading-snug text-[#344136] xl:text-[20px] 2xl:text-[28px]">Option sizing</div>
            <div className="mt-1 text-[15px] leading-snug text-[#626d63] xl:text-[16px] 2xl:text-[24px]">
              {((bessPower / Math.max(solarCapacity, 0.001)) * 100).toFixed(0)}% of RE capacity × {bessEnergy / Math.max(bessPower, 0.001)} h
            </div>
          </div>
          <span className="shrink-0 rounded-[8px] bg-[#eef1ed] px-3 py-2 text-right text-[15px] font-extrabold text-[#253226] xl:text-[16px] 2xl:px-4 2xl:text-[24px]">
            {bessPower.toFixed(2)} MW / {bessEnergy.toFixed(2)} MWh
          </span>
        </div>

        <div className="flex flex-col items-start gap-2 py-4 md:flex-row md:items-center md:justify-between md:gap-4 md:py-5">
          <div className="min-w-0">
            <div className="text-[18px] leading-snug text-[#344136] xl:text-[20px] 2xl:text-[28px]">Capacity floor</div>
            <div className="mt-1 text-[15px] leading-snug text-[#626d63] xl:text-[16px] 2xl:text-[24px]">{storageFloorDescription}</div>
          </div>
          <span className="shrink-0 rounded-[8px] bg-[#eef1ed] px-3 py-2 text-[15px] font-extrabold text-[#253226] xl:text-[16px] 2xl:px-4 2xl:text-[24px]">
            {requiredStorage.toFixed(2)} MWh
          </span>
        </div>

        <div className="flex flex-col items-start gap-2 py-4 md:flex-row md:items-center md:justify-between md:gap-4 md:py-5">
          <div className="min-w-0">
            <div className="text-[18px] leading-snug text-[#344136] xl:text-[20px] 2xl:text-[28px]">Storage to install</div>
            <div className="mt-1 text-[15px] leading-snug text-[#626d63] xl:text-[16px] 2xl:text-[24px]">
              {complianceStatus ? 'Option sizing meets the floor' : 'Option sizing is below the floor'}
            </div>
          </div>
          <span className={`shrink-0 rounded-[8px] px-3 py-2 text-right text-[15px] font-extrabold xl:text-[16px] 2xl:px-4 2xl:text-[24px] ${complianceStatus ? 'bg-[#e5f3e5] text-[#176d1c]' : 'bg-[#fbe7e4] text-[#a52d20]'}`}>
            {bessPower.toFixed(2)} MW / {bessEnergy.toFixed(2)} MWh
          </span>
        </div>

        <div className="flex flex-col items-start gap-2 py-4 last:pb-0 md:flex-row md:items-center md:justify-between md:gap-4 md:py-5">
          <div className="min-w-0">
            <div className="text-[18px] leading-snug text-[#344136] xl:text-[20px] 2xl:text-[28px]">Transformer headroom</div>
            <div className="mt-1 text-[15px] leading-snug text-[#626d63] xl:text-[16px] 2xl:text-[24px]">
              70% of {transformerRatingMVA.toFixed(1)} MVA = {(transformerRatingMVA * 0.7).toFixed(2)} MW cumulative rooftop
            </div>
          </div>
          <span className={`shrink-0 rounded-[8px] px-3 py-2 text-right text-[15px] font-extrabold xl:text-[16px] 2xl:px-4 2xl:text-[24px] ${transformerHeadroom > 0 ? 'bg-[#fbe7e4] text-[#a52d20]' : 'bg-[#e5f3e5] text-[#176d1c]'}`}>
            {transformerHeadroom > 0
              ? `Over by ${transformerHeadroom.toFixed(2)} MW`
              : `Within by ${Math.abs(transformerHeadroom).toFixed(2)} MW`}
          </span>
        </div>
      </div>
    </section>
  );
}
