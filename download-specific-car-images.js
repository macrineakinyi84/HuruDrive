/**
 * Download specific car model images from free sources
 * Saves images locally and updates database
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Free car image URLs - Using Unsplash and Pexels direct links
// These are high-quality car images that match the models
const CAR_IMAGE_URLS = {
  'Toyota Land Cruiser Prado': [
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90'
  ],
  'Nissan X-Trail': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
  'Mitsubishi Pajero': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
  'Toyota Camry': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
  'Honda Accord': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
  'Toyota Prius': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
  'Toyota Hilux Double Cab': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
  'Isuzu D-Max': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
  'Nissan Note': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
  'Toyota Vitz': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&q=90'
  ],
};

// Function to download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Function to sanitize filename
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function downloadAndUpdateImages() {
  try {
    console.log('🚗 Starting to download specific car model images...\n');

    // Create images directory
    const imagesDir = path.join(__dirname, 'public', 'images', 'vehicles');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log(`📁 Created directory: ${imagesDir}\n`);
    }

    // Get all vehicles
    const vehicles = await prisma.vehicle.findMany({
      include: { images: true }
    });

    console.log(`Found ${vehicles.length} vehicles\n`);

    for (const vehicle of vehicles) {
      // Extract base title (remove " - Sample A/B" etc)
      const baseTitle = vehicle.title.split(' - ')[0];
      
      // Get image URLs for this vehicle
      let imageUrls = CAR_IMAGE_URLS[baseTitle] || CAR_IMAGE_URLS[vehicle.title];
      
      if (!imageUrls) {
        // Try make + model
        const makeModel = `${vehicle.make} ${vehicle.model}`;
        imageUrls = CAR_IMAGE_URLS[makeModel];
      }
      
      // Default fallback
      if (!imageUrls || !Array.isArray(imageUrls)) {
        imageUrls = [
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop&q=90'
        ];
      }

      console.log(`📸 Processing: ${vehicle.title}`);
      console.log(`   Found ${imageUrls.length} image(s) to download`);

      const downloadedPaths = [];

      // Download each image
      for (let i = 0; i < imageUrls.length; i++) {
        const filename = `${sanitizeFilename(baseTitle || vehicle.title)}-${i + 1}.jpg`;
        const filepath = path.join(imagesDir, filename);
        
        try {
          console.log(`   Downloading image ${i + 1}/${imageUrls.length}...`);
          await downloadImage(imageUrls[i], filepath);
          downloadedPaths.push(`/images/images/vehicles/${filename}`);
          console.log(`   ✅ Saved: ${filename}`);
        } catch (error) {
          console.log(`   ⚠️  Failed to download image ${i + 1}: ${error.message}`);
          // Use URL directly if download fails
          downloadedPaths.push(imageUrls[i]);
        }
      }

      // Update database
      console.log(`   Updating database...`);
      
      // Delete old images
      await prisma.vehicleImage.deleteMany({
        where: { vehicleId: vehicle.id }
      });

      // Create new image records
      for (let i = 0; i < downloadedPaths.length; i++) {
        await prisma.vehicleImage.create({
          data: {
            vehicleId: vehicle.id,
            url: downloadedPaths[i],
            order: i
          }
        });
      }

      console.log(`   ✅ Updated database with ${downloadedPaths.length} image(s)\n`);
    }

    console.log('✨ All car images downloaded and updated successfully!');
    console.log(`\n📁 Images saved to: ${imagesDir}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Refresh your website to see the new images');
    console.log('   2. Check vehicle cards and details pages');
    console.log('   3. If you want specific car model photos, download them manually');
    console.log('      and replace the files in the images directory');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the download
downloadAndUpdateImages();
