'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CampaignTable from '@/components/campaigns/CampaignTable';
import { formatCurrency } from '@/lib/helpers';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns ?? []));
  }, []);

  async function handleDelete(id) {
    const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    if (res.ok) setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }

  const active = campaigns.filter((c) => c.status === 'active');
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budgetGoal ?? 0), 0);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Link href="/campaigns/new" className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded">
          + New Campaign
        </Link>
      </div>

      {campaigns.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="border border-gray-200 p-4"><p className="text-xs text-gray-500">Total</p><p className="text-2xl font-bold">{campaigns.length}</p></div>
          <div className="border border-gray-200 p-4"><p className="text-xs text-gray-500">Active</p><p className="text-2xl font-bold text-green-600">{active.length}</p></div>
          <div className="border border-gray-200 p-4"><p className="text-xs text-gray-500">Budget</p><p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p></div>
        </div>
      )}

      <CampaignTable campaigns={campaigns} onDelete={handleDelete} />
    </>
  );
}
