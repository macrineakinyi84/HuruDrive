# HuruDrive Customization Guide

This guide explains what you can easily change in the HuruDrive car rental system to customize it for your needs.

## Table of Contents

1. [Frontend Customization](#frontend-customization)
2. [Backend Customization](#backend-customization)
3. [Database Schema Changes](#database-schema-changes)
4. [Styling & Branding](#styling--branding)
5. [Adding New Features](#adding-new-features)

---

## Frontend Customization

### 1. Changing Locations

**File:** `src/components/Hero.jsx`

The available pickup locations are defined in the `LOCATIONS` array:

```jsx
const LOCATIONS = ['Nairobi', 'Nakuru', 'Mombasa', 'Kisumu', 'Eldoret'];
```

**To change:** Simply modify this array to match your service areas:

```jsx
const LOCATIONS = ['Your City 1', 'Your City 2', 'Your City 3'];
```

### 2. Modifying Vehicle Display Fields

**File:** `src/components/CarCard.jsx`

The vehicle card shows:
- Title/Name
- Year and Category
- Seats, Transmission, Fuel Type, Location
- Daily Price
- "View Details" button

**To change what's displayed:**

- **Remove a field:** Delete the corresponding `<div>` block
- **Add a field:** Add a new `<div>` using `vehicle.yourFieldName`
- **Change labels:** Modify the text inside the `<div>` elements

Example - adding mileage:
```jsx
{vehicle.mileage && (
  <div className="flex items-center gap-1">
    <span>📊</span>
    <span>{vehicle.mileage} km</span>
  </div>
)}
```

### 3. Adjusting Grid Layout

**File:** `src/components/CarsGrid.jsx`

The grid uses Tailwind's responsive classes:
- `grid-cols-1` - 1 column on mobile
- `md:grid-cols-2` - 2 columns on medium screens
- `lg:grid-cols-3` - 3 columns on large screens

**To change:** Modify the `grid` className:
```jsx
// For 4 columns on large screens:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### 4. Customizing Hero Section Text

**File:** `src/components/Hero.jsx`

Change the main heading and description:
```jsx
<h1 className="...">
  Your Custom Heading Here
</h1>
<p className="...">
  Your custom description text
</p>
```

### 5. Adding Search Filters

**File:** `src/components/Hero.jsx` and `src/App.jsx`

To add more search filters (e.g., price range, make, category):

1. Add input fields in `Hero.jsx`:
```jsx
<div className="w-48">
  <label>Min Price</label>
  <input 
    type="number"
    value={filters.minPrice}
    onChange={(e) => handleChange('minPrice', e.target.value)}
  />
</div>
```

2. Pass the filter to the API in `App.jsx`:
```jsx
const apiFilters = {
  location: searchFilters.location,
  minPrice: searchFilters.minPrice || undefined,
  // ... other filters
};
```

---

## Backend Customization

### 1. Adding New API Filters

**File:** `server.js`

The `buildVehicleFilters()` function handles query parameters. To add a new filter:

```js
function buildVehicleFilters(query) {
  const where = {};
  
  // Existing filters...
  
  // Add your new filter:
  if (query.yourNewFilter) {
    where.yourField = query.yourNewFilter;
  }
  
  return where;
}
```

### 2. Changing Default Vehicle Status

**File:** `server.js`

By default, only `AVAILABLE` vehicles are shown. To change this:

```js
// Show all vehicles by default:
// Remove or comment out these lines:
if (!query.includeUnavailable) {
  where.status = 'AVAILABLE';
}

// Or show only specific statuses:
if (!query.includeUnavailable) {
  where.status = { in: ['AVAILABLE', 'MAINTENANCE'] };
}
```

### 3. Modifying API Response Format

**File:** `server.js`

The `/api/vehicles` endpoint returns vehicles with images. To change what's included:

```js
const vehicles = await prisma.vehicle.findMany({
  where,
  orderBy: { createdAt: 'desc' },
  include: {
    images: { orderBy: { order: 'asc' } },
    // Add more relations:
    bookings: true,  // Include booking history
  },
  // Or select specific fields only:
  select: {
    id: true,
    title: true,
    dailyPrice: true,
    // ... only fields you need
  }
});
```

### 4. Adding New API Endpoints

**File:** `server.js`

Example - add an endpoint to get vehicle statistics:

```js
app.get('/api/vehicles/stats', async (req, res) => {
  try {
    const total = await prisma.vehicle.count();
    const available = await prisma.vehicle.count({
      where: { status: 'AVAILABLE' }
    });
    res.json({ total, available });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
```

---

## Database Schema Changes

### 1. Adding New Fields to Vehicle

**File:** `prisma/schema.prisma`

To add a new field (e.g., `mileage`):

```prisma
model Vehicle {
  // ... existing fields
  mileage Int?  // Optional integer field
}
```

Then run:
```bash
npx prisma migrate dev --name add_mileage
npx prisma generate
```

### 2. Adding New Vehicle Categories

Categories are stored as strings. To enforce specific categories, you could:

1. **Keep as string** (flexible, current approach)
2. **Use an enum** (more strict):

```prisma
enum VehicleCategory {
  SEDAN
  SUV
  HATCHBACK
  TRUCK
  VAN
}

model Vehicle {
  category VehicleCategory?
}
```

### 3. Adding New Locations

Locations are also strings. You can:
- Keep flexible strings (current)
- Create a `Location` model for more structure
- Use an enum for fixed locations

---

## Styling & Branding

### 1. Changing Colors

**File:** `tailwind.config.js`

The theme colors are defined here:

```js
colors: {
  'dark': '#1a1a1a',      // Main dark color
  'teal': '#14b8a6',      // Primary accent color
  'muted': '#6b7280',     // Muted text color
}
```

**To change:** Replace the hex codes with your brand colors:

```js
colors: {
  'dark': '#your-dark-color',
  'teal': '#your-primary-color',
  'muted': '#your-muted-color',
}
```

Then update components that use these colors (search for `text-teal`, `bg-dark`, etc.).

### 2. Changing Border Radius

**File:** `tailwind.config.js`

The `rounded-xlcard` class uses:

```js
borderRadius: {
  'xlcard': '1rem',  // 16px
}
```

Change to your preferred radius (e.g., `'0.5rem'` for smaller, `'1.5rem'` for larger).

### 3. Changing Fonts

**File:** `src/index.css`

The font family is set in the `body` selector. Change to your preferred font:

```css
body {
  font-family: 'Your Font', ui-sans-serif, system-ui, sans-serif;
}
```

### 4. Updating Logo/Brand Name

**File:** `src/components/Header.jsx`

Change the brand name and logo:

```jsx
<span className="text-lg font-semibold brand-name">Your Brand Name</span>
```

Replace the emoji logo (🚗) with your logo image if needed.

---

## Adding New Features

### 1. Vehicle Details Page

1. Create `src/components/VehicleDetails.jsx`
2. Add routing (install `react-router-dom` if needed)
3. Fetch vehicle by ID: `GET /api/vehicles/:id`
4. Update `CarCard.jsx` button to navigate to details

### 2. User Authentication

1. Add login/register pages
2. Implement JWT in backend (`server.js`)
3. Add protected routes
4. Store auth token in localStorage or cookies

### 3. Booking System

1. Create booking form component
2. Add `POST /api/bookings` endpoint in `server.js`
3. Validate dates and availability
4. Create payment integration

### 4. Admin Dashboard

1. Create admin routes/components
2. Add admin-only API endpoints
3. Implement vehicle CRUD operations
4. Add user management

---

## Quick Reference: Key Files

| File | Purpose | What to Change |
|------|---------|----------------|
| `src/components/CarCard.jsx` | Vehicle display card | Fields shown, styling |
| `src/components/CarsGrid.jsx` | Vehicle listing grid | Layout, filters |
| `src/components/Hero.jsx` | Search/hero section | Locations, search fields |
| `src/components/Header.jsx` | Navigation header | Branding, links |
| `server.js` | Backend API | Endpoints, filters, logic |
| `prisma/schema.prisma` | Database schema | Models, fields, relations |
| `tailwind.config.js` | Styling config | Colors, spacing, fonts |

---

## Need Help?

- Check the main `README.md` for setup instructions
- Review the Prisma documentation for database changes
- Check Tailwind CSS docs for styling options
- Review React documentation for component changes
