require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (images)
const publicPath = path.join(__dirname, 'public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}
app.use('/images', express.static(publicPath));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(publicPath, 'images', 'vehicles');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: vehicleId-timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
    }
  }
});

// Simple health-check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'error' });
  }
});

/**
 * Build a Prisma "where" filter from query-string params.
 * Everything is optional so you can call /api/vehicles with no filters.
 */
function buildVehicleFilters(query) {
  const where = {};

  // By default only show AVAILABLE cars unless explicitly overridden
  if (!query.includeUnavailable) {
    where.status = 'AVAILABLE';
  }

  if (query.location) {
    where.location = query.location;
  }

  if (query.make) {
    where.make = query.make;
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.minSeats) {
    const seats = Number(query.minSeats);
    if (!Number.isNaN(seats)) {
      where.seats = { gte: seats };
    }
  }

  if (query.minPrice || query.maxPrice) {
    where.dailyPrice = {};
    if (query.minPrice) {
      const min = Number(query.minPrice);
      if (!Number.isNaN(min)) where.dailyPrice.gte = min;
    }
    if (query.maxPrice) {
      const max = Number(query.maxPrice);
      if (!Number.isNaN(max)) where.dailyPrice.lte = max;
    }
    // If both parses failed, clean it up
    if (Object.keys(where.dailyPrice).length === 0) {
      delete where.dailyPrice;
    }
  }

  return where;
}

// Clean, reliable vehicle list endpoint
app.get('/api/vehicles', async (req, res) => {
  try {
    const where = buildVehicleFilters(req.query);

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json(vehicles);
  } catch (err) {
    console.error('Error in GET /api/vehicles:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Single vehicle by id (Prisma id is a string UUID)
app.get('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing vehicle id' });
  }

  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        bookings: true
      }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    return res.json(vehicle);
  } catch (err) {
    console.error('Error in GET /api/vehicles/:id', err);
    return res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Optional utility: list all images (useful for debugging)
app.get('/api/vehicle-images', async (req, res) => {
  try {
    const images = await prisma.vehicleImage.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(images);
  } catch (err) {
    console.error('Error in GET /api/vehicle-images:', err);
    res.status(500).json({ error: 'Failed to fetch vehicle images' });
  }
});

// Upload vehicle image endpoint
app.post('/api/vehicles/:id/images', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      // Delete uploaded file if vehicle doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Create image URL (relative to /images)
    const imageUrl = `/images/images/vehicles/${req.file.filename}`;

    // Get current max order for this vehicle
    const maxOrder = await prisma.vehicleImage.findFirst({
      where: { vehicleId: id },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    const newOrder = maxOrder ? maxOrder.order + 1 : 0;

    // Save image record to database
    const vehicleImage = await prisma.vehicleImage.create({
      data: {
        vehicleId: id,
        url: imageUrl,
        order: newOrder
      }
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: vehicleImage
    });
  } catch (err) {
    console.error('Error uploading image:', err);
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete vehicle image endpoint
app.delete('/api/vehicle-images/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    // Get image record
    const image = await prisma.vehicleImage.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(publicPath, image.url.replace('/images', ''));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete image record from database
    await prisma.vehicleImage.delete({
      where: { id: imageId }
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Authentication endpoints
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        phone: phone || null,
        passwordHash,
        role: 'USER'
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user (protected route)
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Import notification service
const { sendBookingConfirmation, sendPaymentConfirmation } = require('./services/notificationService');

// Create booking endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const { vehicleId, pickupLocation, returnLocation, pickupAt, returnAt } = req.body;

    // Validate required fields
    if (!vehicleId || !pickupLocation || !returnLocation || !pickupAt || !returnAt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get vehicle to calculate price
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (vehicle.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Vehicle is not available' });
    }

    // Calculate total price
    const pickupDate = new Date(pickupAt);
    const returnDate = new Date(returnAt);
    const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)) || 1;
    const subtotal = vehicle.dailyPrice * days;
    const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
    const totalPrice = subtotal + serviceFee;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: decoded.userId,
        vehicleId,
        pickupLocation,
        returnLocation,
        pickupAt: new Date(pickupAt),
        returnAt: new Date(returnAt),
        totalPrice,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        user: true,
        vehicle: true
      }
    });

    // Send booking confirmation (email and SMS)
    try {
      await sendBookingConfirmation(booking, booking.user, booking.vehicle);
    } catch (notifError) {
      console.error('Notification error (non-critical):', notifError);
      // Don't fail the booking if notification fails
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        vehicle: booking.vehicle,
        pickupLocation: booking.pickupLocation,
        returnLocation: booking.returnLocation,
        pickupAt: booking.pickupAt,
        returnAt: booking.returnAt,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentStatus: booking.paymentStatus
      }
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Create payment endpoint
app.post('/api/payments', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const { bookingId, provider, amount } = req.body;

    if (!bookingId || !provider || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        vehicle: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== decoded.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId: decoded.userId,
        provider,
        amount,
        currency: 'KES',
        status: 'PAID' // In production, verify payment first
      }
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    });

    // Send payment confirmation (email and SMS)
    try {
      await sendPaymentConfirmation(payment, booking, booking.user, booking.vehicle);
    } catch (notifError) {
      console.error('Notification error (non-critical):', notifError);
      // Don't fail the payment if notification fails
    }

    res.status(201).json({
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        amount: payment.amount,
        provider: payment.provider,
        status: payment.status
      },
      booking: {
        id: booking.id,
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    });
  } catch (err) {
    console.error('Error processing payment:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));