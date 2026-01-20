# 📧 Email & SMS Notification Setup Guide

## Overview

HuruDrive now supports email and SMS confirmations for bookings and payments. This guide explains how to set up the notification services.

---

## 🚀 Quick Start (Development Mode)

**For development/testing, notifications will work in console mode (no setup required):**
- Emails will be logged to console
- SMS will be logged to console
- No external services needed

---

## 📧 Email Setup

### Option 1: Gmail (Easiest for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "HuruDrive" as name
   - Copy the generated 16-character password

3. **Add to `.env` file:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_APP_PASSWORD=your-16-char-app-password
   EMAIL_FROM=noreply@hurudrive.com
   ```

### Option 2: Custom SMTP (Production)

Add to `.env`:
```env
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
EMAIL_FROM=noreply@hurudrive.com
```

### Option 3: Email Services (Recommended for Production)

**SendGrid:**
- Sign up: https://sendgrid.com
- Free tier: 100 emails/day
- Add to `.env`:
  ```env
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_USER=apikey
  SMTP_PASSWORD=your-sendgrid-api-key
  EMAIL_FROM=noreply@yourdomain.com
  ```

**Mailgun:**
- Sign up: https://www.mailgun.com
- Free tier: 5,000 emails/month
- Similar SMTP setup

---

## 📱 SMS Setup

### Option 1: Africa's Talking (Best for Kenya)

1. **Sign up:** https://africastalking.com
2. **Get API credentials:**
   - Username
   - API Key

3. **Install package:**
   ```bash
   npm install africastalking
   ```

4. **Add to `.env`:**
   ```env
   SMS_PROVIDER=africas_talking
   AFRICAS_TALKING_USERNAME=your-username
   AFRICAS_TALKING_API_KEY=your-api-key
   ```

### Option 2: Twilio (International)

1. **Sign up:** https://www.twilio.com
2. **Get credentials:**
   - Account SID
   - Auth Token
   - Phone Number

3. **Install package:**
   ```bash
   npm install twilio
   ```

4. **Add to `.env`:**
   ```env
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### Option 3: Console Mode (Development)

**No setup needed!** SMS will be logged to console.

---

## 📋 Complete .env Example

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hurudrive_dev"
PORT=3000
JWT_SECRET="your-secret-key"

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Choose one)
# Option 1: Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
EMAIL_FROM=noreply@hurudrive.com

# Option 2: Custom SMTP
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@example.com
# SMTP_PASSWORD=your-password
# EMAIL_FROM=noreply@hurudrive.com

# SMS Configuration (Choose one)
# Option 1: Africa's Talking
# SMS_PROVIDER=africas_talking
# AFRICAS_TALKING_USERNAME=your-username
# AFRICAS_TALKING_API_KEY=your-api-key

# Option 2: Twilio
# SMS_PROVIDER=twilio
# TWILIO_ACCOUNT_SID=your-account-sid
# TWILIO_AUTH_TOKEN=your-auth-token
# TWILIO_PHONE_NUMBER=+1234567890

# Option 3: Console (default - no setup needed)
# Leave SMS_PROVIDER unset for console mode
```

---

## 🧪 Testing Notifications

### Test Email (Console Mode)

1. **Make a booking** through the payment modal
2. **Check console** for email output:
   ```
   📧 EMAIL (Simulated):
   To: user@example.com
   Subject: Booking Confirmed - Toyota Land Cruiser Prado | HuruDrive
   ...
   ```

### Test SMS (Console Mode)

1. **Complete a payment**
2. **Check console** for SMS output:
   ```
   📱 SMS (Simulated):
   To: +254712345678
   Message: HuruDrive: Payment confirmed! KSh 45,000 paid...
   ```

### Test with Real Services

1. **Set up email/SMS** as described above
2. **Make a booking**
3. **Check your email** and **phone** for confirmations

---

## 📧 Email Templates

The system includes two email templates:

1. **Booking Confirmation:**
   - Sent when booking is created
   - Includes booking details, vehicle info, dates
   - HTML and plain text versions

2. **Payment Confirmation:**
   - Sent when payment is processed
   - Includes payment details, amount, method
   - HTML and plain text versions

**Customize templates in:** `services/notificationService.js`

---

## 📱 SMS Templates

The system includes two SMS templates:

1. **Booking Confirmation SMS:**
   - Short, concise booking details
   - Booking ID, vehicle, dates, amount

2. **Payment Confirmation SMS:**
   - Payment confirmation with amount
   - Vehicle name

**Customize templates in:** `services/notificationService.js`

---

## 🔧 How It Works

### Booking Flow:

1. User creates booking → `POST /api/bookings`
2. Booking saved to database
3. **Email sent** to user's email
4. **SMS sent** to user's phone
5. Response returned to frontend

### Payment Flow:

1. User completes payment → `POST /api/payments`
2. Payment saved to database
3. Booking status updated to "CONFIRMED"
4. **Email sent** with payment confirmation
5. **SMS sent** with payment confirmation
6. Response returned to frontend

---

## 🛠️ Troubleshooting

### Email Not Sending

1. **Check .env configuration**
2. **Verify SMTP credentials**
3. **Check console for errors**
4. **Test SMTP connection:**
   ```bash
   node -e "const nodemailer = require('nodemailer'); const transporter = nodemailer.createTransport({...}); transporter.verify().then(console.log).catch(console.error);"
   ```

### SMS Not Sending

1. **Check .env configuration**
2. **Verify API credentials**
3. **Check phone number format** (should include country code)
4. **Check console for errors**
5. **Verify account balance** (for paid services)

### Notifications Not Triggering

1. **Check user has email/phone** in database
2. **Verify booking/payment endpoints** are being called
3. **Check server console** for notification logs
4. **Verify authentication token** is valid

---

## 💡 Best Practices

1. **Development:** Use console mode (no setup needed)
2. **Testing:** Use Gmail with App Password
3. **Production:** Use professional services (SendGrid, Mailgun, Africa's Talking)
4. **Error Handling:** Notifications don't fail bookings/payments if they fail
5. **Logging:** All notifications are logged for debugging

---

## 📦 Required Packages

Already installed:
- `nodemailer` - Email sending

Optional (install if using):
```bash
# For Africa's Talking SMS
npm install africastalking

# For Twilio SMS
npm install twilio
```

---

## ✅ Features

- ✅ Email confirmations for bookings
- ✅ Email confirmations for payments
- ✅ SMS confirmations for bookings
- ✅ SMS confirmations for payments
- ✅ HTML email templates
- ✅ Plain text email fallback
- ✅ Console mode for development
- ✅ Error handling (non-critical)
- ✅ Phone number formatting
- ✅ Professional email design

---

## 🎯 Next Steps

1. **For Development:** No setup needed - works in console mode
2. **For Testing:** Set up Gmail (see Option 1 above)
3. **For Production:** Set up SendGrid + Africa's Talking

**Your notifications are ready to use!** 🎉
