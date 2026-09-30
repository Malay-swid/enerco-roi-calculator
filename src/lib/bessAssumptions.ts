export interface BessAssumptions {
  bessOMPercent: number;
  solarOMPercent: number;
  storageFloorUpTo2030: number;
  storageFloorAfter2030: number;
  rooftopCumulativeLimitPercent: number;
  kwPerMW: number;
  kvaPerMW: number;
  kwhPerMWh: number;
  rupeesPerCrore: number;
  demandChargeMonthsPerYear: number;
  monthlyBankingSlots: number;
  bankingCapPercent: number;
  bankingTermYears: number;
  projectLifeYears: number;
  degradationPercent: number;
  minHeadroomMarginMVA: number;
}

export const defaultBessAssumptions: BessAssumptions = {
  bessOMPercent: 0.02,
  solarOMPercent: 0.01,
  storageFloorUpTo2030: 1,
  storageFloorAfter2030: 2,
  rooftopCumulativeLimitPercent: 70,
  kwPerMW: 1000,
  kvaPerMW: 1000,
  kwhPerMWh: 1000,
  rupeesPerCrore: 10000000,
  demandChargeMonthsPerYear: 12,
  monthlyBankingSlots: 24,
  bankingCapPercent: 10,
  bankingTermYears: 3,
  projectLifeYears: 15,
  degradationPercent: 0.02,
  minHeadroomMarginMVA: 0,
};
