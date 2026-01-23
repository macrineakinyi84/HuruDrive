const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const vehicle = await prisma.vehicle.findFirst({
    include: { images: true }
  });
  
  console.log('\n✅ Sample Vehicle:', vehicle.title);
  console.log('📸 Images:', vehicle.images.length);
  vehicle.images.forEach((img, i) => {
    console.log(`   ${i + 1}. ${img.url.substring(0, 70)}...`);
  });
  
  await prisma.$disconnect();
})();
