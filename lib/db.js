import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const CAMPAIGNS_FILE = path.join(process.cwd(), '.data', 'campaigns.json');
const USERS_FILE = path.join(process.cwd(), '.data', 'users.json');

async function readFile(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return [];
  }
}

async function writeFile(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function findUser(email, password) {
  const users = await readFile(USERS_FILE);
  return users.find((u) => u.email === email && u.password === password) ?? null;
}

export async function listCampaigns(userId) {
  const campaigns = await readFile(CAMPAIGNS_FILE);
  return campaigns
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getCampaign(userId, id) {
  const campaigns = await readFile(CAMPAIGNS_FILE);
  return campaigns.find((c) => c.id === id && c.userId === userId) ?? null;
}

export async function createCampaign(userId, data) {
  const campaigns = await readFile(CAMPAIGNS_FILE);
  const campaign = {
    ...data,
    id: randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  campaigns.push(campaign);
  await writeFile(CAMPAIGNS_FILE, campaigns);
  return campaign;
}

export async function updateCampaign(userId, id, data) {
  const campaigns = await readFile(CAMPAIGNS_FILE);
  const index = campaigns.findIndex((c) => c.id === id && c.userId === userId);
  if (index === -1) return null;
  
  campaigns[index] = { ...campaigns[index], ...data, id, userId, updatedAt: new Date().toISOString() };
  await writeFile(CAMPAIGNS_FILE, campaigns);
  return campaigns[index];
}

export async function deleteCampaign(userId, id) {
  const campaigns = await readFile(CAMPAIGNS_FILE);
  const index = campaigns.findIndex((c) => c.id === id && c.userId === userId);
  if (index === -1) return false;
  
  campaigns.splice(index, 1);
  await writeFile(CAMPAIGNS_FILE, campaigns);
  return true;
}
