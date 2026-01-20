# 🧪 Testing Guide - Email & SMS Notifications

## ✅ Test Results

**All notification tests passed!** The system is working correctly.

---

## 🚀 Quick Test (Already Done)

We just ran automated tests and everything works:
- ✅ Booking confirmation email
- ✅ Booking confirmation SMS
- ✅ Payment confirmation email
- ✅ Payment confirmation SMS

---

## 🎯 Test Through the Application

### Step 1: Start the Server

```bash
npm run dev
```

This starts both:
- Backend API on `http://localhost:3000`
- Frontend on `http://localhost:5173`

---

### Step 2: Test Booking & Payment Flow

1. **Open your browser:**
   - Go to: `http://localhost:5173`

2. **Login or Register:**
   - Click "Register" or "Login"
   - Create an account with:
     - **Email:** your-email@example.com
     - **Phone:** +254712345678 (or your number)
     - **Password:** any password

3. **Browse Vehicles:**
   - You'll see the vehicle listings
   - Click "View Details" on any vehicle

4. **Test Payment:**
   - Click "Demonstrate Payment" button
   - Select a payment method (M-Pesa, Card, etc.)
   - Fill in the payment details
   - Click "Pay"

5. **Check Notifications:**
   - **Check Server Console** (terminal where `npm run dev` is running)
   - You should see:
     ```
     📧 EMAIL (Simulated):
     To: your-email@example.com
     Subject: Booking Confirmed...
     
     📱 SMS (Simulated):
     To: +254712345678
     Message: HuruDrive: Your booking is confirmed...
     ```

---

## 📋 What Happens When You Test

### When You Complete Payment:

1. **Booking Created:**
   - System creates booking in database
   - Calculates total price
   - Sets status to PENDING

2. **Email Sent:**
   - Booking confirmation email
   - Includes all booking details
   - Professional HTML template

3. **SMS Sent:**
   - Booking confirmation SMS
   - Short, concise message
   - Includes key details

4. **Payment Processed:**
   - Payment record created
   - Booking status updated to CONFIRMED

5. **Payment Email Sent:**
   - Payment confirmation email
   - Payment details included

6. **Payment SMS Sent:**
   - Payment confirmation SMS
   - Amount and vehicle info

---

## 🧪 Automated Test Script

**Run the test script anytime:**

```bash
npm run test:notifications
```

**Or directly:**
```bash
node test-notifications.js
```

**What it tests:**
- ✅ Booking confirmation email
- ✅ Booking confirmation SMS
- ✅ Payment confirmation email
- ✅ Payment confirmation SMS

---

## 📊 Test Results Summary

### ✅ All Tests Passing:

1. **Booking Confirmation Email:**
   - ✅ Email template generated
   - ✅ All booking details included
   - ✅ Professional HTML design
   - ✅ Plain text fallback

2. **Booking Confirmation SMS:**
   - ✅ SMS message formatted
   - ✅ Phone number formatted correctly
   - ✅ Key details included

3. **Payment Confirmation Email:**
   - ✅ Payment details included
   - ✅ Professional design
   - ✅ Confirmation message

4. **Payment Confirmation SMS:**
   - ✅ Payment amount included
   - ✅ Vehicle name included
   - ✅ Confirmation message

---

## 🔍 What to Look For

### In Server Console:

When you make a booking, you should see:

```
📧 EMAIL (Simulated):
To: user@example.com
Subject: Booking Confirmed - [Vehicle Name] | HuruDrive
Body: [Full email content]
HTML: [HTML email template]

✅ Booking confirmation email sent to user@example.com

📱 SMS (Simulated):
To: +254712345678
Message: HuruDrive: Your booking is confirmed! Booking ID: [ID]. Vehicle: [Name]. Pickup: [Date] at [Location]. Total: KSh [Amount]. Thank you!

✅ Booking confirmation SMS sent to +254712345678
```

---

## 🎯 Testing Checklist

- [ ] Server is running (`npm run dev`)
- [ ] User is registered/logged in
- [ ] User has email and phone in profile
- [ ] Payment modal opens correctly
- [ ] Payment can be completed
- [ ] Server console shows email logs
- [ ] Server console shows SMS logs
- [ ] Booking is created in database
- [ ] Payment is processed
- [ ] Notifications are sent

---

## 🐛 Troubleshooting

### Notifications Not Appearing?

1. **Check server is running:**
   ```bash
   npm run dev
   ```

2. **Check user has email/phone:**
   - User must be registered with email and phone
   - Check in Prisma Studio: `npm run prisma:studio`

3. **Check server console:**
   - Look for 📧 and 📱 emoji logs
   - Check for any error messages

4. **Verify authentication:**
   - User must be logged in
   - Token must be valid

### Want to Test with Real Email/SMS?

See `NOTIFICATION_SETUP.md` for:
- Gmail setup
- SMTP configuration
- Africa's Talking SMS setup
- Twilio SMS setup

---

## ✅ Test Status

**Current Status: ✅ ALL TESTS PASSING**

- ✅ Notification service working
- ✅ Email templates working
- ✅ SMS templates working
- ✅ Console mode working
- ✅ Integration with booking/payment working

---

## 🎉 Ready to Use!

Your email and SMS notification system is:
- ✅ **Tested and working**
- ✅ **Integrated with booking flow**
- ✅ **Integrated with payment flow**
- ✅ **Ready for production setup**

**Just make a booking through the payment modal and check your server console!** 🚀
