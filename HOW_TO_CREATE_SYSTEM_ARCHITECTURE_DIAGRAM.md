# 🏗️ Step-by-Step Guide: Creating System Architecture Diagram

## Overview

This guide will help you create the System Architecture Diagram for HuruDrive showing the three-tier architecture.

---

## 🎯 What We're Creating

A System Architecture Diagram showing:
- **Presentation Layer:** React Frontend components
- **Application Layer:** Node.js/Express Backend APIs
- **Data Layer:** PostgreSQL Database
- **Communication flows** between layers

---

## 📋 Step-by-Step Instructions

### Step 1: Open Draw.io

1. **Go to:** https://app.diagrams.net
2. **Create New Diagram**
3. **Select "Blank Diagram"**

---

### Step 2: Create Three Layers

#### Layer 1: Presentation Layer (Top)

1. **Drag a large rectangle** at the top
2. **Add label:** `PRESENTATION LAYER`
3. **Subtitle:** `(React Frontend)`
4. **Format:**
   - Fill: Light blue (#E6F3FF)
   - Border: Blue, 3px
   - Text: Bold, 16pt

#### Layer 2: Application Layer (Middle)

1. **Drag a large rectangle** in the middle
2. **Add label:** `APPLICATION LAYER`
3. **Subtitle:** `(Node.js/Express Backend)`
4. **Format:**
   - Fill: Light green (#E6FFE6)
   - Border: Green, 3px
   - Text: Bold, 16pt

#### Layer 3: Data Layer (Bottom)

1. **Drag a large rectangle** at the bottom
2. **Add label:** `DATA LAYER`
3. **Subtitle:** `(PostgreSQL Database)`
4. **Format:**
   - Fill: Light yellow (#FFF9E6)
   - Border: Orange, 3px
   - Text: Bold, 16pt

---

### Step 3: Add Presentation Layer Components

**Inside Presentation Layer rectangle, add:**

1. **Create component boxes:**
   - `Home Page`
   - `Vehicle Details Page`
   - `Login Page`
   - `Register Page`
   - `Booking Page`
   - `Payment Page`

2. **Format components:**
   - Small rectangles
   - Fill: White
   - Border: Blue, 1px
   - Text: 10-12pt

3. **Arrange horizontally** or in a grid

---

### Step 4: Add Application Layer Components

**Inside Application Layer rectangle, add:**

1. **Create API boxes:**
   - `Auth API`
   - `Vehicle API`
   - `Booking API`
   - `Payment API`
   - `Image API`

2. **Add Business Logic box:**
   - `Business Logic & Validation Layer`

3. **Format:**
   - Fill: White
   - Border: Green, 1px
   - Text: 10-12pt

---

### Step 5: Add Data Layer Components

**Inside Data Layer rectangle, add:**

1. **Create database tables:**
   - `User`
   - `Vehicle`
   - `VehicleImage`
   - `Booking`
   - `Payment`

2. **Format:**
   - Fill: White
   - Border: Orange, 1px
   - Text: 10-12pt

---

### Step 6: Draw Communication Flows

#### Flow 1: Frontend → Backend

1. **Draw arrows** from Presentation Layer to Application Layer
2. **Label:** `HTTP/REST API`
3. **Style:** Solid arrow, blue color
4. **Multiple arrows** from different pages to APIs

#### Flow 2: Backend → Database

1. **Draw arrows** from Application Layer to Data Layer
2. **Label:** `Prisma ORM`
3. **Style:** Solid arrow, green color
4. **From Business Logic** to database tables

#### Flow 3: Database → Backend

1. **Draw arrows** from Data Layer back to Application Layer
2. **Label:** `Query Results`
3. **Style:** Dashed arrow, green color

#### Flow 4: Backend → Frontend

1. **Draw arrows** from Application Layer back to Presentation Layer
2. **Label:** `JSON Response`
3. **Style:** Dashed arrow, blue color

---

### Step 7: Add Technology Labels

**Add technology names:**

1. **Presentation Layer:**
   - `React 18`
   - `React Router`
   - `Tailwind CSS`
   - `Vite`

2. **Application Layer:**
   - `Node.js`
   - `Express.js`
   - `Prisma ORM`
   - `JWT Authentication`

3. **Data Layer:**
   - `PostgreSQL`
   - `Relational Database`

---

### Step 8: Add Protocol/Format Labels

**On the arrows, add:**
- `HTTP/HTTPS`
- `REST API`
- `JSON`
- `SQL`

---

### Step 9: Format the Diagram

1. **Select all:**
   - Press Ctrl+A

2. **Apply consistent formatting:**
   - Layers: Large rectangles, colored backgrounds
   - Components: Small rectangles, white background
   - Arrows: Colored, labeled
   - Text: Clear and readable

3. **Add shadows** to layers for depth

---

### Step 10: Add Title

1. **Add text box at top:**
   - `HuruDrive - System Architecture Diagram`
   - Format: Bold, 20pt, center

---

### Step 11: Add Legend

1. **Create legend box:**
   ```
   Legend:
   ────────────────
   Solid Arrow = Request/Command
   Dashed Arrow = Response/Data
   ```

---

### Step 12: Final Adjustments

1. **Review:**
   - All three layers present
   - Components in each layer
   - Communication flows shown
   - Labels clear

2. **Align everything:**
   - Use grid
   - Align components
   - Straight arrows

---

### Step 13: Save and Export

1. **Save:** `HuruDrive_System_Architecture.drawio`
2. **Export:** PNG (200-300% zoom)

---

## 🎨 Visual Layout Reference

```
┌─────────────────────────────────────────────────────┐
│         PRESENTATION LAYER (React Frontend)         │
│  [Home] [Details] [Login] [Register] [Booking]      │
└──────────────────────┬──────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │
┌──────────────────────▼──────────────────────────────┐
│      APPLICATION LAYER (Node.js/Express)             │
│  [Auth API] [Vehicle API] [Booking API] [Payment API]│
│  [Business Logic & Validation Layer]                  │
└──────────────────────┬──────────────────────────────┘
                        │
                        │ Prisma ORM
                        │
┌──────────────────────▼──────────────────────────────┐
│         DATA LAYER (PostgreSQL Database)             │
│  [User] [Vehicle] [VehicleImage] [Booking] [Payment] │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Three layers created
- [ ] Presentation layer components added
- [ ] Application layer components added
- [ ] Data layer components added
- [ ] Communication flows drawn
- [ ] Technology labels added
- [ ] Protocol labels added
- [ ] Title added
- [ ] Legend added
- [ ] Formatting consistent
- [ ] Diagram saved
- [ ] High-quality export created

---

**Next: Data Flow Diagram Guide** 📊
