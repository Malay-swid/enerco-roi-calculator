export type ProjectType = 'open_access' | 'rooftop_btm';
export type MeterType = 'ht_commercial' | 'ht_industrial';
export type CommercialStructure = 'capex' | 'opex' | 'group_captive' | 'captive';
export type BessDuration = '1' | '2' | '3' | '4' | 'custom';

export interface CommercialInputs {
  projectType: ProjectType;
  solarDcCapacityKwp: number;
  dcRatio: number;
  specificYield: number;
  bessDuration: BessDuration;
  customBessCapacityKwh: number;
  meter: MeterType;
  offPeakTariff: number;
  peakTariff: number;
  bankingStandbyPerKwMonth: number;
  wheelingTransmissionPerKwh: number;
  commercialStructure: CommercialStructure;
  solarCapexPerKwp: number;
  bessCapexPerKwh: number;
  solarExcessPercent: number;
  excessLostToSlotLimitsPercent: number;
  roundTripEfficiencyPercent: number;
  depthOfDischargePercent: number;
  annualBessCycles: number;
  peakShifting: boolean;
  solarCharging: boolean;
  gridCharging: boolean;
}

export interface CommercialResults {
  solarAcCapacityKw: number;
  recommendedAcCapacityKw: number;
  bessCapacityKwh: number;
  bessDurationHours: number;
  annualSolarGenerationKwh: number;
  daytimeLoadOffsetKwh: number;
  excessSolarKwh: number;
  excessSolarLostKwh: number;
  usableSolarKwh: number;
  applicableBankingStandbyPerKwMonth: number;
  bankingStandbyPerKwh: number;
  applicableWheelingTransmissionPerKwh: number;
  solarInvestment: number;
  bessInvestment: number;
  totalInvestment: number;
  outOfPocketInvestment: number;
  usableBessEnergyKwh: number;
  annualBessThroughputKwh: number;
}

export const defaultCommercialInputs: CommercialInputs = {
  projectType: 'rooftop_btm',
  solarDcCapacityKwp: 1000,
  dcRatio: 1.25,
  specificYield: 1400,
  bessDuration: '1',
  customBessCapacityKwh: 800,
  meter: 'ht_commercial',
  offPeakTariff: 12.8,
  peakTariff: 20.8,
  bankingStandbyPerKwMonth: 130,
  wheelingTransmissionPerKwh: 1.95,
  commercialStructure: 'capex',
  solarCapexPerKwp: 33000,
  bessCapexPerKwh: 18000,
  solarExcessPercent: 60,
  excessLostToSlotLimitsPercent: 100,
  roundTripEfficiencyPercent: 90,
  depthOfDischargePercent: 90,
  annualBessCycles: 300,
  peakShifting: true,
  solarCharging: true,
  gridCharging: false,
};

export const meterTariffDefaults: Record<MeterType, { offPeak: number; peak: number }> = {
  ht_commercial: { offPeak: 12.8, peak: 20.8 },
  ht_industrial: { offPeak: 8.8, peak: 12.8 },
};

export const compatibleStructures = (projectType: ProjectType): CommercialStructure[] =>
  projectType === 'open_access' ? ['group_captive', 'captive'] : ['capex', 'opex'];

const safe = (value: number, fallback = 0) => Number.isFinite(value) ? value : fallback;
const nonNegative = (value: number) => Math.max(0, safe(value));
const clampPercent = (value: number) => Math.min(100, nonNegative(value));

export function calculateCommercialScenario(inputs: CommercialInputs): CommercialResults {
  const dc = nonNegative(inputs.solarDcCapacityKwp);
  const ratio = Math.max(0.01, safe(inputs.dcRatio, 1.25));
  const yieldValue = nonNegative(inputs.specificYield);
  const solarAcCapacityKw = dc / ratio;
  const multiplier = inputs.bessDuration === 'custom' ? 0 : Number(inputs.bessDuration);
  const bessCapacityKwh = inputs.bessDuration === 'custom'
    ? nonNegative(inputs.customBessCapacityKwh)
    : solarAcCapacityKw * (Number.isFinite(multiplier) ? multiplier : 1);
  const annualSolarGenerationKwh = dc * yieldValue;
  const excessSolarKwh = annualSolarGenerationKwh * clampPercent(inputs.solarExcessPercent) / 100;
  const daytimeLoadOffsetKwh = annualSolarGenerationKwh - excessSolarKwh;
  const excessSolarLostKwh = excessSolarKwh * clampPercent(inputs.excessLostToSlotLimitsPercent) / 100;
  const usableSolarKwh = annualSolarGenerationKwh - excessSolarLostKwh;
  const applicableBankingStandbyPerKwMonth = inputs.projectType === 'rooftop_btm'
    ? nonNegative(inputs.bankingStandbyPerKwMonth)
    : 0;
  const applicableWheelingTransmissionPerKwh = inputs.projectType === 'open_access'
    ? nonNegative(inputs.wheelingTransmissionPerKwh)
    : 0;
  const bankingStandbyPerKwh = inputs.projectType === 'rooftop_btm' && yieldValue > 0 && dc > 0
    ? (applicableBankingStandbyPerKwMonth * solarAcCapacityKw) / (yieldValue * dc / 12)
    : 0;
  const solarInvestment = dc * nonNegative(inputs.solarCapexPerKwp);
  const bessInvestment = bessCapacityKwh * nonNegative(inputs.bessCapexPerKwh);
  const totalInvestment = solarInvestment + bessInvestment;
  const outOfPocketFactor: Record<CommercialStructure, number> = {
    capex: 1,
    opex: 0,
    group_captive: 0.26,
    captive: 1,
  };
  const usableBessEnergyKwh = bessCapacityKwh
    * clampPercent(inputs.depthOfDischargePercent) / 100
    * clampPercent(inputs.roundTripEfficiencyPercent) / 100;
  return {
    solarAcCapacityKw,
    recommendedAcCapacityKw: solarAcCapacityKw,
    bessCapacityKwh,
    bessDurationHours: solarAcCapacityKw > 0 ? bessCapacityKwh / solarAcCapacityKw : 0,
    annualSolarGenerationKwh,
    daytimeLoadOffsetKwh,
    excessSolarKwh,
    excessSolarLostKwh,
    usableSolarKwh,
    applicableBankingStandbyPerKwMonth,
    bankingStandbyPerKwh,
    applicableWheelingTransmissionPerKwh,
    solarInvestment,
    bessInvestment,
    totalInvestment,
    outOfPocketInvestment: totalInvestment * outOfPocketFactor[inputs.commercialStructure],
    usableBessEnergyKwh,
    annualBessThroughputKwh: usableBessEnergyKwh * nonNegative(inputs.annualBessCycles),
  };
}

export function validateCommercialInputs(inputs: CommercialInputs): Partial<Record<keyof CommercialInputs, string>> {
  const errors: Partial<Record<keyof CommercialInputs, string>> = {};
  const check = (key: keyof CommercialInputs, label: string, value: number, min: number, max?: number) => {
    if (!Number.isFinite(value) || value < min || (max !== undefined && value > max)) {
      errors[key] = `${label} must be ${max === undefined ? `at least ${min}` : `between ${min} and ${max}`}.`;
    }
  };
  check('solarDcCapacityKwp', 'Solar DC capacity', inputs.solarDcCapacityKwp, 0);
  check('dcRatio', 'DC ratio', inputs.dcRatio, 1, 1.5);
  check('specificYield', 'Specific yield', inputs.specificYield, 1200, 1800);
  check('customBessCapacityKwh', 'Custom BESS capacity', inputs.customBessCapacityKwh, 0);
  check('offPeakTariff', 'Off-peak tariff', inputs.offPeakTariff, 0);
  check('peakTariff', 'Peak tariff', inputs.peakTariff, 0);
  check('bankingStandbyPerKwMonth', 'Banking + standby charge', inputs.bankingStandbyPerKwMonth, 0);
  check('wheelingTransmissionPerKwh', 'Wheeling & transmission charge', inputs.wheelingTransmissionPerKwh, 0);
  check('solarCapexPerKwp', 'Solar CAPEX', inputs.solarCapexPerKwp, 25000, 50000);
  check('bessCapexPerKwh', 'BESS CAPEX', inputs.bessCapexPerKwh, 12000, 23000);
  check('solarExcessPercent', 'Solar exceeding daytime load', inputs.solarExcessPercent, 0, 100);
  check('excessLostToSlotLimitsPercent', 'Excess lost to slot limits', inputs.excessLostToSlotLimitsPercent, 0, 100);
  check('roundTripEfficiencyPercent', 'BESS round-trip efficiency', inputs.roundTripEfficiencyPercent, 0, 100);
  check('depthOfDischargePercent', 'Maximum depth of discharge', inputs.depthOfDischargePercent, 0, 100);
  check('annualBessCycles', 'Annual BESS cycles', inputs.annualBessCycles, 0);
  return errors;
}
