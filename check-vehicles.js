const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const count = await prisma.vehicle.count();
    const available = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
    const all = await prisma.vehicle.findMany({ 
      select: { id: true, title: true, status: true, location: true } 
    });
    
    console.log('\n=== Vehicle Database Check ===\n');
    console.log('Total vehicles:', count);
    console.log('Available vehicles:', available);
    console.log('\nAll vehicles:');
    console.log(JSON.stringify(all, null, 2));
    
    if (count === 0) {
      console.log('\n⚠️  No vehicles in database!');
      console.log('Run: npm run prisma:seed');
    } else if (available === 0) {
      console.log('\n⚠️  No AVAILABLE vehicles!');
      console.log('All vehicles have status other than AVAILABLE.');
      console.log('Updating all vehicles to AVAILABLE...');
      
      await prisma.vehicle.updateMany({
        where: {},
        data: { status: 'AVAILABLE' }
      });
      
      console.log('✅ All vehicles updated to AVAILABLE');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
