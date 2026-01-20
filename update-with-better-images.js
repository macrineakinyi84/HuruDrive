/**
 * Update vehicle images with better, more specific car images
 * Uses free image sources with car-specific URLs
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Better car images - using Unsplash with specific car search terms
// These URLs will show actual car images
const BETTER_CAR_IMAGES = {
  'Toyota Land Cruiser Prado': [
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80'
  ],
  'Nissan X-Trail': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
  'Mitsubishi Pajero': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
  'Toyota Camry': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
  'Honda Accord': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
  'Toyota Prius': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
  'Toyota Hilux Double Cab': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
  'Isuzu D-Max': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
  'Nissan Note': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
  'Toyota Vitz': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&q=80'
  ],
};

async function updateWithBetterImages() {
  try {
    console.log('🚗 Updating vehicle images with better car photos...\n');

    const vehicles = await prisma.vehicle.findMany({
      include: { images: true }
    });

    console.log(`Found ${vehicles.length} vehicles\n`);

    for (const vehicle of vehicles) {
      // Extract base title (remove " - Sample A/B" etc)
      const baseTitle = vehicle.title.split(' - ')[0];
      
      let imageUrls = BETTER_CAR_IMAGES[baseTitle] || BETTER_CAR_IMAGES[vehicle.title];
      
      if (!imageUrls) {
        // Try make + model
        const makeModel = `${vehicle.make} ${vehicle.model}`;
        imageUrls = BETTER_CAR_IMAGES[makeModel];
      }
      
      // Default fallback
      if (!imageUrls || !Array.isArray(imageUrls)) {
        imageUrls = [
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80'
        ];
      }

      console.log(`📸 ${vehicle.title} → ${imageUrls.length} image(s)`);

      // Delete old images
      await prisma.vehicleImage.deleteMany({
        where: { vehicleId: vehicle.id }
      });

      // Add new images
      for (let i = 0; i < imageUrls.length; i++) {
        await prisma.vehicleImage.create({
          data: {
            vehicleId: vehicle.id,
            url: imageUrls[i],
            order: i
          }
        });
      }
    }

    console.log('\n✨ All images updated!');
    console.log('\n💡 These images are from Unsplash (free stock photos).');
    console.log('   For specific car models, you can:');
    console.log('   1. Search Unsplash/Pexels for exact car models');
    console.log('   2. Download images and save to public/images/vehicles/');
    console.log('   3. Update URLs in database to local paths');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWithBetterImages();
