import React, { useState } from 'react';

interface ReportFormValues {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  plantLocation: string;
  annualConsumption: string;
  consent: boolean;
}

const initialState: ReportFormValues = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  plantLocation: '',
  annualConsumption: '',
  consent: false,
};

export function ReportForm() {
  const [form, setForm] = useState<ReportFormValues>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof ReportFormValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors: Partial<Record<keyof ReportFormValues, string>> = {};

    if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Valid email is required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Valid phone is required';
    if (!form.consent) nextErrors.consent = 'Consent is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    console.info('Report request submitted', form);
  };

  const updateField = <K extends keyof ReportFormValues>(field: K, value: ReportFormValues[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div id="report-form" className="grid gap-4 rounded-[6px] border border-[#dbe3db] bg-white p-4 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#173d32]">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em]">Free · Independent</span>
        </div>
        <h2 className="text-[22px] font-black leading-tight text-[#173d32]">Get the full report for your plant</h2>
        <p className="text-[12px] text-[#4c5d57]">We&apos;ll run your scenario properly and send you:</p>
        <ul className="space-y-1 text-[12px] text-[#4c5d57]">
          <li>• 15-year cash flow, IRR and payback</li>
          <li>• Best-fit ESS size and dispatch strategy</li>
          <li>• Month-by-month banking exposure</li>
          <li>• Points to raise in MERC comments by 15 Oct</li>
        </ul>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <input
              className="w-full rounded-[4px] border border-[#dfe4df] bg-[#f9faf9] px-2.5 py-2 text-[12px] outline-none"
              placeholder="Full name"
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
            />
            {errors.fullName ? <div className="mt-1 text-[10px] text-red-600">{errors.fullName}</div> : null}
          </div>
          <div>
            <input
              className="w-full rounded-[4px] border border-[#dfe4df] bg-[#f9faf9] px-2.5 py-2 text-[12px] outline-none"
              placeholder="Company"
              value={form.company}
              onChange={(event) => updateField('company', event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <input
              className="w-full rounded-[4px] border border-[#dfe4df] bg-[#f9faf9] px-2.5 py-2 text-[12px] outline-none"
              placeholder="Work email"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
            {errors.email ? <div className="mt-1 text-[10px] text-red-600">{errors.email}</div> : null}
          </div>
          <div>
            <input
              className="w-full rounded-[4px] border border-[#dfe4df] bg-[#f9faf9] px-2.5 py-2 text-[12px] outline-none"
              placeholder="Phone"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
            {errors.phone ? <div className="mt-1 text-[10px] text-red-600">{errors.phone}</div> : null}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="w-full rounded-[4px] border border-[#dfe4df] bg-[#f9faf9] px-2.5 py-2 text-[12px] outline-none"
            placeholder="Plant location"
            value={form.plantLocation}
            onChange={(event) => updateField('plantLocation', event.target.value)}
          />
          <input
            className="w-full rounded-[4px] border border-[#dfe4df] bg-[#f9faf9] px-2.5 py-2 text-[12px] outline-none"
            placeholder="Annual consumption (optional)"
            value={form.annualConsumption}
            onChange={(event) => updateField('annualConsumption', event.target.value)}
          />
        </div>

        <label className="flex items-start gap-2 text-[10px] text-[#586f66]">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(event) => updateField('consent', event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#c9d5ce] text-[#0f7a57]"
          />
          I agree to SWID contacting me about this report. We don&apos;t share your details with vendors.
        </label>
        {errors.consent ? <div className="text-[10px] text-red-600">{errors.consent}</div> : null}

        {submitted ? <div className="text-[10px] font-semibold text-green-700">Your report request was submitted successfully.</div> : null}

        <button type="submit" className="w-full rounded-[4px] bg-[#17a568] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_4px_12px_rgba(23,165,104,0.25)] transition hover:bg-[#128c5d]">
          Send me the full report
        </button>
      </form>
    </div>
  );
}
