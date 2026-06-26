'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import CampaignForm from '@/components/campaigns/CampaignForm';

export default function EditCampaignPage({ params }) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/campaigns/${id}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => { if (data) setCampaign(data.campaign); });
  }, [id]);

  if (notFound) return <p className="text-gray-500 py-12 text-center">Campaign not found.</p>;
  if (!campaign) return <p className="text-gray-400 py-12 text-center">Loading...</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-1">Edit Campaign</h1>
      <p className="text-sm text-gray-500 mb-6">{campaign.name}</p>
      <CampaignForm initialData={campaign} campaignId={id} />
    </>
  );
}
