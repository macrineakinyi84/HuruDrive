# 📊 Step-by-Step Guide: Creating Entity Relationship Diagram (ERD)

## Overview

This guide will help you create the Entity Relationship Diagram for HuruDrive using Draw.io (diagrams.net).

---

## 🎯 What We're Creating

An ER diagram showing the database structure with:
- **5 Entities:** User, Vehicle, VehicleImage, Booking, Payment
- **Relationships:** One-to-Many and One-to-One relationships
- **Attributes:** All fields for each entity
- **Primary Keys:** ID fields
- **Foreign Keys:** Relationship fields

---

## 📋 Step-by-Step Instructions

### Step 1: Open Draw.io

1. **Open your web browser**
2. **Go to:** https://app.diagrams.net
3. **Choose where to save:**
   - Select "Device" to save locally
4. **Click "Create New Diagram"**

---

### Step 2: Select Template

1. **In the template selection:**
   - Search for "Entity Relationship" or "Database"
   - OR select "Blank Diagram"
   - Click "Create"

---

### Step 3: Enable Database Shapes

1. **Click "More Shapes"** at the bottom left
2. **Check "Entity Relation"** (if available)
3. **OR use "General" shapes:**
   - Rectangles for entities
   - Lines for relationships
4. **Click "Apply"**

---

### Step 4: Create User Entity

1. **Drag a rectangle** onto the canvas (top-left area)
2. **Double-click to add text:**
   - Type: `USER` (in bold, larger font)
3. **Resize** to make it wider (for attributes)
4. **Add attributes:**
   - Click inside the rectangle
   - Press Enter to add lines
   - Add each attribute:
     ```
     USER
     ──────────────
     id (PK)
     name
     email (UK)
     phone
     passwordHash
     role
     createdAt
     updatedAt
     ```
5. **Format:**
   - Make "USER" bold and larger (14-16pt)
   - Make "id (PK)" bold
   - Use smaller font (10-12pt) for attributes
   - Add underline under "USER"

---

### Step 5: Create Vehicle Entity

1. **Drag another rectangle** to the right of User
2. **Double-click and add:**
   ```
   VEHICLE
   ──────────────
   id (PK)
   title
   make
   model
   year
   category
   seats
   transmission
   fuelType
   location
   dailyPrice
   status
   createdAt
   updatedAt
   ```
3. **Format same as User entity**

---

### Step 6: Create VehicleImage Entity

1. **Drag a rectangle** below Vehicle
2. **Add:**
   ```
   VEHICLEIMAGE
   ──────────────
   id (PK)
   vehicleId (FK)
   url
   order
   ```
3. **Format same as others**

---

### Step 7: Create Booking Entity

1. **Drag a rectangle** below User
2. **Add:**
   ```
   BOOKING
   ──────────────
   id (PK)
   userId (FK)
   vehicleId (FK)
   pickupLocation
   returnLocation
   pickupAt
   returnAt
   totalPrice
   status
   paymentStatus
   createdAt
   updatedAt
   ```
3. **Format same as others**

---

### Step 8: Create Payment Entity

1. **Drag a rectangle** below Booking
2. **Add:**
   ```
   PAYMENT
   ──────────────
   id (PK)
   bookingId (FK)
   userId (FK)
   provider
   providerPaymentId
   amount
   currency
   status
   rawResponse
   createdAt
   ```
3. **Format same as others**

---

### Step 9: Arrange Entities

**Layout suggestion:**
```
    [USER]          [VEHICLE]
       │                │
       │                │
    [BOOKING]      [VEHICLEIMAGE]
       │
       │
    [PAYMENT]
```

**To arrange:**
1. **Select all entities** (Ctrl+A)
2. **Use alignment tools:**
   - Arrange → Align → Left/Right/Center
   - Arrange → Distribute → Horizontally/Vertically
3. **Adjust spacing** for readability

---

### Step 10: Draw Relationships

#### Relationship 1: User → Booking (One-to-Many)

1. **Click on the connection tool** (arrow icon) or press "C"
2. **Click on USER entity** (starting point)
3. **Drag to BOOKING entity** (ending point)
4. **Add cardinality:**
   - Double-click on the line
   - Add labels:
     - Near USER: `1`
     - Near BOOKING: `*` (many)
5. **Add relationship name:**
   - Double-click on the middle of the line
   - Type: `has` or `makes`
6. **Format line:**
   - Make it solid
   - Color: Black or dark gray

---

#### Relationship 2: User → Payment (One-to-Many)

1. **Draw line from USER to PAYMENT**
2. **Add cardinality:**
   - USER side: `1`
   - PAYMENT side: `*`
3. **Add label:** `makes` or `has`

---

#### Relationship 3: Vehicle → Booking (One-to-Many)

1. **Draw line from VEHICLE to BOOKING**
2. **Add cardinality:**
   - VEHICLE side: `1`
   - BOOKING side: `*`
3. **Add label:** `has` or `booked_in`

---

#### Relationship 4: Vehicle → VehicleImage (One-to-Many)

1. **Draw line from VEHICLE to VEHICLEIMAGE**
2. **Add cardinality:**
   - VEHICLE side: `1`
   - VEHICLEIMAGE side: `*`
3. **Add label:** `has` or `contains`

---

#### Relationship 5: Booking → Payment (One-to-One Optional)

1. **Draw line from BOOKING to PAYMENT**
2. **Add cardinality:**
   - BOOKING side: `1`
   - PAYMENT side: `0..1` (zero or one - optional)
3. **Add label:** `has` or `paid_with`
4. **Make line dashed** (to show optional relationship):
   - Right-click line → Format → Line Style → Dashed

---

### Step 11: Add Primary Key Indicators

1. **For each entity, mark primary keys:**
   - Add "(PK)" after id fields (already done)
   - Make them bold
   - You can also underline them

2. **Add unique constraint:**
   - For User.email, add "(UK)" for Unique Key

---

### Step 12: Add Foreign Key Indicators

1. **Mark foreign keys:**
   - Add "(FK)" after foreign key fields (already done)
   - Make them italic or different color

2. **Foreign keys in your diagram:**
   - VehicleImage.vehicleId (FK)
   - Booking.userId (FK)
   - Booking.vehicleId (FK)
   - Payment.bookingId (FK)
   - Payment.userId (FK)

---

### Step 13: Format the Diagram

1. **Select all entities:**
   - Press Ctrl+A

2. **Apply consistent formatting:**
   - **Fill Color:** Light blue or white
   - **Border:** Black, 2px
   - **Text:** 
     - Entity names: Bold, 14-16pt
     - Attributes: Regular, 10-12pt
     - PK/FK: Bold or italic

3. **Format relationships:**
   - **Line Color:** Black or dark gray
   - **Line Width:** 2px
   - **Arrow Style:** Simple arrow or crow's foot
   - **Optional relationships:** Dashed lines

---

### Step 14: Add Cardinality Symbols

**Standard ERD notation:**

- **One-to-Many (1 to *):**
   - One side: `1`
   - Many side: `*` or `N` or `M`

- **One-to-One (1 to 1):**
   - Both sides: `1`

- **One-to-Zero-or-One (1 to 0..1):**
   - One side: `1`
   - Optional side: `0..1`

**Add these near the connection points:**
- Use text boxes or labels
- Position near entity boxes
- Make them clear and readable

---

### Step 15: Add Title and Legend

1. **Add title:**
   - Click on canvas (empty area)
   - Add text box: "HuruDrive - Entity Relationship Diagram"
   - Format: Bold, 18-20pt, center align
   - Position at top

2. **Add legend (optional):**
   - Create a box in corner
   - Add:
     ```
     Legend:
     (PK) = Primary Key
     (FK) = Foreign Key
     (UK) = Unique Key
     1 = One
     * = Many
     0..1 = Zero or One
     ```

---

### Step 16: Final Adjustments

1. **Review the diagram:**
   - Check all entities are present
   - Verify all relationships are shown
   - Ensure cardinality is correct
   - Check formatting is consistent

2. **Adjust spacing:**
   - Make sure entities don't overlap
   - Ensure relationships don't cross unnecessarily
   - Keep diagram readable

3. **Align everything:**
   - Use grid (View → Grid)
   - Enable snap to grid
   - Align entities properly

---

### Step 17: Save Your Diagram

1. **Click "File" → "Save As"**
2. **Choose format:**
   - **For editing:** `.drawio` or `.xml`
   - **For documentation:** `.png` (high resolution) or `.pdf`
3. **Name it:** `HuruDrive_ER_Diagram`
4. **Click "Save"**

---

### Step 18: Export for Documentation

1. **Click "File" → "Export as" → "PNG"**
2. **Set options:**
   - **Zoom:** 200% or 300% (for high quality)
   - **Border:** 10-20px (adds white space)
   - **Transparent background:** Uncheck (use white)
3. **Click "Export"**
4. **Save the PNG file**

**OR export as PDF:**
- **File → Export as → PDF**
- Better for printing
- Maintains quality

---

## 🎨 Visual Layout Reference

```
┌─────────────────────┐         ┌─────────────────────┐
│       USER          │         │      VEHICLE         │
│  ───────────────   │         │  ───────────────    │
│  id (PK)            │         │  id (PK)            │
│  name               │         │  title              │
│  email (UK)         │         │  make               │
│  phone              │         │  model              │
│  passwordHash       │         │  year               │
│  role               │         │  category           │
│  createdAt          │         │  seats              │
│  updatedAt          │         │  transmission       │
└──────────┬──────────┘         │  fuelType           │
           │                    │  location           │
           │ 1                  │  dailyPrice         │
           │                    │  status             │
           │ *                  │  createdAt          │
           │                    │  updatedAt          │
           ▼                    └──────────┬──────────┘
┌─────────────────────┐                    │
│      BOOKING        │                    │ 1
│  ───────────────    │                    │
│  id (PK)            │                    │ *
│  userId (FK)        │                    ▼
│  vehicleId (FK)      │    ┌─────────────────────┐
│  pickupLocation     │    │   VEHICLEIMAGE      │
│  returnLocation     │    │  ───────────────     │
│  pickupAt           │    │  id (PK)            │
│  returnAt           │    │  vehicleId (FK)     │
│  totalPrice         │    │  url                │
│  status             │    │  order              │
│  paymentStatus      │    └─────────────────────┘
│  createdAt          │
│  updatedAt          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ 0..1 (optional)
           │
           ▼
┌─────────────────────┐
│      PAYMENT         │
│  ───────────────    │
│  id (PK)            │
│  bookingId (FK)     │
│  userId (FK)        │
│  provider           │
│  amount             │
│  currency           │
│  status             │
│  createdAt          │
└─────────────────────┘
```

---

## 📐 Relationship Details

### Relationship 1: User → Booking
- **Type:** One-to-Many
- **Cardinality:** 1 to *
- **Meaning:** One user can have many bookings
- **Foreign Key:** Booking.userId

### Relationship 2: User → Payment
- **Type:** One-to-Many
- **Cardinality:** 1 to *
- **Meaning:** One user can have many payments
- **Foreign Key:** Payment.userId

### Relationship 3: Vehicle → Booking
- **Type:** One-to-Many
- **Cardinality:** 1 to *
- **Meaning:** One vehicle can have many bookings
- **Foreign Key:** Booking.vehicleId

### Relationship 4: Vehicle → VehicleImage
- **Type:** One-to-Many
- **Cardinality:** 1 to *
- **Meaning:** One vehicle can have many images
- **Foreign Key:** VehicleImage.vehicleId

### Relationship 5: Booking → Payment
- **Type:** One-to-One (Optional)
- **Cardinality:** 1 to 0..1
- **Meaning:** One booking can have zero or one payment
- **Foreign Key:** Payment.bookingId
- **Note:** Optional (dashed line)

---

## 💡 Pro Tips

1. **Use Consistent Colors:**
   - Entities: Light blue or white
   - Primary Keys: Bold, underlined
   - Foreign Keys: Italic or different color
   - Relationships: Black lines

2. **Keep It Organized:**
   - Group related entities together
   - Avoid crossing lines when possible
   - Use clear spacing

3. **Label Everything:**
   - Clear entity names
   - Mark all PKs and FKs
   - Add relationship labels
   - Show cardinality clearly

4. **Use Grid:**
   - Enable grid (View → Grid)
   - Enable snap to grid
   - Helps with alignment

5. **Test Readability:**
   - Zoom out to see whole diagram
   - Make sure text is readable
   - Ensure relationships are clear

---

## 🔧 Keyboard Shortcuts

- **C**: Connection tool (draw relationships)
- **Ctrl+A**: Select all
- **Ctrl+C**: Copy
- **Ctrl+V**: Paste
- **Ctrl+Z**: Undo
- **Delete**: Delete selected
- **Arrow Keys**: Move selected shapes
- **Ctrl+D**: Duplicate

---

## ✅ Checklist

Before exporting, make sure:

- [ ] All 5 entities are present (User, Vehicle, VehicleImage, Booking, Payment)
- [ ] All attributes are listed
- [ ] Primary keys are marked (PK)
- [ ] Foreign keys are marked (FK)
- [ ] All relationships are drawn
- [ ] Cardinality is shown (1, *, 0..1)
- [ ] Relationship labels are added
- [ ] Optional relationship is dashed
- [ ] Formatting is consistent
- [ ] Title is added
- [ ] Diagram is readable
- [ ] Diagram is saved
- [ ] High-quality export is created

---

## 📸 Example Colors

**Recommended Color Scheme:**

- **Entities (Rectangles):**
  - Fill: #E6F3FF (Light Blue) or White
  - Border: #0066CC (Blue), 2px

- **Entity Names:**
  - Color: #000000 (Black)
  - Font: Bold, 14-16pt
  - Underline: Yes

- **Primary Keys:**
  - Color: #000000 (Black)
  - Font: Bold
  - Mark: (PK)

- **Foreign Keys:**
  - Color: #666666 (Gray)
  - Font: Italic or Regular
  - Mark: (FK)

- **Relationships (Lines):**
  - Color: #000000 (Black)
  - Width: 2px
  - Style: Solid (or dashed for optional)

---

## 🎓 Final Result

Your ER diagram should show:

1. **5 Entities** clearly defined
2. **All attributes** listed for each entity
3. **Primary Keys** marked with (PK)
4. **Foreign Keys** marked with (FK)
5. **5 Relationships** with proper cardinality
6. **Clear labels** on relationships
7. **Professional appearance**
8. **Readable text**

---

## 📁 File Naming

Save your files as:
- **Editable:** `HuruDrive_ER_Diagram.drawio`
- **Image:** `HuruDrive_ER_Diagram.png`
- **PDF:** `HuruDrive_ER_Diagram.pdf`

---

## 🆘 Troubleshooting

**Problem: Can't find ER shapes**
- Solution: Use regular rectangles and lines, they work just as well

**Problem: Relationships look messy**
- Solution: Use "Arrange" menu to align and distribute entities

**Problem: Text too small**
- Solution: Increase font size in format panel

**Problem: Can't add cardinality**
- Solution: Use text boxes near connection points

**Problem: Export quality is poor**
- Solution: Increase zoom to 200-300% before exporting

---

## 🚀 Next Steps

After creating your ER diagram:

1. **Review it** - Make sure it matches your database schema
2. **Export high-quality image** - For your report
3. **Save editable version** - In case you need changes
4. **Insert into documentation** - Add to Chapter 5

---

## 📋 Quick Reference: All Entities

### USER
- id (PK), name, email (UK), phone, passwordHash, role, createdAt, updatedAt

### VEHICLE
- id (PK), title, make, model, year, category, seats, transmission, fuelType, location, dailyPrice, status, createdAt, updatedAt

### VEHICLEIMAGE
- id (PK), vehicleId (FK), url, order

### BOOKING
- id (PK), userId (FK), vehicleId (FK), pickupLocation, returnLocation, pickupAt, returnAt, totalPrice, status, paymentStatus, createdAt, updatedAt

### PAYMENT
- id (PK), bookingId (FK), userId (FK), provider, providerPaymentId, amount, currency, status, rawResponse, createdAt

---

**Need help with other diagrams?** Let me know which one you'd like to create next! 🎨
