# Vehicle Image Upload Guide

## 📸 Image Storage Setup

Your HuruDrive system now supports **local image storage** for vehicle photos.

### Directory Structure
```
public/
  └── images/
      └── vehicles/    (stores uploaded vehicle images)
```

## 🚀 How to Add Images

### Method 1: Upload via API (Recommended)

**Endpoint:** `POST /api/vehicles/:id/images`

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/vehicles/VEHICLE_ID/images \
  -F "image=@/path/to/your/image.jpg"
```

**Example using JavaScript (fetch):**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch(`http://localhost:3000/api/vehicles/${vehicleId}/images`, {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log('Image uploaded:', data));
```

### Method 2: Manual File Placement

1. **Copy your image files** to: `public/images/vehicles/`
2. **Update the database** with the image URLs:

```sql
-- Example: Add image to a vehicle
INSERT INTO "VehicleImage" (id, "vehicleId", url, "order")
VALUES (
  gen_random_uuid(),
  'YOUR_VEHICLE_ID',
  '/images/images/vehicles/your-image.jpg',
  0
);
```

Or use Prisma Studio:
```bash
npm run prisma:studio
```

### Method 3: Update Seed Data

Edit `prisma/seed.js` and change image URLs to point to your local images:

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

## 🔗 Image URLs

Images are served at:
```
http://localhost:3000/images/images/vehicles/filename.jpg
```

The frontend automatically uses these URLs when displaying vehicles.

## 🗑️ Delete Images

**Endpoint:** `DELETE /api/vehicle-images/:imageId`

```bash
curl -X DELETE http://localhost:3000/api/vehicle-images/IMAGE_ID
```

## 📝 Update Existing Vehicles

To add images to existing vehicles:

1. **Get vehicle ID:**
   ```bash
   curl http://localhost:3000/api/vehicles
   ```

2. **Upload image:**
   ```bash
   curl -X POST http://localhost:3000/api/vehicles/VEHICLE_ID/images \
     -F "image=@car-photo.jpg"
   ```

## 🎨 Frontend Integration

The `CarCard` component automatically displays images from the `images` array. No changes needed!

## ☁️ Future: Cloud Storage

For production, consider:
- **Cloudinary** (easy integration)
- **AWS S3** (scalable)
- **Google Cloud Storage**
- **Azure Blob Storage**

I can help set up cloud storage when you're ready!

## 📦 Quick Start

1. **Place images** in `public/images/vehicles/`
2. **Update seed.js** with local paths
3. **Re-seed database:**
   ```bash
   npm run prisma:seed
   ```
4. **Refresh browser** - images will appear!

---

**Your images are now ready to be stored and displayed!** 🚗📸
