import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient, BoatState } from '@prisma/client';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const members = [
  { googleUserId: 'dummy-001', displayName: 'Alice Morgan',    email: 'alice.morgan@club.org',    squad: 'Senior' },
  { googleUserId: 'dummy-002', displayName: 'Ben Hartley',     email: 'ben.hartley@club.org',     squad: 'Senior' },
  { googleUserId: 'dummy-003', displayName: 'Clara Jensen',    email: 'clara.jensen@club.org',    squad: 'Junior' },
  { googleUserId: 'dummy-004', displayName: 'David Okafor',    email: 'david.okafor@club.org',    squad: 'Senior' },
  { googleUserId: 'dummy-005', displayName: 'Emma Sutton',     email: 'emma.sutton@club.org',     squad: 'Masters' },
  { googleUserId: 'dummy-006', displayName: 'Finn Lowe',       email: 'finn.lowe@club.org',       squad: 'Junior' },
  { googleUserId: 'dummy-007', displayName: 'Grace Patel',     email: 'grace.patel@club.org',     squad: 'Senior' },
  { googleUserId: 'dummy-008', displayName: 'Hugo Brennan',    email: 'hugo.brennan@club.org',    squad: 'Masters' },
  { googleUserId: 'dummy-009', displayName: 'Isla McKenzie',   email: 'isla.mckenzie@club.org',   squad: 'Senior' },
  { googleUserId: 'dummy-010', displayName: 'Jack Rowe',       email: 'jack.rowe@club.org',       squad: 'Junior' },
  { googleUserId: 'dummy-011', displayName: 'Kate Drummond',   email: 'kate.drummond@club.org',   squad: 'Senior' },
  { googleUserId: 'dummy-012', displayName: 'Leo Vasquez',     email: 'leo.vasquez@club.org',     squad: 'Senior' },
  { googleUserId: 'dummy-013', displayName: 'Maya Thornton',   email: 'maya.thornton@club.org',   squad: 'Masters' },
  { googleUserId: 'dummy-014', displayName: 'Noah Fitzgerald', email: 'noah.fitzgerald@club.org', squad: 'Junior' },
  { googleUserId: 'dummy-015', displayName: 'Olivia Chan',     email: 'olivia.chan@club.org',     squad: 'Senior' },
  { googleUserId: 'dummy-016', displayName: 'Pete Samuels',    email: 'pete.samuels@club.org',    squad: 'Masters' },
  { googleUserId: 'dummy-017', displayName: 'Quinn Adler',     email: 'quinn.adler@club.org',     squad: 'Senior' },
  { googleUserId: 'dummy-018', displayName: 'Rosa Billings',   email: 'rosa.billings@club.org',   squad: 'Junior' },
  { googleUserId: 'dummy-019', displayName: 'Sam Whitfield',   email: 'sam.whitfield@club.org',   squad: 'Senior' },
  { googleUserId: 'dummy-020', displayName: 'Tara Nguyen',     email: 'tara.nguyen@club.org',     squad: 'Masters' },
];

const boats = [
  { name: 'Heron',      category: '1x', yearBuilt: 2021, weightKg: 14, state: BoatState.AVAILABLE },
  { name: 'Kingfisher', category: '2x', yearBuilt: 2019, weightKg: 27, state: BoatState.AVAILABLE },
  { name: 'Stormcock',  category: '4x', yearBuilt: 2017, weightKg: 52, state: BoatState.AVAILABLE },
  { name: 'Otter',      category: '1x', yearBuilt: 2022, weightKg: 14, state: BoatState.AVAILABLE },
  { name: 'Mallard',    category: '2-', yearBuilt: 2018, weightKg: 26, state: BoatState.AVAILABLE },
  { name: 'Curlew',     category: '4+', yearBuilt: 2020, weightKg: 52, state: BoatState.AVAILABLE },
  { name: 'Bittern',    category: '2x', yearBuilt: 2023, weightKg: 27, state: BoatState.AVAILABLE },
  { name: 'Pintail',    category: '8+', yearBuilt: 2015, weightKg: 96, state: BoatState.MAINTENANCE },
  { name: 'Lapwing',    category: '4x', yearBuilt: 2019, weightKg: 52, state: BoatState.AVAILABLE },
  { name: 'Tern',       category: '1x', yearBuilt: 2020, weightKg: 14, state: BoatState.AVAILABLE },
  { name: 'Razorbill',  category: '2x', yearBuilt: 2018, weightKg: 27, state: BoatState.AVAILABLE },
  { name: 'Shearwater', category: '4+', yearBuilt: 2022, weightKg: 54, state: BoatState.AVAILABLE },
];

async function main() {
  console.log('Seeding members...');
  for (const member of members) {
    await prisma.member.upsert({
      where: { googleUserId: member.googleUserId },
      update: { displayName: member.displayName, email: member.email, squad: member.squad },
      create: member,
    });
  }
  console.log(`Seeded ${members.length} members.`);

  console.log('Seeding boats...');
  for (const boat of boats) {
    await prisma.boat.upsert({
      where: { name: boat.name },
      update: {},
      create: boat,
    });
  }
  console.log(`Seeded ${boats.length} boats.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
