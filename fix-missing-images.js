const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Better, more reliable car images - using different Unsplash sources
const reliableCarImages = {
  'Toyota Land Cruiser Prado': [
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1621961302330-f014f4b1f1b1?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Nissan X-Trail': [
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Mitsubishi Pajero': [
    'https://images.unsplash.com/photo-1568605117036-ba68f9eedc31?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Toyota Camry': [
    'https://images.unsplash.com/photo-1593290856432-235e0500014e?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Honda Accord': [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1542282085-f45d8a220203?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Toyota Prius': [
    'https://images.unsplash.com/photo-1542282085-f45d8a220203?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1517672651788-f58b18076c84?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Toyota Hilux Double Cab': [
    'https://images.unsplash.com/photo-1517672651788-f58b18076c84?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1525609004346-c44b6ad77900?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Isuzu D-Max': [
    'https://images.unsplash.com/photo-1525609004346-c44b6ad77900?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Nissan Note': [
    'https://images.unsplash.com/photo-1514316703755-063ba83780a4?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1fd4baeb?w=800&h=600&fit=crop&auto=format&q=80'
  ],
  'Toyota Vitz': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1fd4baeb?w=800&h=600&fit=crop&auto=format&q=80'
  ]
};

async function fixImages() {
  console.log('\n🔧 Fixing vehicle images...\n');

  const vehicles = await prisma.vehicle.findMany({
    include: { images: true }
  });

  for (const vehicle of vehicles) {
    const photos = reliableCarImages[vehicle.title] || [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format&q=80'
    ];

    // Check if images exist and are correct
    const hasCorrectImages = vehicle.images.length > 0 && 
      vehicle.images.every(img => 
        img.url.includes('unsplash.com') && 
        !img.url.includes('placehold.co')
      );

    if (!hasCorrectImages) {
      console.log(`Fixing: ${vehicle.title}`);

      // Delete all existing images
      if (vehicle.images.length > 0) {
        await prisma.vehicleImage.deleteMany({
          where: { vehicleId: vehicle.id }
        });
      }

      // Add new images
      for (let i = 0; i < photos.length; i++) {
        await prisma.vehicleImage.create({
          data: {
            vehicleId: vehicle.id,
            url: photos[i],
            order: i
          }
        });
      }

      console.log(`  ✓ Fixed with ${photos.length} image(s)\n`);
    } else {
      console.log(`✅ ${vehicle.title}: Already has correct images\n`);
    }
  }

  console.log('✅ All images verified and fixed!\n');
}

fixImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
