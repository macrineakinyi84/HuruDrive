/**
 * Script to download car images from free sources and update database
 * Uses Unsplash API (free) and provides fallback URLs
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const https = require('https');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Free car image URLs from Unsplash (no API key needed for basic usage)
// These are direct links to high-quality car images
const CAR_IMAGES = {
  'Toyota Land Cruiser Prado': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
  'Nissan X-Trail': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  'Mitsubishi Pajero': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  'Toyota Camry': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  'Honda Accord': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  'Toyota Prius': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  'Toyota Hilux Double Cab': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  'Isuzu D-Max': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  'Nissan Note': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
  'Toyota Vitz': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
};

// Alternative: Use Pexels free images (no API key needed)
const PEXELS_CAR_IMAGES = {
  'Toyota Land Cruiser Prado': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Nissan X-Trail': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Mitsubishi Pajero': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Toyota Camry': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Honda Accord': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Toyota Prius': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Toyota Hilux Double Cab': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Isuzu D-Max': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Nissan Note': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  'Toyota Vitz': 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
};

// Better: Use specific car model images from free sources
// These URLs point to actual car images (you can replace with your own)
const SPECIFIC_CAR_IMAGES = {
  'Toyota Land Cruiser Prado': [
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
  ],
  'Nissan X-Trail': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
  'Mitsubishi Pajero': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
  'Toyota Camry': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
  'Honda Accord': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
  'Toyota Prius': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
  'Toyota Hilux Double Cab': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
  'Isuzu D-Max': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
  'Nissan Note': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
  'Toyota Vitz': [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
  ],
};

async function updateVehicleImages() {
  try {
    console.log('🚗 Starting to update vehicle images...\n');

    // Get all vehicles from database
    const vehicles = await prisma.vehicle.findMany({
      include: {
        images: true
      }
    });

    console.log(`Found ${vehicles.length} vehicles in database\n`);

    for (const vehicle of vehicles) {
      // Try to find matching images by title or make/model
      let imageUrls = SPECIFIC_CAR_IMAGES[vehicle.title];
      
      if (!imageUrls) {
        // Try to match by make and model
        const makeModel = `${vehicle.make} ${vehicle.model}`;
        imageUrls = SPECIFIC_CAR_IMAGES[makeModel] || CAR_IMAGES[vehicle.title] || CAR_IMAGES[makeModel];
      }
      
      // If still no match, use default car image
      if (!imageUrls) {
        imageUrls = ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'];
      }
      
      // Ensure imageUrls is an array
      if (!Array.isArray(imageUrls)) {
        imageUrls = [imageUrls];
      }

      console.log(`Updating images for: ${vehicle.title}`);

      // Delete existing images
      await prisma.vehicleImage.deleteMany({
        where: { vehicleId: vehicle.id }
      });

      // Create new images
      for (let i = 0; i < imageUrls.length; i++) {
        if (imageUrls[i]) { // Ensure URL exists
          await prisma.vehicleImage.create({
            data: {
              vehicleId: vehicle.id,
              url: imageUrls[i],
              order: i
            }
          });
        }
      }

      console.log(`✅ Updated ${imageUrls.length} image(s) for ${vehicle.title}\n`);
    }

    console.log('✨ All vehicle images updated successfully!');
    console.log('\n💡 Note: These are placeholder URLs from Unsplash.');
    console.log('   For production, replace with your own car images or download them locally.');

  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateVehicleImages();
