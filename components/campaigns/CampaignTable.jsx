'use client';

import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/helpers';

export default function CampaignTable({ campaigns, onDelete }) {
  if (!campaigns?.length) {
    return <p className="text-gray-500 py-8 text-center">No campaigns yet.</p>;
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return;
    await onDelete(id);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {['Campaign', 'Status', 'Budget', 'Date Range', 'Publishers', 'Devices', ''].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs text-gray-500 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-b border-gray-100">
              <td className="px-3 py-2 font-medium">{c.name}</td>
              <td className="px-3 py-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {c.status}
                </span>
              </td>
              <td className="px-3 py-2">{formatCurrency(c.budgetGoal)}</td>
              <td className="px-3 py-2 text-gray-500">{formatDate(c.startDate)} – {formatDate(c.endDate)}</td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-1">
                  {c.publishers?.slice(0, 2).map((p) => (
                    <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p}</span>
                  ))}
                  {c.publishers?.length > 2 && <span className="text-xs text-gray-400">+{c.publishers.length - 2}</span>}
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-1">
                  {c.devices?.slice(0, 2).map((d) => (
                    <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{d}</span>
                  ))}
                  {c.devices?.length > 2 && <span className="text-xs text-gray-400">+{c.devices.length - 2}</span>}
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <Link href={`/campaigns/${c.id}/edit`} className="text-xs text-gray-500 hover:text-gray-900">Edit</Link>
                  <button onClick={() => handleDelete(c.id, c.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
