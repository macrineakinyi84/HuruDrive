# 🖼️ How to Get Real Car Images

## ✅ Quick Solution (Already Done!)

Your database has been updated with free car images from Unsplash. The images are now live!

**To see them:**
1. Refresh your website
2. All vehicles should now show car images instead of placeholders

---

## 🎯 Get Better, Specific Car Images

### Option 1: Use Free Stock Photo Sites (Recommended)

#### **Unsplash** (Best Quality)
1. Go to: https://unsplash.com
2. Search: "[Car Model]" (e.g., "Toyota Land Cruiser Prado")
3. Filter: "Orientation" → "Landscape"
4. Download high-quality images
5. Save to: `public/images/vehicles/`
6. Update database URLs

#### **Pexels** (Great Variety)
1. Go to: https://www.pexels.com
2. Search: "[Car Model]"
3. Download free images
4. Save locally and update database

#### **Pixabay** (Large Collection)
1. Go to: https://pixabay.com
2. Search: "[Car Model]"
3. Download free images
4. Use in your project

---

### Option 2: Download from Google Images (With Rights)

1. Go to: https://images.google.com
2. Search: "[Car Model] [Year]" (e.g., "Toyota Land Cruiser Prado 2020")
3. Click "Tools"
4. Select "Usage Rights" → "Creative Commons licenses"
5. Download images you like
6. Save to project and update database

---

### Option 3: Use Car Manufacturer Websites

Many car manufacturers provide high-quality images:
- Toyota: https://www.toyota.com
- Nissan: https://www.nissan.com
- Honda: https://www.honda.com
- Check their media galleries

**Note:** Check usage rights before using manufacturer images.

---

## 📥 How to Add Downloaded Images

### Step 1: Save Images

```bash
# Create directory if it doesn't exist
mkdir -p public/images/vehicles

# Save your downloaded images there
# Example: public/images/vehicles/toyota-land-cruiser-1.jpg
```

### Step 2: Update Database

**Method A: Using Prisma Studio**
```bash
npm run prisma:studio
```
1. Go to `VehicleImage` table
2. Find your vehicle
3. Update URL to: `/images/images/vehicles/your-image.jpg`

**Method B: Using Script**
Update `download-car-images.js` with your local image paths:
```javascript
const LOCAL_IMAGES = {
  'Toyota Land Cruiser Prado': [
    '/images/images/vehicles/toyota-land-cruiser-1.jpg',
    '/images/images/vehicles/toyota-land-cruiser-2.jpg'
  ],
  // ... etc
};
```

---

## 🚀 Quick Commands

### Update images with free URLs:
```bash
node download-car-images.js
```

### View current images:
```bash
npm run prisma:studio
# Go to VehicleImage table
```

### Test images on website:
1. Start server: `npm run dev`
2. Visit: http://localhost:5173
3. Check vehicle cards and details pages

---

## 📋 Image Requirements

- **Size:** 800x600px minimum
- **Format:** JPG or PNG
- **File Size:** Under 500KB (optimize if needed)
- **Aspect Ratio:** 4:3 or 16:9
- **Quality:** High resolution, clear images

---

## 🎨 Image Optimization Tips

1. **Compress images** before uploading:
   - Use: https://tinypng.com or https://squoosh.app
   - Reduces file size without losing quality

2. **Resize if needed:**
   - Use: https://www.iloveimg.com/resize-image
   - Target: 800x600px

3. **Multiple angles:**
   - Front view
   - Side view
   - Interior (optional)

---

## ✅ Current Status

✅ **Database Updated:** All vehicles now have image URLs
✅ **Images Working:** Free Unsplash images are live
✅ **Ready to Customize:** You can replace with specific car images anytime

---

## 🔄 Next Steps

1. **Test current images** - Refresh your website to see them
2. **Download specific images** - Get exact car model photos
3. **Save locally** - Store in `public/images/vehicles/`
4. **Update database** - Replace URLs with local paths

---

## 💡 Pro Tips

- **Use multiple images per vehicle** for better presentation
- **Keep image names descriptive** (e.g., `toyota-camry-front.jpg`)
- **Optimize images** to improve page load speed
- **Use consistent image sizes** for uniform appearance

---

Your car images are now live! 🎉
