# 🚀 HuruDrive System - Running Guide

## ✅ System Status

Your HuruDrive car rental system is **RUNNING**!

## 🌐 Access Your Application

### Frontend (Main Application)
**URL:** http://localhost:5173

Open this in your web browser to see:
- Beautiful hero section with search form
- All 10 vehicles displayed in a responsive grid
- Location filtering
- Vehicle details with images

### Backend API
**URL:** http://localhost:3000

**Available Endpoints:**
- Health Check: http://localhost:3000/api/health
- All Vehicles: http://localhost:3000/api/vehicles
- Single Vehicle: http://localhost:3000/api/vehicles/:id

## 📱 What You'll See

### Homepage Features:

1. **Header**
   - HuruDrive logo
   - Navigation menu (Home, Cars, About, Contact)
   - Login/Register buttons

2. **Hero Section**
   - "Find Your Best Car in Nairobi" heading
   - Search form with:
     - Pickup Location dropdown (Nairobi, Nakuru, Mombasa, Kisumu, Eldoret)
     - Pickup Date picker
     - Pickup Time picker
     - "Find Car" button

3. **Vehicle Grid**
   - 10 vehicles displayed as cards
   - Each card shows:
     - Vehicle image
     - Title (e.g., "Toyota Land Cruiser Prado")
     - Year and category
     - Specifications (seats, transmission, fuel type, location)
     - Daily price in KSh
     - "View Details" button

## 🧪 Test the System

### 1. View All Vehicles
- Open http://localhost:5173
- Scroll down to see all 10 vehicles
- Notice the different categories: SUV, Sedan, Truck, Hatchback

### 2. Test Location Filter
- Select "Nairobi" from the location dropdown
- Click "Find Car"
- You should see vehicles filtered by Nairobi location

### 3. Test Different Locations
- Try "Nakuru", "Mombasa", "Eldoret", "Kisumu"
- See how the vehicle list changes

### 4. View Vehicle Details
- Click "View Details" on any vehicle card
- (Currently logs to console - ready for detail page implementation)

### 5. Responsive Design
- Resize your browser window
- See how the layout adapts:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns

## 📊 Your Vehicle Inventory

### SUVs (3)
- Toyota Land Cruiser Prado - KSh 15,000/day
- Nissan X-Trail - KSh 8,000/day
- Mitsubishi Pajero - KSh 12,000/day

### Sedans (3)
- Toyota Camry - KSh 5,000/day
- Honda Accord - KSh 4,500/day
- Toyota Prius - KSh 4,000/day

### Trucks (2)
- Toyota Hilux Double Cab - KSh 10,000/day
- Isuzu D-Max - KSh 9,000/day

### Hatchbacks (2)
- Nissan Note - KSh 2,500/day
- Toyota Vitz - KSh 3,000/day

## 🎨 Design Features

- **Modern UI**: Clean, professional design
- **Color Scheme**: Teal accents, dark buttons, white cards
- **Hover Effects**: Cards lift on hover
- **Loading States**: Spinner while fetching data
- **Error Handling**: User-friendly error messages
- **Responsive**: Works on all screen sizes

## 🔧 Troubleshooting

### Frontend Not Loading?
1. Wait 10-15 seconds for Vite to compile
2. Check terminal for any errors
3. Try refreshing the page
4. Check if port 5173 is available

### Backend Not Responding?
1. Check if PostgreSQL is running
2. Verify database connection
3. Check terminal for errors

### No Vehicles Showing?
1. Check browser console (F12) for errors
2. Verify API is responding: http://localhost:3000/api/vehicles
3. Check network tab in browser dev tools

## 🎯 Next Steps (Optional Enhancements)

1. **Vehicle Details Page** - Click "View Details" to see full info
2. **Booking System** - Add booking functionality
3. **User Authentication** - Login/Register pages
4. **Admin Dashboard** - Manage vehicles and bookings
5. **Payment Integration** - Process payments
6. **Search Filters** - Filter by price, category, make

## 📝 Quick Commands

**Stop the servers:**
- Press `Ctrl + C` in the terminal

**Restart:**
```bash
npm run dev
```

**View Database:**
```bash
npm run prisma:studio
```

**Check API:**
- Open: http://localhost:3000/api/vehicles

---

**Enjoy your fully functional HuruDrive car rental system! 🚗✨**
