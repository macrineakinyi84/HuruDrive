require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection OK');
    
    // Check if we have vehicles
    const count = await prisma.vehicle.count();
    console.log(`✓ Found ${count} vehicles in database`);
    
    if (count === 0) {
      console.log('⚠ No vehicles found. Run: npm run prisma:seed');
    }
  } catch (error) {
    console.error('✗ Database error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

test();
