import type { CommercialInputs, CommercialResults } from './commercialCalculator';

export type FinancialModelId = 'capex' | 'opex' | 'captive_oa' | 'group_captive';
export type FinancialIrr = number | 'infinite' | null;

export interface FinancialModelResult {
  id: FinancialModelId;
  label: string;
  initialInvestment: number;
  roiPaybackMonths: number | null;
  irr: FinancialIrr;
  cumulativeSavings: number;
  cashFlows: number[];
}

export const financialModelAssumptions = {
  projectYears: 20,
  rooftopGenerationKwhPerKwp: 1400,
  openAccessGenerationKwhPerKwp: 1600,
  offPeakTariffPerKwh: 8.8,
  peakTariffPerKwh: 12.8,
  openAccessTransmissionLossPercent: 11,
  wheelingTransmissionPerKwh: 1.95,
  fixedBankingPerKwMonth: 130,
  solarDegradationPercent: 0.6,
  bessDegradationPercent: 1,
  tariffEscalationPercent: 1,
  chargeEfficiencyPercent: 93.8,
  dischargeEfficiencyPercent: 93.8,
  depthOfDischargePercent: 90,
  solarOmPerKwp: 500,
  bessOmPerKwh: 200,
  annualOmEscalationPercent: 3,
  annualInsurancePercent: 0.5,
  ppaTenureYears: 15,
  opexPpaPerKwh: 7,
  groupCaptivePpaPerKwh: 5,
  groupCaptiveOutOfPocketPercent: 26,
} as const;

const safeNonNegative = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;

function modelIrr(cashFlows: number[]): number | null {
  if (cashFlows.length < 2 || cashFlows[0] >= 0) return null;

  const npv = (rate: number) => cashFlows.reduce((sum, flow, year) => sum + flow / ((1 + rate) ** year), 0);
  let low = -0.9999;
  let high = 1;
  let lowNpv = npv(low);
  let highNpv = npv(high);

  while (highNpv > 0 && high < 1_000_000) {
    high *= 2;
    highNpv = npv(high);
  }
  if (!Number.isFinite(lowNpv) || !Number.isFinite(highNpv) || lowNpv * highNpv > 0) return null;

  for (let i = 0; i < 160; i += 1) {
    const middle = (low + high) / 2;
    const middleNpv = npv(middle);
    if (!Number.isFinite(middleNpv)) return null;
    if (Math.abs(middleNpv) < 0.01) return middle;
    if (middleNpv > 0) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

function paybackMonths(cashFlows: number[]): number | null {
  let cumulative = 0;
  for (let year = 0; year < cashFlows.length; year += 1) {
    const previous = cumulative;
    cumulative += cashFlows[year];
    if (year > 0 && previous < 0 && cumulative >= 0) {
      const fraction = cumulative === previous ? 0 : -previous / (cumulative - previous);
      return ((year - 1) + fraction) * 12;
    }
  }
  return null;
}

export function calculateFinancialModels(
  inputs: CommercialInputs,
  currentResults: CommercialResults,
): FinancialModelResult[] {
  const assumptions = financialModelAssumptions;
  const dcKwp = safeNonNegative(inputs.solarDcCapacityKwp);
  const bessKwh = safeNonNegative(currentResults.bessCapacityKwh);
  const totalCapex = dcKwp * safeNonNegative(inputs.solarCapexPerKwp)
    + bessKwh * safeNonNegative(inputs.bessCapexPerKwh);
  const acKw = safeNonNegative(currentResults.solarAcCapacityKw);
  const dod = assumptions.depthOfDischargePercent / 100;
  const dischargeEfficiency = assumptions.dischargeEfficiencyPercent / 100;
  const annualChargeEnergy = dischargeEfficiency > 0
    ? bessKwh * dod / dischargeEfficiency * 365
    : 0;
  const annualDischargedEnergy = bessKwh * dod * dischargeEfficiency * 365;
  const baseOffPeakUnits = dcKwp * assumptions.rooftopGenerationKwhPerKwp - annualChargeEnergy;
  const oaOffPeakUnits = dcKwp * assumptions.openAccessGenerationKwhPerKwp
    * (1 - assumptions.openAccessTransmissionLossPercent / 100) - annualChargeEnergy;
  const basePeakUnits = annualDischargedEnergy;
  const initialInvestment: Record<FinancialModelId, number> = {
    capex: totalCapex,
    opex: 0,
    captive_oa: totalCapex,
    group_captive: totalCapex * assumptions.groupCaptiveOutOfPocketPercent / 100,
  };
  const models: Array<{ id: FinancialModelId; label: string }> = [
    { id: 'capex', label: 'CAPEX' },
    { id: 'opex', label: 'OPEX' },
    { id: 'captive_oa', label: 'Captive OA' },
    { id: 'group_captive', label: 'Group Captive' },
  ];

  return models.map(({ id, label }) => {
    const openAccess = id === 'captive_oa' || id === 'group_captive';
    const solarYield = openAccess ? assumptions.openAccessGenerationKwhPerKwp : assumptions.rooftopGenerationKwhPerKwp;
    const yearOneGeneration = dcKwp * solarYield
      * (openAccess ? 1 - assumptions.openAccessTransmissionLossPercent / 100 : 1);
    const offPeakUnits = id === 'captive_oa' ? oaOffPeakUnits : baseOffPeakUnits;
    const operatingCashFlows: number[] = [];

    for (let year = 1; year <= assumptions.projectYears; year += 1) {
      // The workbook's Group Captive row uses its OA-adjusted generation in year 1,
      // then links years 2-20 to the CAPEX generation rows. Preserve that reference.
      const generationBase = id === 'group_captive' && year > 1
        ? dcKwp * assumptions.rooftopGenerationKwhPerKwp
        : yearOneGeneration;
      const generation = generationBase * (1 - assumptions.solarDegradationPercent / 100) ** (year - 1);
      const degradationAdjustedPeakUnits = basePeakUnits
        * (1 - assumptions.bessDegradationPercent / 100) ** (year - 1);
      const tariffEscalation = (1 + assumptions.tariffEscalationPercent / 100) ** (year - 1);
      const offPeakSavings = offPeakUnits * assumptions.offPeakTariffPerKwh * tariffEscalation;
      const peakSavings = degradationAdjustedPeakUnits * assumptions.peakTariffPerKwh * tariffEscalation;
      const wheelingCharge = openAccess ? generation * assumptions.wheelingTransmissionPerKwh : 0;
      const fixedBankingCharge = openAccess ? 0 : acKw * 12 * assumptions.fixedBankingPerKwMonth;
      const ppaRate = id === 'opex'
        ? assumptions.opexPpaPerKwh
        : id === 'group_captive' ? assumptions.groupCaptivePpaPerKwh : 0;
      const ppaPayment = ppaRate > 0 && year <= assumptions.ppaTenureYears ? generation * ppaRate : 0;
      const ppaCoversOperatingCosts = (id === 'opex' || id === 'group_captive') && year <= assumptions.ppaTenureYears;
      const omEscalation = (1 + assumptions.annualOmEscalationPercent / 100) ** (year - 1);
      const solarOm = ppaCoversOperatingCosts ? 0 : dcKwp * assumptions.solarOmPerKwp * omEscalation;
      const bessOm = ppaCoversOperatingCosts ? 0 : bessKwh * assumptions.bessOmPerKwh * omEscalation;
      const insurance = ppaCoversOperatingCosts ? 0 : totalCapex * assumptions.annualInsurancePercent / 100;
      const netCashFlow = offPeakSavings + peakSavings - wheelingCharge - fixedBankingCharge
        - ppaPayment - solarOm - bessOm - insurance;
      operatingCashFlows.push(Number.isFinite(netCashFlow) ? netCashFlow : 0);
    }

    const investment = initialInvestment[id];
    const cashFlows = [-investment, ...operatingCashFlows];
    const cumulativeSavings = cashFlows.reduce((sum, amount) => sum + amount, 0);
    return {
      id,
      label,
      initialInvestment: investment,
      roiPaybackMonths: id === 'opex' ? 0 : paybackMonths(cashFlows),
      irr: id === 'opex' ? 'infinite' : modelIrr(cashFlows),
      cumulativeSavings,
      cashFlows,
    };
  });
}
