// Update vehicle images to use local paths instead of placehold.co
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const vehicleImageMap = {
  'Toyota Land Cruiser Prado': '/images/images/vehicles/toyota-land-cruiser-prado.svg',
  'Nissan X-Trail': '/images/images/vehicles/nissan-xtrail.svg',
  'Mitsubishi Pajero': '/images/images/vehicles/mitsubishi-pajero.svg',
  'Toyota Camry': '/images/images/vehicles/toyota-camry.svg',
  'Honda Accord': '/images/images/vehicles/honda-accord.svg',
  'Toyota Prius': '/images/images/vehicles/toyota-prius.svg',
  'Toyota Hilux Double Cab': '/images/images/vehicles/toyota-hilux.svg',
  'Isuzu D-Max': '/images/images/vehicles/isuzu-dmax.svg',
  'Nissan Note': '/images/images/vehicles/nissan-note.svg',
  'Toyota Vitz': '/images/images/vehicles/toyota-vitz.svg'
};

async function updateImages() {
  try {
    // Get all vehicles
    const vehicles = await prisma.vehicle.findMany({
      include: { images: true }
    });

    console.log(`Found ${vehicles.length} vehicles to update\n`);

    for (const vehicle of vehicles) {
      const imagePath = vehicleImageMap[vehicle.title];
      
      if (imagePath) {
        // Delete old images
        if (vehicle.images.length > 0) {
          await prisma.vehicleImage.deleteMany({
            where: { vehicleId: vehicle.id }
          });
        }

        // Create new image with local path
        await prisma.vehicleImage.create({
          data: {
            vehicleId: vehicle.id,
            url: imagePath,
            order: 0
          }
        });

        console.log(`✅ Updated: ${vehicle.title}`);
      } else {
        console.log(`⚠️  No mapping for: ${vehicle.title}`);
      }
    }

    console.log('\n✅ All images updated to local paths!');
    console.log('Refresh your browser to see the images.');
  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImages();
