import React, { useMemo, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { CalculatorSidebar } from '../components/CalculatorSidebar';
import { ResultCard } from '../components/ResultCard';
import { Header } from '../components/Header';
import { ComplianceCheck } from '../components/ComplianceCheck';
import { BankingRegime } from '../components/BankingRegime';
import { AnnualSavingsChart } from '../components/AnnualSavingsChart';
import { MeaningBanner } from '../components/MeaningBanner';
import { ReportForm } from '../components/ReportForm';
import { Footer } from '../components/Footer';
import { defaultBessAssumptions } from '../lib/bessAssumptions';
import { calculateBessScenario, defaultBessInputs, type BessInputs } from '../lib/bessCalculator';

const currencyCr = (value: number) => `₹${value.toFixed(2)} Cr`;
const formatYears = (value: number | null) => (value === null ? 'N/A' : `${value.toFixed(1)} yrs`);

export default function Home() {
  const [inputs, setInputs] = useState<BessInputs>(defaultBessInputs);
  const [chatOpen, setChatOpen] = useState(false);
  const results = useMemo(() => calculateBessScenario(inputs, defaultBessAssumptions), [inputs]);
  const showDebug = import.meta.env.DEV;
  const bankingDisplay = inputs.solarCapacityMW < 1
    ? { sizeBand: '500 kW - 1 MW', monthlySlots: '8', capPerSlot: 'None', sunset: 'None', slotWord: 'Eight' }
    : inputs.solarCapacityMW <= 5
      ? { sizeBand: '1 - 5 MW', monthlySlots: '12', capPerSlot: 'None', sunset: 'None', slotWord: 'Twelve' }
      : { sizeBand: '> 5 MW', monthlySlots: '24', capPerSlot: '10%', sunset: '3 yrs', slotWord: 'Twenty-four' };

  const updateInput = <K extends keyof BessInputs>(field: K, value: BessInputs[K]) => {
    setInputs((previous) => ({ ...previous, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#dfe9e2] px-2 py-2 text-[#112b25] sm:px-3 sm:py-4 md:px-5">
      <div className="mx-auto max-w-[1760px] overflow-hidden border border-[#bfd0c3] bg-[#f4f4f2] shadow-[0_10px_25px_rgba(15,23,42,0.08)]">
        <Header />

        <div className="bg-[#edf7ef] px-4 pb-3 pt-2">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#0f5e47]">
                SWID ENERGY SOLUTIONS · REGULATORY IMPACT CALCULATOR
              </div>
              <h1 className="max-w-[780px] text-[18px] font-black leading-[1.15] text-[#163a2f] md:text-[28px]">
                Maharashtra&apos;s draft storage mandate: what it does to your solar payback
              </h1>
              <p className="mt-2 text-[12px] text-[#46675c]">
                Independent advisory since 2009. No hardware sales, no EPC, no vendor commissions.
              </p>
            </div>

            <div className="rounded-[4px] border border-[#bfe0ca] bg-[#ecf8f1] px-2 py-1.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f5e47] sm:mt-1 sm:text-right">
              <div>MERC DRAFT · 22 SEP 2026</div>
              <div className="mt-1 text-[9px] normal-case tracking-[0] text-[#4f675f]">Public comments close 15 Oct 2026</div>
            </div>
          </div>
        </div>

        <main className="grid min-w-0 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="order-1 min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <CalculatorSidebar inputs={inputs} onInputChange={updateInput} />
          </div>

          <div className="order-2 min-w-0 bg-[#f1f4f1] p-2 sm:p-3 lg:col-start-2 lg:row-start-1">
            <div className="bg-[#0f7a57] px-3 py-3 text-white">
              <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 md:gap-3 xl:grid-cols-4">
                <ResultCard
                  label="Solar-only payback"
                  value={formatYears(results.solarOnlyPayback)}
                  subtitle="Reference only: not allowed above 100 kW"
                  highlight
                />
                <ResultCard
                  label="Solar + BESS payback"
                  value={formatYears(results.solarPlusBessPayback)}
                  subtitle={`₹${results.totalCapex.toFixed(2)} Cr total capex`}
                  dark
                />
                <ResultCard
                  label="Payback penalty"
                  value={`${results.paybackPenalty !== null ? `${results.paybackPenalty >= 0 ? '+' : ''}${results.paybackPenalty.toFixed(1)} yrs` : 'N/A'}`}
                  subtitle="Cost of the storage mandate"
                />
                <ResultCard
                  label="BESS on its own"
                  value={formatYears(results.bessStandalonePayback)}
                  subtitle={currencyCr(results.bessOM)}
                />
              </div>
            </div>
          </div>

          <section className="order-3 min-w-0 bg-[#f1f4f1] p-2 sm:p-3 lg:col-start-2 lg:row-start-2">
            <div className="space-y-4">
              <div className="grid min-w-0 gap-4 xl:grid-cols-2">
                <ComplianceCheck
                  complianceStatus={results.complianceStatus}
                  requiredStorage={results.requiredStorage}
                  bessPower={results.bessPower}
                  bessEnergy={results.bessEnergy}
                  transformerHeadroom={results.transformerHeadroom}
                  solarCapacity={results.solarCapacity}
                  transformerRatingMVA={inputs.transformerRatingMVA}
                  applicationWindow={inputs.applicationWindow}
                />

                <BankingRegime
                  monthlySlots={bankingDisplay.monthlySlots}
                  capPerSlot={bankingDisplay.capPerSlot}
                  sunset={bankingDisplay.sunset}
                  sizeBand={bankingDisplay.sizeBand}
                  intro={`${bankingDisplay.slotWord} banking slots a month. Excess outside those windows is at risk, which is what the storage is meant to absorb.`}
                  text="Fixed and variable banking and standby charges apply to every project above 10 kW. Rates aren't published in the draft yet; the banking charge slider stands in for them."
                />
              </div>

              <AnnualSavingsChart
                solarOnlySavings={results.annualSavingsSolarOnly}
                solarPlusBessSavings={results.annualSavingsSolarPlusBess}
                annualExcessSolar={results.annualExcessSolar}
                solarGeneration={results.solarGeneration}
                bankedExcessSavings={results.bankingSavings}
                bessTimeShiftSavings={results.energySavingsFromBess - results.bessOM}
                demandSavings={results.demandSavings}
                excessAbsorbedPercent={results.excessAbsorbedPercent}
                bessOM={results.bessOM}
              />

              <MeaningBanner
                paybackPenalty={results.paybackPenalty}
                bessStandalonePayback={results.bessStandalonePayback}
              />

              <ReportForm />

              {showDebug ? (
                <div className="rounded-[6px] border border-[#dfe7df] bg-[#f6faf7] p-3 text-[11px] text-[#243d36]">
                  <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em]">Calculation details</div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div>Solar generation: {results.solarGeneration.toFixed(0)} kWh/yr ({(results.solarGeneration / 1000000).toFixed(2)} MU/yr)</div>
                    <div>Excess over load: {results.annualExcessSolar.toFixed(0)} kWh/yr ({(results.annualExcessSolar / 1000000).toFixed(2)} MU/yr)</div>
                    <div>Self-consumed solar: {results.annualSelfConsumedSolar.toFixed(0)} kWh/yr ({(results.annualSelfConsumedSolar / 1000000).toFixed(2)} MU/yr)</div>
                    <div>BESS power: {results.bessPower.toFixed(2)} MW</div>
                    <div>BESS energy: {results.bessEnergy.toFixed(2)} MWh</div>
                    <div>Maximum BESS charging: {results.maxAnnualBessCharging.toFixed(0)} kWh/yr</div>
                    <div>Eligible excess: {results.eligibleExcessForBess.toFixed(0)} kWh/yr</div>
                    <div>Actual BESS charging: {results.actualAnnualBessCharging.toFixed(0)} kWh/yr</div>
                    <div>Excess absorbed: {results.excessAbsorbedPercent.toFixed(1)}%</div>
                    <div>Delivered after {inputs.roundTripEfficiency}% RTE: {results.annualBessEnergy.toFixed(0)} kWh/yr</div>
                    <div>Banking + standby input: ₹{inputs.bankingStandbyCharge.toFixed(2)}/kWh (excluded from reference savings equations)</div>
                    <div>BESS energy savings: ₹{results.energySavingsFromBess.toFixed(5)} Cr/yr</div>
                    <div>Demand relief: {results.demandReliefKVA.toFixed(0)} kVA</div>
                    <div>Demand savings: ₹{results.demandSavings.toFixed(2)} Cr/yr</div>
                    <div>Solar savings gross: ₹{results.annualSolarSavingsGross.toFixed(2)} Cr/yr</div>
                    <div>Solar O&M: ₹{results.solarOM.toFixed(2)} Cr/yr</div>
                    <div>Solar-only net savings: ₹{results.annualSavingsSolarOnly.toFixed(5)} Cr/yr</div>
                    <div>BESS O&M: ₹{results.bessOM.toFixed(2)} Cr/yr</div>
                    <div>Incremental BESS net savings: ₹{results.incrementalBessSavings.toFixed(5)} Cr/yr</div>
                    <div>Solar + BESS net savings: ₹{results.annualSavingsSolarPlusBess.toFixed(5)} Cr/yr</div>
                    <div>Solar payback: {formatYears(results.solarOnlyPayback)}</div>
                    <div>Solar + BESS payback: {formatYears(results.solarPlusBessPayback)}</div>
                    <div>BESS standalone payback: {formatYears(results.bessStandalonePayback)}</div>
                    <div>Payback improvement: {formatYears(results.paybackPenalty)}</div>
                    <div>Solar capex: ₹{results.solarCapex.toFixed(2)} Cr</div>
                    <div>BESS capex: ₹{results.bessCapex.toFixed(2)} Cr</div>
                    <div>Total capex: ₹{results.totalCapex.toFixed(2)} Cr</div>
                    <div>Storage requirement: {results.requiredStorage.toFixed(2)} MWh ({results.complianceStatus ? 'Compliant' : 'Not compliant'})</div>
                    <div>Transformer allowed rooftop: {results.allowedRooftopCumulative.toFixed(2)} MW</div>
                    <div>Transformer overage: {results.transformerHeadroom.toFixed(2)} MW</div>
                    <div>Project ROI: {results.roi.toFixed(1)}%</div>
                  </div>
                </div>
              ) : null}

              <div className="rounded-[6px] border border-[#dfe7df] bg-[#f6faf7] p-3 text-[10px] leading-5 text-[#596f68]">
                Indicative only. Simple payback on year-1 cash flows; excludes degradation, tariff escalation, tax benefits and BESS augmentation. Demand relief assumes the BESS saves peak kVA hits per booked power for the solar show. Sanctioned connectivity assumed equal to solar capacity. Rules follow MERC&apos;s draft regulations of 22 Sep 2026 and may change final notification.
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {chatOpen ? (
        <section
          id="swid-chat-popup"
          aria-label="Chat with SWID"
          className="fixed bottom-[76px] right-3 z-50 w-[min(360px,calc(100vw-1.5rem))] overflow-hidden rounded-[12px] border border-[#cbd9ce] bg-white shadow-[0_12px_40px_rgba(17,43,37,0.22)] sm:bottom-[84px] sm:right-5"
          role="dialog"
        >
          <div className="flex items-center justify-between gap-3 bg-[#0d3f31] px-4 py-3 text-white">
            <div>
              <div className="text-[14px] font-bold">We are online! Let&apos;s chat</div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[#cce7d8]">
                <span className="h-2 w-2 rounded-full bg-[#69d391]" /> SWID energy team
              </div>
            </div>
            <button
              aria-label="Close chat popup"
              className="rounded p-1 text-white hover:bg-white/10"
              onClick={() => setChatOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="max-w-[280px] rounded-[10px] rounded-tl-sm bg-[#f0f5f0] px-3 py-2.5 text-[13px] leading-5 text-[#34463b]">
              Hi! How can we help with your solar and storage project?
            </div>
            <a
              className="mt-4 inline-flex items-center gap-2 rounded-[6px] bg-[#0f7a57] px-3 py-2 text-[12px] font-bold text-white hover:bg-[#0d684b]"
              href="#report-form"
              onClick={() => setChatOpen(false)}
            >
              Request a detailed report <Send className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>
      ) : null}

      <button
        aria-controls="swid-chat-popup"
        aria-expanded={chatOpen}
        aria-label={chatOpen ? 'Close chat popup' : 'We are online! Let’s chat'}
        className="fixed bottom-3 right-3 z-50 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0d6b4d] px-4 py-3 text-[13px] font-bold text-white shadow-[0_5px_18px_rgba(13,63,49,0.3)] transition hover:bg-[#0b583f] sm:bottom-5 sm:right-5"
        onClick={() => setChatOpen((open) => !open)}
        type="button"
      >
        <MessageCircle className="h-5 w-5" />
        <span>We are online! Let&apos;s chat</span>
      </button>
    </div>
  );
}
