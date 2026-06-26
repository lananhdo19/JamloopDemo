'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateCampaignData } from '@/lib/validation';
import { PUBLISHERS, DEVICES, GENDERS, US_STATES, COUNTRIES, CAMPAIGN_STATUSES, DEFAULT_FORM } from '@/lib/constants';

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const errorClass = 'mt-1 text-xs text-red-600';

export default function CampaignForm({ initialData = null, campaignId = null }) {
  const router = useRouter();
  const isEditing = Boolean(campaignId);

  const [form, setForm] = useState(() =>
    initialData
      ? { ...DEFAULT_FORM, ...initialData, demographic: { ...DEFAULT_FORM.demographic, ...initialData.demographic }, geo: { ...DEFAULT_FORM.geo, ...initialData.geo }, budgetGoal: String(initialData.budgetGoal ?? '') }
      : DEFAULT_FORM
  );
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function setNested(group, field, value) {
    setForm((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }));
    setErrors((prev) => ({ ...prev, [`${group}.${field}`]: '' }));
  }

  function toggleArray(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value],
    }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateCampaignData(form);
    if (Object.keys(validationErrors).length) { setErrors(validationErrors); return; }

    setSubmitting(true);
    setApiError('');

    const payload = { ...form, budgetGoal: Number(form.budgetGoal), demographic: { ...form.demographic, ageMin: form.demographic.ageMin ? Number(form.demographic.ageMin) : null, ageMax: form.demographic.ageMax ? Number(form.demographic.ageMax) : null } };

    try {
      const res = await fetch(isEditing ? `/api/campaigns/${campaignId}` : '/api/campaigns', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setApiError(data.error ?? 'Something went wrong.'); return; }
      router.push('/campaigns');
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{apiError}</div>}

      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Campaign Name <span className="text-orange-500">*</span></label>
            <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Summer 2025 Brand Awareness" />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value)}>
              {CAMPAIGN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Budget Goal (USD) <span className="text-orange-500">*</span></label>
            <input className={inputClass} type="number" min="1" value={form.budgetGoal} onChange={(e) => set('budgetGoal', e.target.value)} placeholder="50000" />
            {errors.budgetGoal && <p className={errorClass}>{errors.budgetGoal}</p>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Schedule</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Start Date <span className="text-orange-500">*</span></label>
            <input className={inputClass} type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
            {errors.startDate && <p className={errorClass}>{errors.startDate}</p>}
          </div>
          <div>
            <label className={labelClass}>End Date <span className="text-orange-500">*</span></label>
            <input className={inputClass} type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} min={form.startDate || undefined} />
            {errors.endDate && <p className={errorClass}>{errors.endDate}</p>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Target Demographic</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Min Age</label>
            <input className={inputClass} type="number" min="13" max="100" value={form.demographic.ageMin} onChange={(e) => setNested('demographic', 'ageMin', e.target.value)} placeholder="18" />
          </div>
          <div>
            <label className={labelClass}>Max Age</label>
            <input className={inputClass} type="number" min="13" max="100" value={form.demographic.ageMax} onChange={(e) => setNested('demographic', 'ageMax', e.target.value)} placeholder="54" />
            {errors['demographic.ageMax'] && <p className={errorClass}>{errors['demographic.ageMax']}</p>}
          </div>
          <div>
            <label className={labelClass}>Gender</label>
            <select className={inputClass} value={form.demographic.gender} onChange={(e) => setNested('demographic', 'gender', e.target.value)}>
              {GENDERS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Geography</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Country</label>
            <select className={inputClass} value={form.geo.country} onChange={(e) => setNested('geo', 'country', e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select className={inputClass} value={form.geo.state} onChange={(e) => setNested('geo', 'state', e.target.value)}>
              <option value="">All states</option>
              {US_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input className={inputClass} value={form.geo.city} onChange={(e) => setNested('geo', 'city', e.target.value)} placeholder="Los Angeles" />
          </div>
          <div>
            <label className={labelClass}>Zip Code</label>
            <input className={inputClass} value={form.geo.zipCode} onChange={(e) => setNested('geo', 'zipCode', e.target.value)} placeholder="90001" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Publishers <span className="text-orange-500">*</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PUBLISHERS.map((p) => (
            <label key={p} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.publishers.includes(p)} onChange={() => toggleArray('publishers', p)} className="h-4 w-4 rounded border-gray-300" />
              {p}
            </label>
          ))}
        </div>
        {errors.publishers && <p className={errorClass}>{errors.publishers}</p>}
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Devices <span className="text-orange-500">*</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DEVICES.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.devices.includes(d)} onChange={() => toggleArray('devices', d)} className="h-4 w-4 rounded border-gray-300" />
              {d}
            </label>
          ))}
        </div>
        {errors.devices && <p className={errorClass}>{errors.devices}</p>}
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={() => router.push('/campaigns')} disabled={submitting} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded disabled:opacity-50">
          {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Campaign'}
        </button>
      </div>
    </form>
  );
}
