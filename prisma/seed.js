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

  // Create sample vehicles
  const vehicle1 = await prisma.vehicle.create({
    data: {
      title: 'Toyota Prius - Sample A',
      make: 'Toyota',
      model: 'Prius',
      year: 2018,
      category: 'Sedan',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      location: 'Nairobi',
      dailyPrice: 3000,
      status: 'AVAILABLE',
      images: {
        create: [
          { url: 'https://placehold.co/600x400?text=Prius+1', order: 0 },
          { url: 'https://placehold.co/600x400?text=Prius+2', order: 1 }
        ]
      }
    }
  });
  console.log('Created vehicle:', { id: vehicle1.id, title: vehicle1.title });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      title: 'Nissan Note - Sample B',
      make: 'Nissan',
      model: 'Note',
      year: 2019,
      category: 'Hatchback',
      seats: 5,
      transmission: 'Manual',
      fuelType: 'Petrol',
      location: 'Nakuru',
      dailyPrice: 2000,
      status: 'AVAILABLE',
      images: {
        create: [{ url: 'https://placehold.co/600x400?text=Note+1', order: 0 }]
      }
    }
  });
  console.log('Created vehicle:', { id: vehicle2.id, title: vehicle2.title });

  // Create a sample booking for admin and vehicle1
  const pickupAt = new Date();
  const returnAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // +1 day
  const booking = await prisma.booking.create({
    data: {
      userId: admin.id,
      vehicleId: vehicle1.id,
      pickupLocation: 'Nairobi CBD',
      returnLocation: 'Nairobi CBD',
      pickupAt,
      returnAt,
      totalPrice: 3000,
      status: 'PENDING',
      paymentStatus: 'PENDING'
    }
  });
  console.log('Created booking:', { id: booking.id, userId: booking.userId, vehicleId: booking.vehicleId });

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