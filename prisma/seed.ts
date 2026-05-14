import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient, BoatState } from '@prisma/client';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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
