import { defaultBessAssumptions, type BessAssumptions } from './bessAssumptions';

export type EssSizingOption = '50_2' | '25_4';
export type ApplicationWindow = 'up_to_2030' | 'after_2030';

export interface BessInputs {
  essSizingOption: EssSizingOption;
  applicationWindow: ApplicationWindow;
  solarCapacityMW: number;
  specificYield: number;
  solarCapexCrPerMWp: number;
  transformerRatingMVA: number;
  gridTariff: number;
  daytimeExcessPercent: number;
  excessLostToSlotLimitsPercent: number;
  bankingStandbyCharge: number;
  bessCapexCrPerMWh: number;
  cyclesPerYear: number;
  roundTripEfficiency: number;
  eveningTODPremium: number;
  demandChargePerKVA: number;
  demandReliefPercent: number;
}

export interface BessResults {
  solarGeneration: number;
  solarCapacity: number;
  bessPower: number;
  bessEnergy: number;
  solarCapex: number;
  bessCapex: number;
  totalCapex: number;
  annualSolarSavings: number;
  annualBessSavings: number;
  annualSavingsSolarOnly: number;
  annualSavingsSolarPlusBess: number;
  bessOM: number;
  solarOnlyPayback: number | null;
  solarPlusBessPayback: number | null;
  bessStandalonePayback: number | null;
  paybackPenalty: number | null;
  annualSelfConsumedSolar: number;
  annualExcessSolar: number;
  annualBessEnergy: number;
  solarOM: number;
  annualSolarSavingsGross: number;
  maxAnnualBessCharging: number;
  eligibleExcessForBess: number;
  actualAnnualBessCharging: number;
  energySavingsFromBess: number;
  incrementalBessSavings: number;
  demandReliefKVA: number;
  allowedRooftopCumulative: number;
  excessAbsorbedPercent: number;
  demandSavings: number;
  bankingSavings: number;
  todSavings: number;
  complianceStatus: boolean;
  transformerHeadroom: number;
  capacityFloor: number;
  requiredStorage: number;
  roi: number;
  irr: number | null;
}

export const defaultBessInputs: BessInputs = {
  essSizingOption: '25_4',
  applicationWindow: 'up_to_2030',
  solarCapacityMW: 10,
  specificYield: 1800,
  solarCapexCrPerMWp: 5,
  transformerRatingMVA: 10,
  gridTariff: 14,
  daytimeExcessPercent: 60,
  excessLostToSlotLimitsPercent: 100,
  bankingStandbyCharge: 4,
  bessCapexCrPerMWh: 2.5,
  cyclesPerYear: 365,
  roundTripEfficiency: 95,
  eveningTODPremium: 3,
  demandChargePerKVA: 900,
  demandReliefPercent: 100,
};

const safeDivide = (numerator: number, denominator: number) => {
  if (Math.abs(denominator) < 1e-9) return 0;
  return numerator / denominator;
};

const calculateIrr = (initialInvestment: number, yearlyCashFlow: number, years: number): number | null => {
  if (yearlyCashFlow <= 0 || initialInvestment <= 0) return null;

  let rate = 0.05;
  let previous = 0;

  for (let iteration = 0; iteration < 200; iteration += 1) {
    previous = rate;
    let npv = -initialInvestment;
    for (let year = 1; year <= years; year += 1) {
      npv += yearlyCashFlow / Math.pow(1 + rate, year);
    }

    if (Math.abs(npv) < 1e-7) return rate;

    const derivative = -initialInvestment * 0;
    if (Number.isNaN(derivative)) break;

    rate = rate + npv / 1000;
    if (Math.abs(rate - previous) < 1e-8) break;
  }

  return rate;
};

export function calculateBessScenario(
  inputs: BessInputs,
  assumptions: BessAssumptions = defaultBessAssumptions,
): BessResults {
  const solarCapacity = Math.max(0, inputs.solarCapacityMW);
  const solarGeneration = solarCapacity * assumptions.kwPerMW * inputs.specificYield;
  const solarCapex = solarCapacity * inputs.solarCapexCrPerMWp;

  const bessPower =
    inputs.essSizingOption === '50_2' ? solarCapacity * 0.5 : solarCapacity * 0.25;
  const bessEnergy =
    inputs.essSizingOption === '50_2' ? bessPower * 2 : bessPower * 4;

  const bessCapex = bessEnergy * inputs.bessCapexCrPerMWh;
  const totalCapex = solarCapex + bessCapex;

  const annualSelfConsumedSolar = solarGeneration * (1 - inputs.daytimeExcessPercent / 100);
  const annualExcessSolar = solarGeneration * (inputs.daytimeExcessPercent / 100);

  const maxAnnualBessCharging = bessEnergy * assumptions.kwhPerMWh * inputs.cyclesPerYear;
  const eligibleExcessForBess = annualExcessSolar * (inputs.excessLostToSlotLimitsPercent / 100);
  const actualAnnualBessCharging = Math.min(eligibleExcessForBess, maxAnnualBessCharging);
  const deliveredEnergy = actualAnnualBessCharging * (inputs.roundTripEfficiency / 100);

  const solarOM = solarCapex * assumptions.solarOMPercent;
  const bessOM = bessCapex * assumptions.bessOMPercent;

  const annualSolarSavingsGross = (annualSelfConsumedSolar * inputs.gridTariff) / assumptions.rupeesPerCrore;
  const energySavingsFromBess =
    (deliveredEnergy * (inputs.gridTariff + inputs.eveningTODPremium)) / assumptions.rupeesPerCrore;

  const demandReliefKVA = bessPower * assumptions.kvaPerMW * (inputs.demandReliefPercent / 100);
  const demandSavings =
    (demandReliefKVA * inputs.demandChargePerKVA * assumptions.demandChargeMonthsPerYear) /
    assumptions.rupeesPerCrore;
  const bankingSavings = 0;
  const todSavings = (deliveredEnergy * inputs.eveningTODPremium) / assumptions.rupeesPerCrore;

  const annualSavingsSolarOnly = annualSolarSavingsGross - solarOM;
  const incrementalBessSavings = energySavingsFromBess + demandSavings - bessOM;
  const annualSavingsSolarPlusBess = annualSavingsSolarOnly + incrementalBessSavings;

  const solarOnlyPayback = annualSavingsSolarOnly > 0 ? solarCapex / annualSavingsSolarOnly : null;
  const solarPlusBessPayback = annualSavingsSolarPlusBess > 0 ? totalCapex / annualSavingsSolarPlusBess : null;
  const bessStandalonePayback = incrementalBessSavings > 0 ? bessCapex / incrementalBessSavings : null;
  const paybackPenalty =
    solarOnlyPayback !== null && solarPlusBessPayback !== null
      ? solarOnlyPayback - solarPlusBessPayback
      : null;

  const capacityFloor =
    inputs.applicationWindow === 'up_to_2030'
      ? assumptions.storageFloorUpTo2030 * solarCapacity
      : assumptions.storageFloorAfter2030 * solarCapacity;

  const requiredStorage = capacityFloor;
  const complianceStatus = bessEnergy >= requiredStorage;
  const allowedRooftopCumulative =
    (assumptions.rooftopCumulativeLimitPercent / 100) * inputs.transformerRatingMVA;
  const transformerHeadroom = solarCapacity - allowedRooftopCumulative;

  const excessAbsorbedPercent =
    annualExcessSolar > 0 ? (actualAnnualBessCharging / annualExcessSolar) * 100 : 0;

  const roi = totalCapex > 0 ? (annualSavingsSolarPlusBess / totalCapex) * 100 : 0;
  const irr = calculateIrr(totalCapex, annualSavingsSolarPlusBess, assumptions.projectLifeYears) ?? null;

  return {
    solarGeneration,
    solarCapacity,
    bessPower,
    bessEnergy,
    solarCapex,
    bessCapex,
    totalCapex,
    annualSolarSavings: annualSolarSavingsGross,
    annualBessSavings: incrementalBessSavings,
    annualSavingsSolarOnly,
    annualSavingsSolarPlusBess,
    bessOM,
    solarOM,
    annualSolarSavingsGross,
    maxAnnualBessCharging,
    eligibleExcessForBess,
    actualAnnualBessCharging,
    energySavingsFromBess,
    incrementalBessSavings,
    demandReliefKVA,
    allowedRooftopCumulative,
    solarOnlyPayback,
    solarPlusBessPayback,
    bessStandalonePayback,
    paybackPenalty,
    annualSelfConsumedSolar,
    annualExcessSolar,
    annualBessEnergy: deliveredEnergy,
    excessAbsorbedPercent,
    demandSavings,
    bankingSavings,
    todSavings,
    complianceStatus,
    transformerHeadroom,
    capacityFloor,
    requiredStorage,
    roi,
    irr,
  };
}

export function getScenarioSummary(inputs: BessInputs) {
  const results = calculateBessScenario(inputs, defaultBessAssumptions);
  return {
    ...results,
    formattedSolarGeneration: `${(results.solarGeneration / 1000000).toFixed(2)} MU/yr`,
    formattedSolarCapex: `₹${results.solarCapex.toFixed(2)} Cr`,
    formattedBessCapex: `₹${results.bessCapex.toFixed(2)} Cr`,
  };
}

export const clampPercent = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
export const safeNumber = (value: number, fallback = 0) => Number.isFinite(value) ? value : fallback;
export const formatCurrencyCr = (value: number) => `₹${safeNumber(value, 0).toFixed(2)} Cr`;
export const formatMu = (value: number) => `${(value / 1000000).toFixed(2)} MU/yr`;
export const formatYears = (value: number | null) => value === null ? 'N/A' : `${value.toFixed(1)} yrs`;

export const annualSavingsBreakdown = (results: BessResults) => ({
  selfConsumed: results.annualSolarSavings,
  bessShift: results.annualBessSavings,
  demand: results.demandSavings,
  banked: results.bankingSavings,
  today: results.todSavings,
  om: results.bessOM,
});
