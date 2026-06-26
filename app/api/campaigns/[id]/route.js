import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getCampaign, updateCampaign, deleteCampaign } from '@/lib/db';
import { validateCampaignData } from '@/lib/validation';

export async function GET(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const campaign = await getCampaign(session.user.id, id);
  if (!campaign) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ campaign });
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const errors = validateCampaignData(data);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  const campaign = await updateCampaign(session.user.id, id, data);
  if (!campaign) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ campaign });
}

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const ok = await deleteCampaign(session.user.id, id);
  if (!ok) return Response.json({ error: 'Not found' }, { status: 404 });

  return new Response(null, { status: 204 });
}
