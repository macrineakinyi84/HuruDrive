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

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

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

// ==================== ADMIN ENDPOINTS ====================

// Get all bookings (Admin only)
app.get('/api/admin/bookings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true }
          },
          vehicle: {
            select: { id: true, title: true, make: true, model: true }
          },
          payment: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Update booking status (Admin only)
app.patch('/api/admin/bookings/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        vehicle: true
      }
    });

    res.json({ message: 'Booking updated successfully', booking });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Get dashboard statistics (Admin only)
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.lte = new Date(endDate);
    }

    const [
      totalBookings,
      confirmedBookings,
      totalRevenue,
      totalUsers,
      totalVehicles,
      bookingsByStatus,
      revenueByMonth,
      topVehicles
    ] = await Promise.all([
      prisma.booking.count({ where: dateFilter }),
      prisma.booking.count({ where: { ...dateFilter, status: 'CONFIRMED' } }),
      prisma.payment.aggregate({
        where: { ...dateFilter, status: 'PAID' },
        _sum: { amount: true }
      }),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.vehicle.count(),
      prisma.booking.groupBy({
        by: ['status'],
        where: dateFilter,
        _count: { status: true }
      }),
      // Revenue by month (last 6 months)
      prisma.payment.findMany({
        where: {
          ...dateFilter,
          status: 'PAID',
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        },
        select: {
          amount: true,
          createdAt: true
        }
      }),
      // Top 5 most booked vehicles
      prisma.booking.groupBy({
        by: ['vehicleId'],
        where: dateFilter,
        _count: { vehicleId: true },
        orderBy: { _count: { vehicleId: 'desc' } },
        take: 5
      })
    ]);

    // Process revenue by month
    const monthlyRevenue = {};
    revenueByMonth.forEach(payment => {
      const month = new Date(payment.createdAt).toISOString().slice(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + payment.amount;
    });

    // Get vehicle details for top vehicles
    const topVehicleIds = topVehicles.map(v => v.vehicleId);
    const topVehicleDetails = await prisma.vehicle.findMany({
      where: { id: { in: topVehicleIds } },
      select: { id: true, title: true, make: true, model: true }
    });

    const topVehiclesWithDetails = topVehicles.map(tv => ({
      ...tv,
      vehicle: topVehicleDetails.find(v => v.id === tv.vehicleId)
    }));

    res.json({
      overview: {
        totalBookings,
        confirmedBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalUsers,
        totalVehicles,
        pendingBookings: bookingsByStatus.find(b => b.status === 'PENDING')?._count.status || 0,
        cancelledBookings: bookingsByStatus.find(b => b.status === 'CANCELLED')?._count.status || 0
      },
      bookingsByStatus: bookingsByStatus.map(b => ({
        status: b.status,
        count: b._count.status
      })),
      monthlyRevenue,
      topVehicles: topVehiclesWithDetails
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all feedback (Admin only)
app.get('/api/admin/feedback', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          booking: {
            include: {
              vehicle: {
                select: { id: true, title: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.feedback.count({ where })
    ]);

    res.json({
      feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

// Update feedback status (Admin only)
app.patch('/api/admin/feedback/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const feedback = await prisma.feedback.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        booking: true
      }
    });

    res.json({ message: 'Feedback updated successfully', feedback });
  } catch (err) {
    console.error('Error updating feedback:', err);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// ==================== FEEDBACK ENDPOINTS ====================

// Submit feedback (Authenticated users)
app.post('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify booking belongs to user
    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user.userId,
        bookingId: bookingId || null,
        rating,
        comment: comment || null,
        status: 'PENDING'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        booking: {
          include: {
            vehicle: {
              select: { id: true, title: true }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// ==================== USER DASHBOARD ENDPOINTS ====================

// Get user's bookings
app.get('/api/user/bookings', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.userId };
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        vehicle: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        },
        payment: true,
        feedbacks: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ bookings });
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get single booking
app.get('/api/user/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId: req.user.userId
      },
      include: {
        vehicle: {
          include: {
            images: {
              orderBy: { order: 'asc' }
            }
          }
        },
        payment: true,
        feedbacks: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Cancel booking
app.patch('/api/user/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    if (booking.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        vehicle: true
      }
    });

    res.json({ message: 'Booking cancelled successfully', booking: updated });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Get user's payments
app.get('/api/user/payments', authenticateToken, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.userId },
      include: {
        booking: {
          include: {
            vehicle: {
              select: { id: true, title: true, make: true, model: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ payments });
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get user dashboard statistics
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      totalBookings,
      upcomingBookings,
      completedBookings,
      totalSpent,
      recentBookings
    ] = await Promise.all([
      prisma.booking.count({ where: { userId } }),
      prisma.booking.count({
        where: {
          userId,
          pickupAt: { gte: new Date() },
          status: { in: ['PENDING', 'CONFIRMED'] }
        }
      }),
      prisma.booking.count({
        where: {
          userId,
          status: 'COMPLETED'
        }
      }),
      prisma.payment.aggregate({
        where: {
          userId,
          status: 'PAID'
        },
        _sum: { amount: true }
      }),
      prisma.booking.findMany({
        where: { userId },
        include: {
          vehicle: {
            select: { id: true, title: true, images: { take: 1 } }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    res.json({
      stats: {
        totalBookings,
        upcomingBookings,
        completedBookings,
        totalSpent: totalSpent._sum.amount || 0
      },
      recentBookings
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Update user profile
app.patch('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      }
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
app.patch('/api/user/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { passwordHash: newPasswordHash }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get user's feedback
app.get('/api/user/feedback', authenticateToken, async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { userId: req.user.userId },
      include: {
        booking: {
          include: {
            vehicle: {
              select: { id: true, title: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ feedbacks });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));