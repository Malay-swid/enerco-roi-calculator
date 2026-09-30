import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChevronRight, ChevronLeft, CheckCircle, TrendingUp, DollarSign, Clock } from 'lucide-react';

// --- Types ---
type TechType = 'Solar PV' | 'Wind-Solar Hybrid' | 'BESS';

interface FormData {
  monthlyBill: string;
  tariff: string;
  installationCost: string;
  techType: TechType;
  savingPercent: number;
  companyName: string;
  email: string;
  industry: string;
}

const INITIAL_DATA: FormData = {
  monthlyBill: '',
  tariff: '',
  installationCost: '',
  techType: 'Solar PV',
  savingPercent: 20,
  companyName: '',
  email: '',
  industry: '',
};

// --- Components ---
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = ['Inputs', 'Investment', 'Optimization', 'Lead Capture', 'Results'];
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, idx) => (
          <span key={step} className={`text-xs font-medium ${idx + 1 === currentStep ? 'text-emerald-500' : 'text-slate-400'}`}>
            {step}
          </span>
        ))}
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default function EnergyROICalculator() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);

  const updateData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // --- Calculations ---
  const annualSavings = (Number(data.monthlyBill) * 12) * (data.savingPercent / 100);
  const totalInvestment = Number(data.installationCost);
  const paybackPeriod = annualSavings > 0 ? totalInvestment / annualSavings : 0;

  // Generate 10-year projection data
  const projectionData = Array.from({ length: 11 }, (_, year) => {
    const cumulativeSavings = annualSavings * year;
    return {
      year: `Year ${year}`,
      savings: Math.round(cumulativeSavings),
      investment: totalInvestment,
    };
  });

  const breakEvenYear = paybackPeriod.toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A192F] p-8 text-white">
          <h1 className="text-3xl font-bold tracking-tight">Energy ROI Calculator</h1>
          <p className="text-slate-400 mt-2">Calculate your potential energy savings and payback period.</p>
        </div>

        <div className="p-8">
          <StepIndicator currentStep={step} />

          {/* Step 1: Inputs */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-[#0A192F]">Energy Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-slate-600">Average Monthly Energy Bill ($)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1500"
                    className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={data.monthlyBill}
                    onChange={(e) => updateData('monthlyBill', e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-slate-600">Current Energy Tariff (cost per kWh)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 0.12"
                    className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={data.tariff}
                    onChange={(e) => updateData('tariff', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Investment */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-[#0A192F]">System Investment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-slate-600">Estimated System Installation Cost ($)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 25000"
                    className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={data.installationCost}
                    onChange={(e) => updateData('installationCost', e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-slate-600">Technology Type</label>
                  <select 
                    className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                    value={data.techType}
                    onChange={(e) => updateData('techType', e.target.value as TechType)}
                  >
                    <option value="Solar PV">Solar PV</option>
                    <option value="Wind-Solar Hybrid">Wind-Solar Hybrid</option>
                    <option value="BESS">BESS (Battery Storage)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Optimization */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-[#0A192F]">Optimization</h2>
              <div className="flex flex-col space-y-4 max-w-md">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-600">Expected Energy Saving %</label>
                  <span className="text-lg font-bold text-emerald-600">{data.savingPercent}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="40" 
                  step="1"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  value={data.savingPercent}
                  onChange={(e) => updateData('savingPercent', parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>5% (Conservative)</span>
                  <span>40% (Aggressive)</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Lead Capture */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-semibold text-[#0A192F]">Unlock Your Full Analysis</h2>
              <p className="text-sm text-slate-500">Please provide your company details to view the financial projection.</p>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-slate-600">Company Name</label>
                  <input 
                    type="text" 
                    placeholder="Acme Corp"
                    className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={data.companyName}
                    onChange={(e) => updateData('companyName', e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-slate-600">Work Email</label>
                  <input 
                    type="email" 
                    placeholder="you@company.com"
                    className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={data.email}
                    onChange={(e) => updateData('email', e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-slate-600">Industry</label>
                  <input 
                    type="text" 
                    placeholder="Manufacturing, Logistics, etc."
                    className="p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={data.industry}
                    onChange={(e) => updateData('industry', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Page */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-2 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                  <CheckCircle size={20} className="mr-2" />
                  <span className="text-sm font-bold uppercase tracking-wider">Analysis Complete</span>
                </div>
                <h2 className="text-3xl font-bold text-[#0A192F]">Your Financial Projection</h2>
                <p className="text-slate-500 mt-2">Projected savings for {data.companyName} using {data.techType}.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-4">
                  <div className="p-3 bg-emerald-500 text-white rounded-xl">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Annual Savings</p>
                    <p className="text-3xl font-bold text-slate-900">${Math.round(annualSavings).toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-4">
                  <div className="p-3 bg-emerald-500 text-white rounded-xl">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Payback Period</p>
                    <p className="text-3xl font-bold text-slate-900">{breakEvenYear} Years</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-[#0A192F] flex items-center">
                    <TrendingUp size={18} className="mr-2 text-emerald-500" />
                    10-Year Cumulative ROI
                  </h3>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => {
                          const numericValue = Number(value);
                          return [`$${Number.isFinite(numericValue) ? numericValue.toLocaleString() : '0'}`, ''];
                        }}
                      />
                      <Legend verticalAlign="top" align="right" height={36} />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        name="Cumulative Savings" 
                        stroke="#10b981" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#10b981' }} 
                        activeDot={{ r: 6 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="investment" 
                        name="Initial Investment" 
                        stroke="#94a3b8" 
                        strokeWidth={2} 
                        strokeDasharray="5 5" 
                        dot={false} 
                      />
                      <ReferenceLine y={totalInvestment} stroke="#cbd5e1" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-4">
                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-200">
                  Book a Free Consultation
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex justify-between items-center border-t border-slate-100 pt-6">
            <button 
              onClick={prevStep} 
              disabled={step === 1}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <ChevronLeft size={18} className="mr-1" />
              Back
            </button>
            
            {step < 5 && (
              <button 
                onClick={nextStep} 
                disabled={
                  (step === 1 && (!data.monthlyBill || !data.tariff)) ||
                  (step === 2 && !data.installationCost) ||
                  (step === 4 && (!data.companyName || !data.email || !data.industry))
                }
                className={`flex items-center px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                  (step === 1 && (!data.monthlyBill || !data.tariff)) ||
                  (step === 2 && !data.installationCost) ||
                  (step === 4 && (!data.companyName || !data.email || !data.industry))
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-[#0A192F] text-white hover:bg-slate-800 shadow-md'
                }`}
              >
                Continue
                <ChevronRight size={18} className="ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
