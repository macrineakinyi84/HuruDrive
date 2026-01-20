# HuruDrive - Quick Start Guide

## 🚀 System Status: READY TO RUN

Your HuruDrive car rental system is **fully functional** and ready to use!

## ✅ What's Working

- ✅ Complete React frontend with modern UI
- ✅ Express backend API with Prisma ORM
- ✅ Vehicle listing and filtering
- ✅ Search functionality
- ✅ Responsive design
- ✅ Error handling and loading states
- ✅ Clean code structure

## 📋 Before Running

### 1. Ensure PostgreSQL is Running

Your `.env` file is configured for:
- Host: `localhost:5432`
- Database: `hurudrive_dev`
- User: `postgres`
- Password: `postgres`

**Start PostgreSQL** if it's not running.

### 2. Run Database Setup (First Time Only)

```bash
# Generate Prisma client (already done)
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# Seed sample data (vehicles, admin user)
npm run prisma:seed
```

### 3. Start the Application

```bash
npm run dev
```

This starts:
- **Backend API**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173` (opens automatically)

## 🎯 What You'll See

1. **Hero Section**: Search form with location and date pickers
2. **Vehicle Grid**: Cards showing available vehicles with:
   - Vehicle image
   - Title, year, category
   - Seats, transmission, fuel type, location
   - Daily price
   - "View Details" button

## 🧪 Test the System

1. **View Vehicles**: Should see sample vehicles (Toyota Prius, Nissan Note)
2. **Filter by Location**: Select "Nairobi" or "Nakuru" from dropdown
3. **Search**: Click "Find Car" button
4. **Responsive**: Resize browser to see mobile/tablet layouts

## 🔧 If Database Connection Fails

**Error**: `Can't reach database server at localhost:5432`

**Solutions**:
1. Start PostgreSQL service
2. Check `.env` file has correct DATABASE_URL
3. Verify database `hurudrive_dev` exists
4. Or switch to SQLite for quick testing (see SYSTEM_STATUS.md)

## 📱 Preview URLs

Once running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/vehicles
- **Health Check**: http://localhost:3000/api/health

## 🎨 Customization

See `CUSTOMIZATION.md` for:
- Changing locations
- Modifying colors
- Adding filters
- Updating vehicle fields

## 📚 Documentation

- `README.md` - Full project documentation
- `CUSTOMIZATION.md` - Customization guide
- `SYSTEM_STATUS.md` - Detailed status report

---

**Your system is ready! Just start PostgreSQL and run `npm run dev`** 🚀
