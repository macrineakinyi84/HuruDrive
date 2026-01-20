# 📸 How to Add Vehicle Images

## ✅ Image Storage System is Ready!

Your HuruDrive system now has **full image upload and storage** functionality!

## 🚀 Quick Start: Add Images to Your Vehicles

### Method 1: Upload via API (Recommended)

**Step 1:** Get a vehicle ID
```bash
curl http://localhost:3000/api/vehicles
```

**Step 2:** Upload an image
```bash
curl -X POST http://localhost:3000/api/vehicles/VEHICLE_ID/images \
  -F "image=@C:\path\to\your\car-photo.jpg"
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/vehicles/a025db00-1cd6-4d62-a283-c9aea3575242/images \
  -F "image=@C:\Users\Awuor\Pictures\toyota-prado.jpg"
```

### Method 2: Manual File Placement (Easiest)

1. **Copy your image files** to:
   ```
   C:\Users\Awuor\HuruDrive\public\images\vehicles\
   ```

2. **Update the database** using Prisma Studio:
   ```bash
   npm run prisma:studio
   ```
   
   Then:
   - Go to "VehicleImage" model
   - Click "Add record"
   - Enter:
     - `vehicleId`: (select from dropdown)
     - `url`: `/images/images/vehicles/your-filename.jpg`
     - `order`: `0`

### Method 3: Update Seed Data

Edit `prisma/seed.js` and change image URLs:

```javascript
images: [
  { url: '/images/images/vehicles/toyota-prado.jpg', order: 0 }
]
```

Then re-seed:
```bash
npm run prisma:seed
```

## 📋 Image Requirements

- **Formats:** JPEG, JPG, PNG, GIF, WebP
- **Max Size:** 5MB per image
- **Recommended:**
  - Resolution: 1200x800px or higher
  - Aspect Ratio: 3:2 or 16:9
  - File Size: Under 500KB (optimized)

## 🔗 How Images Work

1. **Storage Location:** `public/images/vehicles/`
2. **Served at:** `http://localhost:3000/images/images/vehicles/filename.jpg`
3. **Database:** URLs stored in `VehicleImage` table
4. **Frontend:** Automatically displays images from the database

## 📝 Example: Add Image to Toyota Land Cruiser

1. **Get vehicle ID:**
   ```bash
   curl http://localhost:3000/api/vehicles | findstr "Land Cruiser"
   ```

2. **Upload image:**
   ```bash
   curl -X POST http://localhost:3000/api/vehicles/VEHICLE_ID/images \
     -F "image=@toyota-prado.jpg"
   ```

3. **Refresh browser** - image will appear!

## 🗑️ Delete Images

```bash
curl -X DELETE http://localhost:3000/api/vehicle-images/IMAGE_ID
```

## 🎨 Frontend Display

The `CarCard` component automatically:
- Shows the first image from the `images` array
- Falls back to placeholder if no image
- Handles both local paths and full URLs

## 📦 Directory Structure

```
HuruDrive/
├── public/
│   └── images/
│       └── vehicles/    ← Your images go here!
│           ├── toyota-prado.jpg
│           ├── nissan-xtrail.jpg
│           └── ...
```

## ✨ Next Steps

1. **Add your vehicle photos** to `public/images/vehicles/`
2. **Update database** with image URLs (via Prisma Studio or API)
3. **Refresh browser** to see your images!

---

**Your image storage system is fully functional!** 🚗📸
