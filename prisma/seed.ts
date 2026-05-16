import fs from 'node:fs';
import path from 'node:path';

import { PrismaNeon } from '@prisma/adapter-neon';
import { BoatState, PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SKIP_NAMES = new Set([
  'Calendar Website',
  'Doodle Bot',
  'Forms Forms',
  'Google Drive',
  'Hamell Hamell',
  'Natalia Natalia',
  'Notion Notifications',
  'Polly Polly',
  'rentout archive',
  'Simple Poll',
  'Steffi Steffi',
  'Zoom Zoom',
]);

function loadMembersFromCsv() {
  const csvPath = path.join(__dirname, 'seed-data', 'User_Download_14052026_210824.csv');
  const lines = fs.readFileSync(csvPath, 'utf-8').split('\n').slice(1); // skip header
  const members = [];
  for (const line of lines) {
    const cols = line.split(',');
    if (cols.length < 3) continue;
    const firstName = cols[0].trim();
    const lastName = cols[1].trim();
    const email = cols[2].trim().toLowerCase();
    if (!email || !firstName) continue;
    if (SKIP_NAMES.has(`${firstName} ${lastName}`.trim())) continue;
    members.push({ firstName, lastName, email, squad: null as string | null, isActive: true });
  }
  return members;
}

const members = loadMembersFromCsv();

const NON_BOAT_PATTERN = /^(Erg|Bike)\s/i;

function categoryFromRow(description: string, capacity: number, isSweep: boolean): string {
  const desc = description.trim().toUpperCase();
  if (desc === 'SINGLE') return '1x';
  if (desc === '2X') return '2x';
  if (desc === '4X') return '4x';
  if (isSweep && capacity >= 8) return '8+';
  if (isSweep && capacity >= 4) return '4+';
  if (isSweep && capacity >= 2) return '2-';
  if (capacity >= 8) return '8x';
  if (capacity >= 4) return '4x';
  if (capacity >= 2) return '2x';
  return '1x';
}

function loadBoatsFromCsv() {
  const csvPath = path.join(__dirname, 'seed-data', 'Resources.csv');
  const lines = fs.readFileSync(csvPath, 'utf-8').split('\n').slice(1);
  const boats = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    // columns: Resource Id, Resource Name, Building Id, Resource Category, Resource Type, Floor Name, Capacity, Floor Section, User Visible Description, Description, #Scull, #Sweep
    const cols = line.split(',');
    if (cols.length < 12) continue;
    const name = cols[1].trim();
    const resourceType = cols[4].trim();
    const capacity = parseInt(cols[6].trim(), 10) || 0;
    const description = cols[8].trim();
    const isSweep = cols[11].trim().toUpperCase() === 'TRUE';
    if (!name) continue;
    if (resourceType === 'Trailer') continue;
    if (NON_BOAT_PATTERN.test(name)) continue;
    if (capacity === 0) continue;
    boats.push({
      name,
      category: categoryFromRow(description, capacity, isSweep),
      state: BoatState.AVAILABLE,
    });
  }
  return boats;
}

const boats = loadBoatsFromCsv();

async function main() {
  console.log('Seeding members...');
  const memberEmails = members.map((m) => m.email);
  const staleMembers = await prisma.member.findMany({ where: { email: { notIn: memberEmails } }, select: { id: true } });
  if (staleMembers.length) {
    await prisma.member.deleteMany({ where: { id: { in: staleMembers.map((m) => m.id) } } });
    console.log(`Deleted ${staleMembers.length} stale members.`);
  }
  for (const member of members) {
    await prisma.member.upsert({
      where: { email: member.email },
      update: { firstName: member.firstName, lastName: member.lastName },
      create: member,
    });
  }
  console.log(`Seeded ${members.length} members.`);

  console.log('Seeding boats...');
  const boatNames = boats.map((b) => b.name);
  const stale = await prisma.boat.findMany({ where: { name: { notIn: boatNames } }, select: { id: true } });
  if (stale.length) {
    await prisma.session.deleteMany({ where: { boatId: { in: stale.map((b) => b.id) } } });
    await prisma.boat.deleteMany({ where: { id: { in: stale.map((b) => b.id) } } });
    console.log(`Deleted ${stale.length} stale boats.`);
  }
  for (const boat of boats) {
    await prisma.boat.upsert({
      where: { name: boat.name },
      update: { category: boat.category },
      create: boat,
    });
  }
  console.log(`Seeded ${boats.length} boats.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
