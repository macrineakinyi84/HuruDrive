const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Upsert admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin',
      phone: '0700000000',
      passwordHash: 'changeme', // placeholder — replace with a real hash for production
      role: 'ADMIN'
    },
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      phone: '0700000000',
      passwordHash: 'changeme', // placeholder
      role: 'ADMIN'
    }
  });
  console.log('Admin user:', { id: admin.id, email: admin.email });

  // Create sample vehicles - 10 diverse vehicles
  const vehicles = [
    // SUVs
    {
      title: 'Toyota Land Cruiser Prado',
      make: 'Toyota',
      model: 'Land Cruiser Prado',
      year: 2020,
      category: 'SUV',
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      location: 'Nairobi',
      dailyPrice: 15000,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Toyota+Land+Cruiser+Prado', order: 0 }
      ]
    },
    {
      title: 'Nissan X-Trail',
      make: 'Nissan',
      model: 'X-Trail',
      year: 2019,
      category: 'SUV',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      location: 'Nairobi',
      dailyPrice: 8000,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/2c3e50/ffffff?text=Nissan+X-Trail', order: 0 }
      ]
    },
    {
      title: 'Mitsubishi Pajero',
      make: 'Mitsubishi',
      model: 'Pajero',
      year: 2018,
      category: 'SUV',
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Diesel',
      location: 'Mombasa',
      dailyPrice: 12000,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/34495e/ffffff?text=Mitsubishi+Pajero', order: 0 }
      ]
    },
    // Sedans
    {
      title: 'Toyota Camry',
      make: 'Toyota',
      model: 'Camry',
      year: 2021,
      category: 'Sedan',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      location: 'Nairobi',
      dailyPrice: 5000,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/3498db/ffffff?text=Toyota+Camry', order: 0 }
      ]
    },
    {
      title: 'Honda Accord',
      make: 'Honda',
      model: 'Accord',
      year: 2020,
      category: 'Sedan',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      location: 'Nairobi',
      dailyPrice: 4500,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/e74c3c/ffffff?text=Honda+Accord', order: 0 }
      ]
    },
    {
      title: 'Toyota Prius',
      make: 'Toyota',
      model: 'Prius',
      year: 2019,
      category: 'Sedan',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      location: 'Nakuru',
      dailyPrice: 4000,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/27ae60/ffffff?text=Toyota+Prius', order: 0 }
      ]
    },
    // Trucks
    {
      title: 'Toyota Hilux Double Cab',
      make: 'Toyota',
      model: 'Hilux',
      year: 2021,
      category: 'Truck',
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Diesel',
      location: 'Nairobi',
      dailyPrice: 10000,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/f39c12/ffffff?text=Toyota+Hilux', order: 0 }
      ]
    },
    {
      title: 'Isuzu D-Max',
      make: 'Isuzu',
      model: 'D-Max',
      year: 2020,
      category: 'Truck',
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Diesel',
      location: 'Eldoret',
      dailyPrice: 9000,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/e67e22/ffffff?text=Isuzu+D-Max', order: 0 }
      ]
    },
    // Hatchbacks
    {
      title: 'Nissan Note',
      make: 'Nissan',
      model: 'Note',
      year: 2019,
      category: 'Hatchback',
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Petrol',
      location: 'Nakuru',
      dailyPrice: 2500,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/9b59b6/ffffff?text=Nissan+Note', order: 0 }
      ]
    },
    {
      title: 'Toyota Vitz',
      make: 'Toyota',
      model: 'Vitz',
      year: 2020,
      category: 'Hatchback',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      location: 'Kisumu',
      dailyPrice: 3000,
      status: 'AVAILABLE',
      images: [
        { url: 'https://placehold.co/600x400/16a085/ffffff?text=Toyota+Vitz', order: 0 }
      ]
    }
  ];

  // Create all vehicles and store first vehicle for booking
  let firstVehicleId = null;
  for (const vehicleData of vehicles) {
    const { images, ...vehicleInfo } = vehicleData;
    const vehicle = await prisma.vehicle.create({
      data: {
        ...vehicleInfo,
        images: {
          create: images
        }
      }
    });
    if (!firstVehicleId) {
      firstVehicleId = vehicle.id; // Store first vehicle ID for booking
    }
    console.log('Created vehicle:', { id: vehicle.id, title: vehicle.title, category: vehicle.category });
  }

  // Create a sample booking for admin and first vehicle
  if (firstVehicleId) {
    const pickupAt = new Date();
    const returnAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // +1 day
    const booking = await prisma.booking.create({
      data: {
        userId: admin.id,
        vehicleId: firstVehicleId,
        pickupLocation: 'Nairobi CBD',
        returnLocation: 'Nairobi CBD',
        pickupAt,
        returnAt,
        totalPrice: 15000,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    });
    console.log('Created booking:', { id: booking.id, userId: booking.userId, vehicleId: booking.vehicleId });
  }

  // Create a payment placeholder
  await prisma.payment.create({
    data: {
      userId: admin.id,
      provider: 'stripe',
      amount: 3000,
      currency: 'KES',
      status: 'PENDING'
    }
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });