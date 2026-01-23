const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🌱 Seeding dashboard data...\n');

  // Get or create test users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hurudrive.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@hurudrive.com',
      phone: '+254 712 345678',
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    }
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'user@hurudrive.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@hurudrive.com',
      phone: '+254 723 456789',
      passwordHash: userPasswordHash,
      role: 'USER'
    }
  });

  console.log('✅ Users created/verified');
  console.log(`   Admin: ${admin.email} (password: admin123)`);
  console.log(`   User: ${testUser.email} (password: user123)\n`);

  // Get vehicles
  const vehicles = await prisma.vehicle.findMany();
  if (vehicles.length === 0) {
    console.log('⚠️  No vehicles found. Please run: npm run prisma:seed\n');
    return;
  }

  console.log(`📦 Found ${vehicles.length} vehicles\n`);

  // Create bookings for test user
  const now = new Date();
  const bookings = [];

  // Upcoming booking (confirmed, paid)
  const upcomingDate = new Date(now);
  upcomingDate.setDate(upcomingDate.getDate() + 7);
  const returnDate1 = new Date(upcomingDate);
  returnDate1.setDate(returnDate1.getDate() + 3);

  const booking1 = await prisma.booking.create({
    data: {
      userId: testUser.id,
      vehicleId: vehicles[0].id,
      pickupLocation: 'Nairobi Airport',
      returnLocation: 'Nairobi Airport',
      pickupAt: upcomingDate,
      returnAt: returnDate1,
      totalPrice: vehicles[0].dailyPrice * 3 + Math.round(vehicles[0].dailyPrice * 3 * 0.05),
      status: 'CONFIRMED',
      paymentStatus: 'PAID'
    }
  });
  bookings.push(booking1);

  // Create payment for booking1
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      userId: testUser.id,
      provider: 'M-Pesa',
      amount: booking1.totalPrice,
      currency: 'KES',
      status: 'PAID',
      providerPaymentId: 'MPESA-' + Date.now()
    }
  });

  // Completed booking (with feedback)
  const pastDate1 = new Date(now);
  pastDate1.setDate(pastDate1.getDate() - 15);
  const returnDate2 = new Date(pastDate1);
  returnDate2.setDate(returnDate2.getDate() + 5);

  const booking2 = await prisma.booking.create({
    data: {
      userId: testUser.id,
      vehicleId: vehicles[1].id,
      pickupLocation: 'Mombasa',
      returnLocation: 'Mombasa',
      pickupAt: pastDate1,
      returnAt: returnDate2,
      totalPrice: vehicles[1].dailyPrice * 5 + Math.round(vehicles[1].dailyPrice * 5 * 0.05),
      status: 'COMPLETED',
      paymentStatus: 'PAID'
    }
  });
  bookings.push(booking2);

  // Payment for booking2
  const payment2 = await prisma.payment.create({
    data: {
      bookingId: booking2.id,
      userId: testUser.id,
      provider: 'Credit Card',
      amount: booking2.totalPrice,
      currency: 'KES',
      status: 'PAID',
      providerPaymentId: 'CARD-' + Date.now()
    }
  });

  // Feedback for completed booking
  await prisma.feedback.create({
    data: {
      userId: testUser.id,
      bookingId: booking2.id,
      rating: 5,
      comment: 'Excellent service! The car was in perfect condition and the staff was very helpful. Highly recommend!',
      status: 'APPROVED'
    }
  });

  // Another completed booking
  const pastDate2 = new Date(now);
  pastDate2.setDate(pastDate2.getDate() - 30);
  const returnDate3 = new Date(pastDate2);
  returnDate3.setDate(returnDate3.getDate() + 2);

  const booking3 = await prisma.booking.create({
    data: {
      userId: testUser.id,
      vehicleId: vehicles[2].id,
      pickupLocation: 'Nakuru',
      returnLocation: 'Nakuru',
      pickupAt: pastDate2,
      returnAt: returnDate3,
      totalPrice: vehicles[2].dailyPrice * 2 + Math.round(vehicles[2].dailyPrice * 2 * 0.05),
      status: 'COMPLETED',
      paymentStatus: 'PAID'
    }
  });
  bookings.push(booking3);

  await prisma.payment.create({
    data: {
      bookingId: booking3.id,
      userId: testUser.id,
      provider: 'Airtel Money',
      amount: booking3.totalPrice,
      currency: 'KES',
      status: 'PAID',
      providerPaymentId: 'AIRTEL-' + Date.now()
    }
  });

  await prisma.feedback.create({
    data: {
      userId: testUser.id,
      bookingId: booking3.id,
      rating: 4,
      comment: 'Good experience overall. The vehicle was clean and well-maintained.',
      status: 'APPROVED'
    }
  });

  // Pending booking
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + 14);
  const returnDate4 = new Date(futureDate);
  returnDate4.setDate(returnDate4.getDate() + 4);

  const booking4 = await prisma.booking.create({
    data: {
      userId: testUser.id,
      vehicleId: vehicles[3].id,
      pickupLocation: 'Kisumu',
      returnLocation: 'Kisumu',
      pickupAt: futureDate,
      returnAt: returnDate4,
      totalPrice: vehicles[3].dailyPrice * 4 + Math.round(vehicles[3].dailyPrice * 4 * 0.05),
      status: 'PENDING',
      paymentStatus: 'PENDING'
    }
  });
  bookings.push(booking4);

  // Create bookings from other users (for admin to see)
  const otherUsers = [];
  for (let i = 1; i <= 3; i++) {
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { email: `customer${i}@hurudrive.com` },
      update: {},
      create: {
        name: `Customer ${i}`,
        email: `customer${i}@hurudrive.com`,
        phone: `+254 7${i}${i}${i} ${i}${i}${i}${i}${i}${i}`,
        passwordHash: passwordHash,
        role: 'USER'
      }
    });
    otherUsers.push(user);

    // Create a booking for each user
    const bookingDate = new Date(now);
    bookingDate.setDate(bookingDate.getDate() + (i * 5));
    const returnDate = new Date(bookingDate);
    returnDate.setDate(returnDate.getDate() + (i + 1));

    const vehicle = vehicles[i % vehicles.length];
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        vehicleId: vehicle.id,
        pickupLocation: ['Nairobi', 'Mombasa', 'Nakuru'][i % 3],
        returnLocation: ['Nairobi', 'Mombasa', 'Nakuru'][i % 3],
        pickupAt: bookingDate,
        returnAt: returnDate,
        totalPrice: vehicle.dailyPrice * (i + 1) + Math.round(vehicle.dailyPrice * (i + 1) * 0.05),
        status: i === 1 ? 'CONFIRMED' : i === 2 ? 'PENDING' : 'COMPLETED',
        paymentStatus: i === 1 ? 'PAID' : i === 2 ? 'PENDING' : 'PAID'
      }
    });

    if (booking.paymentStatus === 'PAID') {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          userId: user.id,
          provider: ['M-Pesa', 'Credit Card', 'Bank Transfer'][i % 3],
          amount: booking.totalPrice,
          currency: 'KES',
          status: 'PAID',
          providerPaymentId: `PAY-${i}-${Date.now()}`
        }
      });
    }

    // Add feedback for completed booking
    if (booking.status === 'COMPLETED') {
      await prisma.feedback.create({
        data: {
          userId: user.id,
          bookingId: booking.id,
          rating: [5, 4, 3][i % 3],
          comment: `Great service! Vehicle was ${['excellent', 'good', 'satisfactory'][i % 3]}.`,
          status: 'APPROVED'
        }
      });
    }
  }

  console.log('✅ Created bookings:');
  console.log(`   - ${bookings.length} bookings for test user`);
  console.log(`   - ${otherUsers.length} additional users with bookings`);
  console.log(`   - Payments created for paid bookings`);
  console.log(`   - Feedback added for completed bookings\n`);

  console.log('📊 Summary:');
  const totalBookings = await prisma.booking.count();
  const totalPayments = await prisma.payment.count();
  const totalFeedback = await prisma.feedback.count();
  console.log(`   Total bookings: ${totalBookings}`);
  console.log(`   Total payments: ${totalPayments}`);
  console.log(`   Total feedback: ${totalFeedback}\n`);

  console.log('🎯 Login Credentials:');
  console.log(`   Admin: admin@hurudrive.com / admin123`);
  console.log(`   User: user@hurudrive.com / user123\n`);
  console.log('✅ Dashboard data seeded successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
