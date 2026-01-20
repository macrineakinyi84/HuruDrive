/**
 * Test script for Email and SMS Notifications
 * Run this to test the notification service
 */

require('dotenv').config();
const { sendBookingConfirmation, sendPaymentConfirmation } = require('./services/notificationService');

// Sample test data
const testUser = {
  id: 'test-user-id',
  name: 'John Doe',
  email: 'test@example.com',
  phone: '+254712345678'
};

const testVehicle = {
  id: 'test-vehicle-id',
  title: 'Toyota Land Cruiser Prado',
  make: 'Toyota',
  model: 'Land Cruiser Prado',
  year: 2020,
  category: 'SUV',
  dailyPrice: 15000
};

const testBooking = {
  id: 'test-booking-' + Date.now(),
  pickupLocation: 'Nairobi CBD',
  returnLocation: 'Nairobi CBD',
  pickupAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  returnAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 3 days later
  totalPrice: 47250, // 3 days * 15000 + 5% service fee
  status: 'CONFIRMED',
  paymentStatus: 'PAID'
};

const testPayment = {
  id: 'test-payment-' + Date.now(),
  provider: 'M-Pesa',
  amount: 47250,
  status: 'PAID',
  currency: 'KES'
};

async function testNotifications() {
  console.log('🧪 Testing Email & SMS Notifications...\n');
  console.log('=' .repeat(50));
  
  // Test 1: Booking Confirmation
  console.log('\n📋 Test 1: Booking Confirmation\n');
  try {
    const bookingResult = await sendBookingConfirmation(testBooking, testUser, testVehicle);
    console.log('✅ Booking confirmation test completed');
    console.log('   Email sent:', bookingResult.emailSent);
    console.log('   SMS sent:', bookingResult.smsSent);
    if (bookingResult.error) {
      console.log('   Error:', bookingResult.error);
    }
  } catch (error) {
    console.error('❌ Booking confirmation test failed:', error.message);
  }
  
  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Payment Confirmation
  console.log('\n💰 Test 2: Payment Confirmation\n');
  try {
    const paymentResult = await sendPaymentConfirmation(testPayment, testBooking, testUser, testVehicle);
    console.log('✅ Payment confirmation test completed');
    console.log('   Email sent:', paymentResult.emailSent);
    console.log('   SMS sent:', paymentResult.smsSent);
    if (paymentResult.error) {
      console.log('   Error:', paymentResult.error);
    }
  } catch (error) {
    console.error('❌ Payment confirmation test failed:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n✨ Testing complete!');
  console.log('\n💡 Check the output above for email and SMS logs.');
  console.log('   In console mode, notifications are logged to console.');
  console.log('   For real emails/SMS, configure .env file (see NOTIFICATION_SETUP.md)');
}

// Run tests
testNotifications()
  .then(() => {
    console.log('\n✅ All tests finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  });
