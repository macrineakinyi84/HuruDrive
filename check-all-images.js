const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  console.log('\n🔍 Checking all vehicle images...\n');
  
  const vehicles = await prisma.vehicle.findMany({
    include: { images: true },
    orderBy: { title: 'asc' }
  });
  
  let withImages = 0;
  let withoutImages = 0;
  
  vehicles.forEach(vehicle => {
    if (vehicle.images.length > 0) {
      withImages++;
      console.log(`✅ ${vehicle.title}: ${vehicle.images.length} image(s)`);
      vehicle.images.forEach(img => {
        const isPlaceholder = img.url.includes('placehold.co');
        console.log(`   ${isPlaceholder ? '⚠️ PLACEHOLDER' : '📸'} ${img.url.substring(0, 70)}...`);
      });
    } else {
      withoutImages++;
      console.log(`❌ ${vehicle.title}: NO IMAGES`);
    }
    console.log('');
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ With images: ${withImages}`);
  console.log(`   ❌ Without images: ${withoutImages}`);
  console.log(`   📦 Total vehicles: ${vehicles.length}\n`);
  
  await prisma.$disconnect();
})();
