const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// High-quality car images - using Unsplash with specific car model searches
const carPhotos = {
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

async function main() {
  console.log('\n🚗 Updating vehicle images with real car photos...\n');

  const vehicles = await prisma.vehicle.findMany({
    include: { images: true }
  });

  console.log(`Found ${vehicles.length} vehicles\n`);

  for (const vehicle of vehicles) {
    const photos = carPhotos[vehicle.title] || [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format&q=80'
    ];

    console.log(`📸 ${vehicle.title}`);

    // Delete old images
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

    console.log(`   ✓ Updated with ${photos.length} photo(s)\n`);
  }

  console.log('✅ All vehicles updated!\n');
  console.log('🔄 Refresh your browser to see the new car photos\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
