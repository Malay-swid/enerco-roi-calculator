import React from 'react';
import { SliderInput } from './SliderInput';
import { OptionToggle } from './OptionToggle';
import { type BessInputs } from '../lib/bessCalculator';

interface CalculatorSidebarProps {
  inputs: BessInputs;
  onInputChange: <K extends keyof BessInputs>(field: K, value: BessInputs[K]) => void;
}

const sliderFields = [
  { label: 'Solar capacity', field: 'solarCapacityMW', min: 0.5, max: 100, step: 0.5, suffix: 'MW' },
  { label: 'Specific yield', field: 'specificYield', min: 900, max: 2200, step: 10, suffix: 'kWh/kWp' },
  { label: 'Solar capex', field: 'solarCapexCrPerMWp', min: 1, max: 12, step: 0.5, suffix: 'Cr/MWp' },
  { label: 'Transformer / feeder rating', field: 'transformerRatingMVA', min: 1, max: 25, step: 0.5, suffix: 'MVA' },
  { label: 'Landed grid tariff', field: 'gridTariff', min: 4, max: 30, step: 0.5, suffix: '₹/kWh' },
  { label: 'Solar exceeding daytime load', field: 'daytimeExcessPercent', min: 5, max: 100, step: 5, suffix: '%' },
  { label: 'Excess lost to slot limits', field: 'excessLostToSlotLimitsPercent', min: 0, max: 100, step: 5, suffix: '%' },
  { label: 'Banking + standby charge', field: 'bankingStandbyCharge', min: 0, max: 12, step: 0.5, suffix: '₹/kWh' },
  { label: 'BESS capex', field: 'bessCapexCrPerMWh', min: 0.5, max: 12, step: 0.5, suffix: 'Cr/MWh' },
  { label: 'Cycles per year', field: 'cyclesPerYear', min: 100, max: 365, step: 5 },
  { label: 'Round-trip efficiency', field: 'roundTripEfficiency', min: 60, max: 100, step: 1, suffix: '%' },
  { label: 'Evening ToD premium', field: 'eveningTODPremium', min: 0, max: 12, step: 0.5, suffix: '₹/kWh' },
  { label: 'Demand charge', field: 'demandChargePerKVA', min: 200, max: 1600, step: 50, suffix: '₹/kVA' },
  { label: 'Demand relief realised', field: 'demandReliefPercent', min: 0, max: 100, step: 5, suffix: '%' },
] as const;

export function CalculatorSidebar({ inputs, onInputChange }: CalculatorSidebarProps) {
  return (
    <aside className="border-b border-[#d8e0d7] bg-[#f7f7f5] p-3 lg:border-b-0 lg:border-r">
      <div className="space-y-4">
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#586f66]">ESS sizing option</div>
          <OptionToggle
            items={[
              { label: '50% × 2 h', helper: 'Higher power, demand relief', value: '50_2' },
              { label: '25% × 4 h', helper: 'Lower power, longer shift', value: '25_4' },
            ]}
            selected={inputs.essSizingOption}
            onSelect={(value) => onInputChange('essSizingOption', value as BessInputs['essSizingOption'])}
          />
        </div>

        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#586f66]">Application window</div>
          <OptionToggle
            items={[
              { label: 'Up to 2030', helper: 'Floor 1 MWh / MW', value: 'up_to_2030' },
              { label: 'After 2030', helper: 'Floor 2 MWh / MW', value: 'after_2030' },
            ]}
            selected={inputs.applicationWindow}
            onSelect={(value) => onInputChange('applicationWindow', value as BessInputs['applicationWindow'])}
          />
        </div>

        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#586f66]">Project</div>
          <div className="space-y-3">
            {sliderFields.slice(0, 4).map((slider) => (
              <SliderInput
                key={slider.field}
                label={slider.label}
                value={Number(inputs[slider.field as keyof BessInputs])}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                suffix={slider.suffix}
                onChange={(value) => onInputChange(slider.field as keyof BessInputs, value as never)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#586f66]">Tariff & banking</div>
          <div className="space-y-3">
            {sliderFields.slice(4, 8).map((slider) => (
              <SliderInput
                key={slider.field}
                label={slider.label}
                value={Number(inputs[slider.field as keyof BessInputs])}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                suffix={slider.suffix}
                onChange={(value) => onInputChange(slider.field as keyof BessInputs, value as never)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#586f66]">Storage</div>
          <div className="space-y-3">
            {sliderFields.slice(8).map((slider) => (
              <SliderInput
                key={slider.field}
                label={slider.label}
                value={Number(inputs[slider.field as keyof BessInputs])}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                suffix={slider.suffix}
                onChange={(value) => onInputChange(slider.field as keyof BessInputs, value as never)}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
