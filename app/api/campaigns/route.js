import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { listCampaigns, createCampaign } from '@/lib/db';
import { validateCampaignData } from '@/lib/validation';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  return Response.json({ campaigns: await listCampaigns(session.user.id) });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const errors = validateCampaignData(data);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

  const campaign = await createCampaign(session.user.id, data);
  return Response.json({ campaign }, { status: 201 });
}
