const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const rows = await prisma.vehicleImage.findMany({ take: 10 });
    console.log('OK — found', rows.length, 'VehicleImage rows');
  } catch (err) {
    console.error('ERROR from Prisma test script:');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
})();