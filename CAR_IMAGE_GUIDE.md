# 🚗 Car Image Download Guide

## Quick Method: Use Free Image URLs (Already Done)

I've created a script that updates your database with free car images from Unsplash. Just run:

```bash
node download-car-images.js
```

This will update all vehicle images in your database with high-quality free images.

---

## Method 1: Download Images Locally (Recommended for Production)

### Step 1: Download Images from Free Sources

**Free Image Sources:**
1. **Unsplash** - https://unsplash.com/s/photos/car
   - Search for your car model (e.g., "Toyota Land Cruiser")
   - Download high-quality images
   - Free to use, no attribution required

2. **Pexels** - https://www.pexels.com/search/car/
   - Free stock photos
   - Search by car model
   - High resolution available

3. **Pixabay** - https://pixabay.com/images/search/car/
   - Free images
   - Good variety of car photos

### Step 2: Save Images to Project

1. Create vehicle image folders:
   ```bash
   mkdir -p public/images/vehicles
   ```

2. Save images with descriptive names:
   ```
   public/images/vehicles/
   ├── toyota-land-cruiser-prado-1.jpg
   ├── toyota-land-cruiser-prado-2.jpg
   ├── nissan-x-trail-1.jpg
   └── ...
   ```

### Step 3: Update Database

Run the script to update database with local paths:
```bash
node download-car-images.js
```

Or manually update in Prisma Studio:
1. Open Prisma Studio: `npm run prisma:studio`
2. Go to VehicleImage table
3. Update URLs to: `/images/images/vehicles/your-image.jpg`

---

## Method 2: Use Image URLs Directly (Current Setup)

The script already uses free image URLs from Unsplash. These work immediately but depend on external services.

**Pros:**
- ✅ Works immediately
- ✅ No storage needed
- ✅ High quality images

**Cons:**
- ⚠️ Depends on external service
- ⚠️ Images might change

---

## Method 3: Manual Image Search & Download

### For Each Vehicle:

1. **Search Google Images:**
   - Go to: https://images.google.com
   - Search: "[Car Model] [Year]" (e.g., "Toyota Land Cruiser Prado 2020")
   - Click "Tools" → "Usage Rights" → "Creative Commons licenses"
   - Download images you like

2. **Or Use Car Manufacturer Websites:**
   - Official car websites often have high-quality images
   - Check usage rights before using

3. **Save to Project:**
   - Save to `public/images/vehicles/`
   - Update database URLs

---

## Recommended Image Specifications

- **Size:** 800x600 pixels or larger
- **Format:** JPG or PNG
- **Aspect Ratio:** 4:3 or 16:9
- **File Size:** Under 500KB per image
- **Multiple Angles:** Front, side, interior (optional)

---

## Quick Commands

### Update all images with free URLs:
```bash
node download-car-images.js
```

### View current images in database:
```bash
npm run prisma:studio
```
Then go to VehicleImage table

### Upload images via API:
```bash
# Use the upload endpoint
POST /api/vehicles/:id/images
```

---

## Current Vehicle List

Your vehicles that need images:
1. Toyota Land Cruiser Prado
2. Nissan X-Trail
3. Mitsubishi Pajero
4. Toyota Camry
5. Honda Accord
6. Toyota Prius
7. Toyota Hilux Double Cab
8. Isuzu D-Max
9. Nissan Note
10. Toyota Vitz

---

## Next Steps

1. **Run the script** to get free images immediately:
   ```bash
   node download-car-images.js
   ```

2. **For production**, download actual car images and save locally

3. **Update database** with local image paths

4. **Test** by viewing vehicles on your website

---

## Need Help?

- Check `download-car-images.js` for the script
- Use Prisma Studio to manually update images
- Images are stored in `VehicleImage` table in database
