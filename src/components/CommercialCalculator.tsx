import React, { useEffect, useMemo, useState } from 'react';
import { Download, RotateCcw, Save, Printer, ChevronDown, Sun, BatteryCharging, IndianRupee } from 'lucide-react';
import {
  calculateCommercialScenario,
  compatibleStructures,
  defaultCommercialInputs,
  meterTariffDefaults,
  validateCommercialInputs,
  type CommercialInputs,
  type CommercialStructure,
  type MeterType,
  type ProjectType,
} from '../lib/commercialCalculator';
import { calculateFinancialModels, financialModelAssumptions, type FinancialModelResult } from '../lib/financialModels';

type FieldKey = keyof CommercialInputs;
const STORAGE_KEY = 'swid-commercial-calculator-v1';
const money = (value: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`;
const number = (value: number, digits = 0) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

function loadSavedInputs(): CommercialInputs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultCommercialInputs;
    const parsed = JSON.parse(stored) as Partial<CommercialInputs>;
    const merged = { ...defaultCommercialInputs, ...parsed };
    if (!compatibleStructures(merged.projectType).includes(merged.commercialStructure)) {
      merged.commercialStructure = compatibleStructures(merged.projectType)[0];
    }
    merged.wheelingTransmissionPerKwh = merged.projectType === 'open_access' ? 1.95 : 0;
    return merged;
  } catch {
    return defaultCommercialInputs;
  }
}

function downloadExcel(inputs: CommercialInputs, results: ReturnType<typeof calculateCommercialScenario>, financialModels: FinancialModelResult[]) {
  const rows: Array<[string, string | number]> = [
    ['Solar + BESS Commercial Calculation', ''],
    ['Project type', inputs.projectType === 'open_access' ? 'Open Access' : 'Rooftop / Behind the Meter'],
    ['Solar DC capacity (kWp)', inputs.solarDcCapacityKwp],
    ['DC ratio', inputs.dcRatio],
    ['Solar AC capacity (kW)', results.solarAcCapacityKw],
    ['Specific yield (kWh/kWp/year)', inputs.specificYield],
    ['Annual solar generation (kWh/year)', results.annualSolarGenerationKwh],
    ['BESS sizing', inputs.bessDuration === 'custom' ? 'Custom' : `${inputs.bessDuration} Hour`],
    ['BESS capacity (kWh)', results.bessCapacityKwh],
    ['BESS duration (hours)', results.bessDurationHours],
    ['Meter', inputs.meter === 'ht_commercial' ? 'HT - Commercial' : 'HT - Industrial'],
    ['Off-peak tariff (₹/kWh)', inputs.offPeakTariff],
    ['Peak tariff (₹/kWh)', inputs.peakTariff],
    ['Applicable banking + standby (₹/kW/month)', results.applicableBankingStandbyPerKwMonth],
    ['Banking + standby (₹/kWh)', results.bankingStandbyPerKwh],
    ['Wheeling & transmission charge (₹/kWh)', results.applicableWheelingTransmissionPerKwh],
    ['Commercial structure', inputs.commercialStructure],
    ['Solar CAPEX (₹/kWp)', inputs.solarCapexPerKwp],
    ['BESS CAPEX (₹/kWh)', inputs.bessCapexPerKwh],
    ['Solar investment (₹)', results.solarInvestment],
    ['BESS investment (₹)', results.bessInvestment],
    ['Total investment (₹)', results.totalInvestment],
    ['Out-of-pocket investment (₹)', results.outOfPocketInvestment],
    ['Daytime load offset (kWh/year)', results.daytimeLoadOffsetKwh],
    ['Excess solar (kWh/year)', results.excessSolarKwh],
    ['Excess solar lost (kWh/year)', results.excessSolarLostKwh],
    ['Usable solar (kWh/year)', results.usableSolarKwh],
    ['Usable BESS energy (kWh)', results.usableBessEnergyKwh],
    ['Annual BESS throughput (kWh/year)', results.annualBessThroughputKwh],
    ['Solar exceeding daytime load (%)', inputs.solarExcessPercent],
    ['Excess lost to slot limits (%)', inputs.excessLostToSlotLimitsPercent],
    ['Round-trip efficiency (%)', inputs.roundTripEfficiencyPercent],
    ['Depth of discharge (%)', inputs.depthOfDischargePercent],
    ['Annual BESS cycles', inputs.annualBessCycles],
    ['Peak shifting enabled', inputs.peakShifting ? 'Yes' : 'No'],
    ['Solar charging enabled', inputs.solarCharging ? 'Yes' : 'No'],
    ['Grid charging enabled', inputs.gridCharging ? 'Yes' : 'No'],
    ['Financial comparison horizon (years)', financialModelAssumptions.projectYears],
    ['Rooftop / BTM generation (kWh/kWp/year)', financialModelAssumptions.rooftopGenerationKwhPerKwp],
    ['Open Access generation (kWh/kWp/year)', financialModelAssumptions.openAccessGenerationKwhPerKwp],
    ['Open Access transmission loss (%)', financialModelAssumptions.openAccessTransmissionLossPercent],
    ['Open Access wheeling and transmission charge (₹/kWh)', financialModelAssumptions.wheelingTransmissionPerKwh],
    ['Rooftop / BTM banking + standby (₹/kW/month)', financialModelAssumptions.fixedBankingPerKwMonth],
    ['Base off-peak tariff (₹/kWh)', financialModelAssumptions.offPeakTariffPerKwh],
    ['Base peak tariff (₹/kWh)', financialModelAssumptions.peakTariffPerKwh],
    ['Charge efficiency (%)', financialModelAssumptions.chargeEfficiencyPercent],
    ['Discharge efficiency (%)', financialModelAssumptions.dischargeEfficiencyPercent],
    ['Depth of discharge (%)', financialModelAssumptions.depthOfDischargePercent],
    ['Solar degradation (%)', financialModelAssumptions.solarDegradationPercent],
    ['BESS degradation / tariff escalation (%)', financialModelAssumptions.bessDegradationPercent],
    ['Solar O&M (₹/kWp/year)', financialModelAssumptions.solarOmPerKwp],
    ['BESS O&M (₹/kWh/year)', financialModelAssumptions.bessOmPerKwh],
    ['O&M escalation (%)', financialModelAssumptions.annualOmEscalationPercent],
    ['Insurance (% of CAPEX/year)', financialModelAssumptions.annualInsurancePercent],
    ['PPA term (years)', financialModelAssumptions.ppaTenureYears],
    ['OPEX PPA rate (₹/kWh)', financialModelAssumptions.opexPpaPerKwh],
    ['Group Captive PPA rate (₹/kWh)', financialModelAssumptions.groupCaptivePpaPerKwh],
    ['Group Captive out-of-pocket share (%)', financialModelAssumptions.groupCaptiveOutOfPocketPercent],
    ['Financial model results', ''],
    ...financialModels.flatMap((model) => [
      [`${model.label} · Out-of-pocket investment (₹)`, model.initialInvestment] as [string, string | number],
      [`${model.label} · IRR / Return on Investment`, model.irr === 'infinite' ? '∞' : model.irr === null ? 'N/A' : `${(model.irr * 100).toFixed(2)}%`] as [string, string | number],
      [`${model.label} · ROI / Payback (months)`, model.roiPaybackMonths === null ? 'N/A' : model.roiPaybackMonths] as [string, string | number],
      [`${model.label} · 20-year cumulative savings (₹)`, model.cumulativeSavings] as [string, string | number],
    ]),
    ['Yearly net cash flows', '₹'],
    ...financialModels.flatMap((model) => model.cashFlows.map((cashFlow, year) => [
      `${model.label} · Year ${year} net cash flow (₹)`,
      cashFlow,
    ] as [string, string | number])),
  ];
  const xml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  const cells = rows.map(([key, value], index) => {
    const row = index + 1;
    const label = `<c r="A${row}" t="inlineStr"><is><t>${xml(String(key))}</t></is></c>`;
    const result = typeof value === 'number'
      ? `<c r="B${row}"><v>${Number.isFinite(value) ? value : 0}</v></c>`
      : `<c r="B${row}" t="inlineStr"><is><t>${xml(String(value))}</t></is></c>`;
    return `<row r="${row}">${label}${result}</row>`;
  }).join('');
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${cells}</sheetData></worksheet>`;
  const files: Record<string, string> = {
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Calculation" sheetId="1" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
    'xl/worksheets/sheet1.xml': sheet,
  };
  const encoder = new TextEncoder();
  const crc32 = (bytes: Uint8Array) => {
    let crc = 0xffffffff;
    for (const byte of bytes) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;
  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const local = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, data.length, true);
    localView.setUint32(22, data.length, true);
    localView.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30);
    localParts.push(local, data);
    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, data.length, true);
    centralView.setUint32(24, data.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralParts.push(central);
    offset += local.length + data.length;
  });
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, centralParts.length, true);
  endView.setUint16(10, centralParts.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  const archiveParts: BlobPart[] = [...localParts, ...centralParts, end].map((part) => part.buffer as ArrayBuffer);
  const blob = new Blob(archiveParts, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'solar-bess-commercial-calculation.xlsx';
  anchor.click();
  URL.revokeObjectURL(url);
}

function Card({ title, icon, children, className = '' }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
    <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">{icon}{title}</h2>{children}
  </section>;
}

function SelectField({ label, value, onChange, options, hint }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]>; hint?: string }) {
  return <label className="block text-sm font-medium text-slate-700">{label}
    <select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}
    </select>{hint ? <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span> : null}
  </label>;
}

function NumericField({ label, unit, value, onChange, min = 0, max, step = 1, error, hint, slider = false }: { label: string; unit: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; error?: string; hint?: string; slider?: boolean }) {
  return <label className="block text-sm font-medium text-slate-700">{label}
    <div className={`mt-1.5 flex overflow-hidden rounded-lg border bg-white focus-within:ring-2 ${error ? 'border-red-400 focus-within:ring-red-100' : 'border-slate-300 focus-within:border-emerald-600 focus-within:ring-emerald-100'}`}>
      <input type="number" min={min} max={max} step={step} value={Number.isFinite(value) ? value : ''} onChange={(event) => onChange(event.target.value === '' ? Number.NaN : Number(event.target.value))} className="min-w-0 flex-1 px-3 py-2.5 text-sm text-slate-900 outline-none" />
      <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">{unit}</span>
    </div>{slider && max !== undefined ? <input aria-label={`${label} slider`} type="range" min={min} max={max} step={step} value={Number.isFinite(value) ? value : min} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 h-2 w-full cursor-pointer accent-emerald-700" /> : null}{error ? <span className="mt-1 block text-xs font-medium text-red-600">{error}</span> : hint ? <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span> : null}
  </label>;
}

function Output({ label, value, unit, strong = false }: { label: string; value: string; unit?: string; strong?: boolean }) {
  return <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 py-3 last:border-0"><span className="text-sm text-slate-600">{label}</span><span className={`text-right ${strong ? 'text-lg font-extrabold text-emerald-800' : 'font-semibold text-slate-900'}`}>{value}{unit ? <span className="ml-1 text-xs font-medium text-slate-500">{unit}</span> : null}</span></div>;
}

function FinancialModelCard({ model }: { model: FinancialModelResult }) {
  const irr = model.irr === 'infinite' ? '∞' : model.irr === null ? 'N/A' : `${number(model.irr * 100, 2)}%`;
  const payback = model.roiPaybackMonths === null ? 'No payback' : number(model.roiPaybackMonths, 2);
  return <article className="rounded-xl border border-white/10 bg-white/[0.07] p-4 sm:p-5">
    <h3 className="text-base font-extrabold text-white">{model.label}</h3>
    <div className="mt-3 space-y-1.5">
      <div className="rounded-lg bg-white/5 px-3 py-2.5"><div className="text-[11px] leading-4 text-emerald-100">Out-of-pocket investment</div><div className="mt-1 text-lg font-extrabold">{money(model.initialInvestment)}</div></div>
      <div className="rounded-lg bg-white/5 px-3 py-2.5"><div className="text-[11px] leading-4 text-emerald-100">IRR · Return on Investment</div><div className="mt-1 text-xl font-extrabold">{irr}</div></div>
      <div className="rounded-lg bg-white/5 px-3 py-2.5"><div className="text-[11px] leading-4 text-emerald-100">ROI · Payback (months)</div><div className="mt-1 text-xl font-extrabold">{payback}</div></div>
      <div className="rounded-lg bg-white/5 px-3 py-2.5"><div className="text-[11px] leading-4 text-emerald-100">20-year cumulative savings</div><div className="mt-1 text-lg font-extrabold">{money(model.cumulativeSavings)}</div></div>
    </div>
  </article>;
}

export function CommercialCalculator({ onModeChange }: { onModeChange: (mode: 'merc' | 'commercial') => void }) {
  const [inputs, setInputs] = useState<CommercialInputs>(loadSavedInputs);
  const [saved, setSaved] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const results = useMemo(() => calculateCommercialScenario(inputs), [inputs]);
  const financialModels = useMemo(() => calculateFinancialModels(inputs, results), [inputs, results]);
  const errors = useMemo(() => validateCommercialInputs(inputs), [inputs]);
  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)); } catch { /* storage may be disabled */ }
  }, [inputs]);

  const update = <K extends FieldKey>(key: K, value: CommercialInputs[K]) => {
    setInputs((previous) => ({ ...previous, [key]: value }));
    setSaved(false);
  };
  const changeProjectType = (projectType: ProjectType) => {
    const commercialStructure = compatibleStructures(projectType)[0];
    const wheelingTransmissionPerKwh = projectType === 'open_access' ? 1.95 : 0;
    setInputs((previous) => ({ ...previous, projectType, commercialStructure, wheelingTransmissionPerKwh }));
    setSaved(false);
  };
  const changeMeter = (meter: MeterType) => {
    const tariffs = meterTariffDefaults[meter];
    setInputs((previous) => ({ ...previous, meter, offPeakTariff: tariffs.offPeak, peakTariff: tariffs.peak }));
    setSaved(false);
  };
  const reset = () => { setInputs(defaultCommercialInputs); setSaved(false); };

  return <div className="min-h-screen bg-[#f3f7f4] text-slate-900 print:bg-white">
    <header className="border-b border-emerald-950/10 bg-white print:hidden">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-white"><Sun className="h-6 w-6" /></div><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">SWID Energy Solutions</p><h1 className="text-lg font-extrabold sm:text-xl">Solar + BESS Commercial Calculator</h1></div></div>
        <div className="flex flex-wrap items-center gap-2"><div className="mr-auto flex rounded-lg bg-slate-100 p-1 md:mr-3"><button type="button" onClick={() => onModeChange('merc')} className="rounded-md px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 sm:text-sm">MERC draft model</button><button type="button" aria-current="page" className="rounded-md bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-sm sm:text-sm">Commercial model</button></div>
          <button type="button" onClick={() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)); setSaved(true); } catch { setSaved(false); } }} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Save className="h-4 w-4" />{saved ? 'Saved' : 'Save'}</button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Printer className="h-4 w-4" />PDF / Print</button>
          <button type="button" onClick={() => downloadExcel(inputs, results, financialModels)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900"><Download className="h-4 w-4" />Export Excel</button>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-[1480px] px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Techno-commercial evaluation</div><p className="mt-1 max-w-3xl text-sm text-slate-600">Configure a solar and storage project to see capacity, applicable charges, and investment update live.</p></div><button type="button" onClick={reset} className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:self-auto"><RotateCcw className="h-4 w-4" />Reset calculator</button></div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.85fr)]">
        <div className="space-y-5">
          <Card title="Project data" icon={<Sun className="h-5 w-5 text-emerald-700" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Project type" value={inputs.projectType} onChange={(value) => changeProjectType(value as ProjectType)} options={[["open_access", "Open Access"], ["rooftop_btm", "Rooftop / Behind the Meter"]]} />
              <NumericField label="Solar DC capacity" unit="kWp" value={inputs.solarDcCapacityKwp} step={0.1} onChange={(value) => update('solarDcCapacityKwp', value)} error={errors.solarDcCapacityKwp} />
              <NumericField label="DC ratio" unit="DC:AC" value={inputs.dcRatio} min={1} max={1.5} step={0.01} onChange={(value) => update('dcRatio', value)} error={errors.dcRatio} hint="Advanced setting · suggested range 1.00–1.50" />
              <div className="rounded-xl bg-emerald-50 px-4 py-3"><div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Solar AC capacity</div><div className="mt-1 text-2xl font-extrabold text-emerald-950">{number(results.solarAcCapacityKw, 1)} <span className="text-sm font-semibold">kW</span></div><div className="mt-1 text-xs text-emerald-800">Recommended AC capacity</div></div>
              <NumericField label="Specific yield" unit="kWh/kWp/year" value={inputs.specificYield} min={1200} max={1800} step={10} onChange={(value) => update('specificYield', value)} error={errors.specificYield} slider />
              <SelectField label="BESS sizing" value={inputs.bessDuration} onChange={(value) => update('bessDuration', value as CommercialInputs['bessDuration'])} options={[["1", "1 Hour"], ["2", "2 Hour"], ["3", "3 Hour"], ["4", "4 Hour"], ["custom", "Custom"]]} />
              {inputs.bessDuration === 'custom' ? <NumericField label="Custom BESS capacity" unit="kWh" value={inputs.customBessCapacityKwh} step={1} onChange={(value) => update('customBessCapacityKwh', value)} error={errors.customBessCapacityKwh} /> : null}
              <div className="rounded-xl bg-sky-50 px-4 py-3"><div className="text-xs font-semibold uppercase tracking-wide text-sky-800">BESS configuration</div><div className="mt-1 text-xl font-extrabold text-sky-950">{number(results.bessCapacityKwh, 1)} kWh</div><div className="mt-1 text-xs text-sky-800">{inputs.bessDuration === 'custom' ? `Custom capacity · ${number(results.bessDurationHours, 2)} hour equivalent` : `50% of AC capacity for ${inputs.bessDuration} selected ${inputs.bessDuration === '1' ? 'hour' : 'hours'}`}</div></div>
            </div>
          </Card>

          <Card title="Tariffs & charges">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Meter" value={inputs.meter} onChange={(value) => changeMeter(value as MeterType)} options={[["ht_commercial", "HT - Commercial"], ["ht_industrial", "HT - Industrial"]]} />
              <NumericField label="Landed grid off-peak tariff" unit="₹/kWh" value={inputs.offPeakTariff} step={0.01} onChange={(value) => update('offPeakTariff', value)} error={errors.offPeakTariff} />
              <NumericField label="Landed grid peak tariff" unit="₹/kWh" value={inputs.peakTariff} step={0.01} onChange={(value) => update('peakTariff', value)} error={errors.peakTariff} />
              {inputs.projectType === 'open_access' ? (
                <label className="block text-sm font-medium text-slate-700">Banking + standby charge
                  <div className="mt-1.5 flex overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50">
                    <input type="number" readOnly value={0} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none" />
                    <span className="flex items-center border-l border-emerald-200 bg-white/60 px-3 text-xs text-slate-500">₹/kW/month</span>
                  </div>
                  <span className="mt-1 block text-xs font-normal text-slate-500">Not applied for Open Access</span>
                </label>
              ) : (
                <NumericField label="Banking + standby charge" unit="₹/kW/month" value={inputs.bankingStandbyPerKwMonth} step={1} onChange={(value) => update('bankingStandbyPerKwMonth', value)} error={errors.bankingStandbyPerKwMonth} />
              )}
              <label className="block text-sm font-medium text-slate-700">Wheeling & transmission
                <div className="mt-1.5 flex overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50">
                  <input type="number" readOnly value={inputs.wheelingTransmissionPerKwh} className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none" />
                  <span className="flex items-center border-l border-emerald-200 bg-white/60 px-3 text-xs text-slate-500">₹/kWh</span>
                </div>
                <span className="mt-1 block text-xs font-normal text-slate-500">Set automatically from project type</span>
              </label>
            </div>
          </Card>

          <Card title="Investment" icon={<IndianRupee className="h-5 w-5 text-emerald-700" />}>
            <label className="mb-5 block text-sm font-medium text-slate-700">
              Commercial structure
              <select
                className="mt-2 w-full rounded-xl border-2 border-emerald-700 bg-white px-4 py-3 text-lg text-slate-900 shadow-[0_0_0_4px_#d1fae5] outline-none focus:ring-2 focus:ring-emerald-200"
                value={inputs.commercialStructure}
                onChange={(event) => update('commercialStructure', event.target.value as CommercialStructure)}
              >
                {compatibleStructures(inputs.projectType).map((value) => (
                  <option key={value} value={value}>{({ capex: 'CAPEX', opex: 'OPEX', group_captive: 'Group Captive', captive: 'Captive' } as Record<string, string>)[value]}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <NumericField label="Solar CAPEX" unit="₹/kWp" value={inputs.solarCapexPerKwp} min={25000} max={50000} step={500} onChange={(value) => update('solarCapexPerKwp', value)} error={errors.solarCapexPerKwp} slider />
              <NumericField label="BESS CAPEX" unit="₹/kWh" value={inputs.bessCapexPerKwh} min={12000} max={23000} step={500} onChange={(value) => update('bessCapexPerKwh', value)} error={errors.bessCapexPerKwh} slider />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Solar investment</p><p className="mt-1 text-lg font-bold">{money(results.solarInvestment)}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">BESS investment</p><p className="mt-1 text-lg font-bold">{money(results.bessInvestment)}</p></div><div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs text-emerald-800">Total investment</p><p className="mt-1 text-lg font-extrabold text-emerald-950">{money(results.totalInvestment)}</p></div></div>
            <div className="mt-4 rounded-xl bg-emerald-300 p-4 text-emerald-950"><div className="text-xs font-bold uppercase tracking-wide">Out-of-pocket investment</div><div className="mt-1 text-2xl font-black">{money(results.outOfPocketInvestment)}</div><div className="mt-1 text-xs">{inputs.commercialStructure.replace('_', ' ')} structure</div></div>
          </Card>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button type="button" aria-expanded={advancedOpen} onClick={() => setAdvancedOpen((open) => !open)} className="flex w-full items-center justify-between p-5 text-left sm:p-6"><span><span className="block text-lg font-bold text-slate-900">Advanced calculation & assumptions</span><span className="mt-1 block text-sm text-slate-500">Energy split and optional BESS operating assumptions</span></span><ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} /></button>
            {advancedOpen ? <div className="space-y-5 border-t border-slate-100 p-5 sm:p-6">
              <p className="text-sm leading-6 text-slate-600">The starting energy split uses 60% daytime excess and 100% of that excess lost to slot limits, inherited from the current model because the brief does not provide defaults. Adjust both values for your project.</p>
              <div className="grid gap-4 sm:grid-cols-2"><NumericField label="Solar exceeding daytime load" unit="%" value={inputs.solarExcessPercent} max={100} onChange={(value) => update('solarExcessPercent', value)} error={errors.solarExcessPercent} /><NumericField label="Excess lost to slot limits" unit="%" value={inputs.excessLostToSlotLimitsPercent} max={100} onChange={(value) => update('excessLostToSlotLimitsPercent', value)} error={errors.excessLostToSlotLimitsPercent} /></div>
              <div className="grid gap-2 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"><Output label="Annual solar generation" value={number(results.annualSolarGenerationKwh)} unit="kWh/year" /><Output label="Daytime load offset" value={number(results.daytimeLoadOffsetKwh)} unit="kWh/year" /><Output label="Excess solar" value={number(results.excessSolarKwh)} unit="kWh/year" /><Output label="Excess solar lost" value={number(results.excessSolarLostKwh)} unit="kWh/year" /><Output label="Usable solar" value={number(results.usableSolarKwh)} unit="kWh/year" strong /></div>
              <div><h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800"><BatteryCharging className="h-4 w-4 text-emerald-700" />Optional BESS operation</h3><div className="grid gap-4 sm:grid-cols-3"><NumericField label="Round-trip efficiency" unit="%" value={inputs.roundTripEfficiencyPercent} max={100} onChange={(value) => update('roundTripEfficiencyPercent', value)} error={errors.roundTripEfficiencyPercent} /><NumericField label="Depth of discharge" unit="%" value={inputs.depthOfDischargePercent} max={100} onChange={(value) => update('depthOfDischargePercent', value)} error={errors.depthOfDischargePercent} /><NumericField label="Annual cycles" unit="cycles/year" value={inputs.annualBessCycles} step={1} onChange={(value) => update('annualBessCycles', value)} error={errors.annualBessCycles} /></div><div className="mt-4 grid gap-3 sm:grid-cols-3">{([['peakShifting', 'Peak shifting'], ['solarCharging', 'Solar charging'], ['gridCharging', 'Grid charging']] as Array<[keyof Pick<CommercialInputs, 'peakShifting' | 'solarCharging' | 'gridCharging'>, string]>).map(([key, label]) => <label key={key} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700">{label}<input type="checkbox" checked={inputs[key]} onChange={(event) => update(key, event.target.checked)} className="h-4 w-4 accent-emerald-700" /></label>)}</div><div className="mt-4 rounded-xl bg-slate-50 p-4"><Output label="Usable BESS energy" value={number(results.usableBessEnergyKwh)} unit="kWh" /><Output label="Annual BESS throughput" value={number(results.annualBessThroughputKwh)} unit="kWh/year" /></div></div>
            </div> : null}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-5">
          <section className="overflow-hidden rounded-2xl bg-[#103f32] text-white shadow-lg"><div className="border-b border-white/10 px-5 py-5 sm:px-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Live project summary</div><h2 className="mt-1 text-xl font-extrabold">Results dashboard</h2></div><div className="grid grid-cols-2 gap-3 p-4 sm:p-5"><div className="rounded-xl bg-white/10 p-4"><div className="text-xs text-emerald-100">Solar DC</div><div className="mt-1 text-xl font-extrabold">{number(inputs.solarDcCapacityKwp, 1)}</div><div className="text-xs text-emerald-100">kWp</div></div><div className="rounded-xl bg-white/10 p-4"><div className="text-xs text-emerald-100">Solar AC</div><div className="mt-1 text-xl font-extrabold">{number(results.solarAcCapacityKw, 1)}</div><div className="text-xs text-emerald-100">kW</div></div><div className="rounded-xl bg-white/10 p-4"><div className="text-xs text-emerald-100">Annual generation</div><div className="mt-1 text-xl font-extrabold">{number(results.annualSolarGenerationKwh / 1000000, 2)}</div><div className="text-xs text-emerald-100">GWh/year</div></div><div className="rounded-xl bg-white/10 p-4"><div className="text-xs text-emerald-100">BESS</div><div className="mt-1 text-xl font-extrabold">{number(results.bessCapacityKwh, 1)}</div><div className="text-xs text-emerald-100">kWh · {number(results.bessDurationHours, 1)} hour</div></div></div>
            <div className="px-5 pb-5 sm:px-6"><div className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-100">Investment breakdown</div><Output label="Solar investment" value={money(results.solarInvestment)} /><Output label="BESS investment" value={money(results.bessInvestment)} /><Output label="Total project investment" value={money(results.totalInvestment)} strong /></div>
          </section>
          {hasErrors ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">Correct the highlighted inputs before relying on the displayed results or exports.</div> : null}
        </aside>
      </div>
      <section className="mt-6 rounded-2xl bg-[#103f32] p-4 text-white shadow-lg sm:p-6" aria-labelledby="financial-models-heading">
        <div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-200">Excel-based comparison · 20-year project life</p><h2 id="financial-models-heading" className="mt-1 text-xl font-extrabold sm:text-2xl">Financial model results</h2><p className="mt-2 max-w-4xl text-sm leading-6 text-emerald-50/80">IRR is shown as Return on Investment. ROI is shown as payback in months. Cumulative savings includes the initial out-of-pocket investment.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{financialModels.map((model) => <FinancialModelCard key={model.id} model={model} />)}</div>
        <p className="mt-4 text-xs leading-5 text-emerald-100/70">OPEX shows 0-month payback and infinite IRR because its initial investment is zero. Results use the workbook&apos;s generation, charge, degradation, escalation, PPA, O&amp;M, and insurance assumptions.</p>
      </section>
      <footer className="mt-8 border-t border-slate-200 py-5 text-xs leading-5 text-slate-500">Indicative calculation. Capacity and CAPEX inputs follow the selected project configuration. Financial model assumptions and cash flows follow the supplied BESS + Solar workbook; user-selected BESS capacity replaces the workbook example.</footer>
    </main>
  </div>;
}
