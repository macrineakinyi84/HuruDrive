/**
 * Notification Service for HuruDrive
 * Handles email and SMS notifications for bookings
 */

// Email service using nodemailer
const nodemailer = require('nodemailer');

// Create email transporter
const createEmailTransporter = () => {
  // For development: Use Gmail or any SMTP service
  // For production: Use a service like SendGrid, Mailgun, or AWS SES
  
  // Option 1: Gmail (for development/testing)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use App Password, not regular password
      }
    });
  }
  
  // Option 2: Custom SMTP (for production)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  
  // Option 3: Console log (for development without email setup)
  return {
    sendMail: async (options) => {
      console.log('📧 EMAIL (Simulated):');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Body:', options.text);
      console.log('HTML:', options.html);
      return { messageId: 'simulated-' + Date.now() };
    }
  };
};

// SMS service
const sendSMS = async (phoneNumber, message) => {
  // Remove any non-digit characters except +
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  
  // Ensure phone number starts with country code
  let formattedPhone = cleanPhone;
  if (!formattedPhone.startsWith('+')) {
    // Assume Kenyan number if no country code
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('254')) {
      formattedPhone = '+' + formattedPhone;
    } else {
      formattedPhone = '+254' + formattedPhone;
    }
  }
  
  // Option 1: Africa's Talking (Good for Kenya)
  if (process.env.SMS_PROVIDER === 'africas_talking') {
    try {
      const AfricasTalking = require('africastalking');
      const africastalking = AfricasTalking({
        apiKey: process.env.AFRICAS_TALKING_API_KEY,
        username: process.env.AFRICAS_TALKING_USERNAME
      });
      
      const sms = africastalking.SMS;
      const result = await sms.send({
        to: formattedPhone,
        message: message
      });
      
      console.log('📱 SMS sent via Africa\'s Talking:', result);
      return { success: true, provider: 'africas_talking', result };
    } catch (error) {
      console.error('SMS sending failed:', error);
      // Fall back to console log
      return sendSMSConsole(formattedPhone, message);
    }
  }
  
  // Option 2: Twilio (International)
  if (process.env.SMS_PROVIDER === 'twilio') {
    try {
      const twilio = require('twilio');
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });
      
      console.log('📱 SMS sent via Twilio:', result.sid);
      return { success: true, provider: 'twilio', sid: result.sid };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return sendSMSConsole(formattedPhone, message);
    }
  }
  
  // Option 3: Console log (for development)
  return sendSMSConsole(formattedPhone, message);
};

// Console log SMS (for development)
const sendSMSConsole = (phoneNumber, message) => {
  console.log('📱 SMS (Simulated):');
  console.log('To:', phoneNumber);
  console.log('Message:', message);
  return { success: true, provider: 'console', phoneNumber, message };
};

// Email templates
const emailTemplates = {
  bookingConfirmation: (booking, user, vehicle) => {
    const pickupDate = new Date(booking.pickupAt).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const returnDate = new Date(booking.returnAt).toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      subject: `Booking Confirmed - ${vehicle.title} | HuruDrive`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #14b8a6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #14b8a6; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #14b8a6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 HuruDrive</h1>
              <h2>Booking Confirmed!</h2>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'Valued Customer'},</p>
              
              <p>Your booking has been confirmed. We're excited to serve you!</p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span class="label">Booking ID:</span>
                  <span class="value">${booking.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Vehicle:</span>
                  <span class="value">${vehicle.title}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Pickup Date:</span>
                  <span class="value">${pickupDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Return Date:</span>
                  <span class="value">${returnDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Pickup Location:</span>
                  <span class="value">${booking.pickupLocation}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Return Location:</span>
                  <span class="value">${booking.returnLocation}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Amount:</span>
                  <span class="value">KSh ${booking.totalPrice.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span class="value">${booking.status}</span>
                </div>
              </div>
              
              <p>Please arrive on time for pickup. If you have any questions, feel free to contact us.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">View Booking</a>
              </div>
              
              <div class="footer">
                <p>Thank you for choosing HuruDrive!</p>
                <p>Email: info@hurudrive.com | Phone: +254 712 345678</p>
                <p>© ${new Date().getFullYear()} HuruDrive. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Booking Confirmed - HuruDrive

Dear ${user.name || 'Valued Customer'},

Your booking has been confirmed!

Booking Details:
- Booking ID: ${booking.id.substring(0, 8).toUpperCase()}
- Vehicle: ${vehicle.title}
- Pickup Date: ${pickupDate}
- Return Date: ${returnDate}
- Pickup Location: ${booking.pickupLocation}
- Return Location: ${booking.returnLocation}
- Total Amount: KSh ${booking.totalPrice.toLocaleString()}
- Status: ${booking.status}

Please arrive on time for pickup.

Thank you for choosing HuruDrive!
Email: info@hurudrive.com | Phone: +254 712 345678
      `
    };
  },
  
  paymentConfirmation: (payment, booking, user, vehicle) => {
    return {
      subject: `Payment Confirmed - Booking ${booking.id.substring(0, 8).toUpperCase()} | HuruDrive`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .payment-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Payment Confirmed</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'Valued Customer'},</p>
              
              <p>Your payment has been successfully processed!</p>
              
              <div class="payment-details">
                <h3>Payment Details</h3>
                <div class="detail-row">
                  <span class="label">Payment ID:</span>
                  <span class="value">${payment.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Amount:</span>
                  <span class="value">KSh ${payment.amount.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Payment Method:</span>
                  <span class="value">${payment.provider}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Vehicle:</span>
                  <span class="value">${vehicle.title}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span class="value">${payment.status}</span>
                </div>
              </div>
              
              <p>Your booking is now confirmed. We look forward to serving you!</p>
              
              <div class="footer">
                <p>Thank you for choosing HuruDrive!</p>
                <p>Email: info@hurudrive.com | Phone: +254 712 345678</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Payment Confirmed - HuruDrive

Dear ${user.name || 'Valued Customer'},

Your payment has been successfully processed!

Payment Details:
- Payment ID: ${payment.id.substring(0, 8).toUpperCase()}
- Amount: KSh ${payment.amount.toLocaleString()}
- Payment Method: ${payment.provider}
- Vehicle: ${vehicle.title}
- Status: ${payment.status}

Your booking is now confirmed.

Thank you for choosing HuruDrive!
      `
    };
  }
};

// SMS templates
const smsTemplates = {
  bookingConfirmation: (booking, vehicle) => {
    const pickupDate = new Date(booking.pickupAt).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `HuruDrive: Your booking is confirmed! Booking ID: ${booking.id.substring(0, 8).toUpperCase()}. Vehicle: ${vehicle.title}. Pickup: ${pickupDate} at ${booking.pickupLocation}. Total: KSh ${booking.totalPrice.toLocaleString()}. Thank you!`;
  },
  
  paymentConfirmation: (payment, vehicle) => {
    return `HuruDrive: Payment confirmed! KSh ${payment.amount.toLocaleString()} paid for ${vehicle.title}. Booking confirmed. Thank you!`;
  }
};

// Main notification functions
const sendBookingConfirmation = async (booking, user, vehicle) => {
  try {
    // Send email
    if (user.email) {
      const emailTemplate = emailTemplates.bookingConfirmation(booking, user, vehicle);
      const transporter = createEmailTransporter();
      
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@hurudrive.com',
        to: user.email,
        subject: emailTemplate.subject,
        text: emailTemplate.text,
        html: emailTemplate.html
      });
      
      console.log(`✅ Booking confirmation email sent to ${user.email}`);
    }
    
    // Send SMS
    if (user.phone) {
      const smsMessage = smsTemplates.bookingConfirmation(booking, vehicle);
      await sendSMS(user.phone, smsMessage);
      console.log(`✅ Booking confirmation SMS sent to ${user.phone}`);
    }
    
    return { emailSent: !!user.email, smsSent: !!user.phone };
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    // Don't throw - notifications are not critical
    return { emailSent: false, smsSent: false, error: error.message };
  }
};

const sendPaymentConfirmation = async (payment, booking, user, vehicle) => {
  try {
    // Send email
    if (user.email) {
      const emailTemplate = emailTemplates.paymentConfirmation(payment, booking, user, vehicle);
      const transporter = createEmailTransporter();
      
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@hurudrive.com',
        to: user.email,
        subject: emailTemplate.subject,
        text: emailTemplate.text,
        html: emailTemplate.html
      });
      
      console.log(`✅ Payment confirmation email sent to ${user.email}`);
    }
    
    // Send SMS
    if (user.phone) {
      const smsMessage = smsTemplates.paymentConfirmation(payment, vehicle);
      await sendSMS(user.phone, smsMessage);
      console.log(`✅ Payment confirmation SMS sent to ${user.phone}`);
    }
    
    return { emailSent: !!user.email, smsSent: !!user.phone };
  } catch (error) {
    console.error('Error sending payment confirmation:', error);
    return { emailSent: false, smsSent: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendPaymentConfirmation,
  sendSMS
};
