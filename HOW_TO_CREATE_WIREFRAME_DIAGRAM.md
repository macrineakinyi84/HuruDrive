# 🎨 Step-by-Step Guide: Creating Wireframe Diagrams

## Overview

This guide will help you create Wireframe Diagrams for HuruDrive showing the UI layout and structure.

---

## 🎯 What We're Creating

Wireframes for key pages:
- **Home Page:** Search and vehicle listing
- **Vehicle Details Page:** Vehicle information and booking
- **Login/Register Pages:** Authentication forms
- **Booking Page:** Booking form

---

## 📋 Step-by-Step Instructions

### Step 1: Open Draw.io or Figma

**Option 1: Draw.io (Free)**
1. **Go to:** https://app.diagrams.net
2. **Create New Diagram**
3. **Search for "Wireframe" template**

**Option 2: Figma (Recommended for Wireframes)**
1. **Go to:** https://www.figma.com
2. **Create new file**
3. **Use wireframe templates**

---

### Step 2: Create Home Page Wireframe

#### Add Header Section:

1. **Draw rectangle** at top (full width)
2. **Add elements:**
   - Logo (left): Small square with "🚗 HuruDrive"
   - Navigation (center): "Home | Cars | About | Contact"
   - Buttons (right): "Login | Register"
3. **Format:**
   - Height: ~60px
   - Background: White
   - Border: Bottom line

#### Add Hero Section:

1. **Draw large rectangle** below header
2. **Add:**
   - Title: "Find Your Best Car in Nairobi"
   - Subtitle: "Explore our wide range..."
   - Search form box with:
     - Location dropdown
     - Pickup date
     - Return date
     - Search button
3. **Format:**
   - Background: Light teal/gray
   - Centered content

#### Add Vehicle Grid:

1. **Draw grid of rectangles:**
   - 3 columns, multiple rows
   - Each rectangle = vehicle card

2. **Vehicle Card Structure:**
   ```
   ┌─────────────┐
   │  [Image]    │
   │             │
   ├─────────────┤
   │ Vehicle Name│
   │ Details     │
   │ Price       │
   │ [Button]    │
   └─────────────┘
   ```

3. **Add labels:**
   - Image placeholder
   - Vehicle title
   - Price
   - "View Details" button

#### Add Footer:

1. **Draw rectangle** at bottom
2. **Add:**
   - Logo and links
   - Contact info
   - Copyright

---

### Step 3: Create Vehicle Details Page Wireframe

#### Layout Structure:

1. **Draw two-column layout:**
   - Left: Image section
   - Right: Details section

#### Left Column (Image):

1. **Large image box:**
   - Main vehicle image
   - Label: "[Large Image]"

2. **Thumbnail grid:**
   - 4 small image boxes
   - Label: "[Thumb 1] [Thumb 2] [Thumb 3] [Thumb 4]"

#### Right Column (Details):

1. **Vehicle Title:**
   - Large text box
   - "Toyota Land Cruiser Prado"

2. **Specifications Grid:**
   - 2x2 grid of boxes:
     - "Seats: 7"
     - "Transmission: Automatic"
     - "Fuel: Diesel"
     - "Location: Nairobi"

3. **Price:**
   - Large text: "KSh 15,000/day"

4. **Buttons:**
   - "Book This Vehicle" (primary)
   - "Demonstrate Payment" (secondary)

---

### Step 4: Create Login Page Wireframe

#### Layout:

1. **Centered form box:**
   - White background
   - Rounded corners
   - Shadow effect

2. **Form Elements:**
   - Title: "Sign in to your account"
   - Email input field
   - Password input field
   - "Sign in" button
   - "Register here" link
   - "Back to Home" link

3. **Format:**
   - Clean, minimal design
   - Centered on page
   - Light background

---

### Step 5: Create Register Page Wireframe

**Similar to Login but with:**
- Title: "Create your account"
- Name input field
- Email input field
- Phone input field
- Password input field
- "Register" button
- "Sign in here" link

---

### Step 6: Create Booking/Payment Modal Wireframe

#### Modal Structure:

1. **Overlay:**
   - Dark semi-transparent background
   - Centered modal box

2. **Modal Content:**
   - Header: "Complete Payment" with X button
   - Booking summary box
   - Payment method selection (4 options)
   - Payment form fields
   - "Pay" button
   - Security message

---

### Step 7: Use Wireframe Symbols

**Common wireframe elements:**

1. **Text:**
   - Use simple rectangles with labels
   - Different sizes for headings

2. **Images:**
   - Rectangles with "X" or "[Image]"
   - Or use placeholder boxes

3. **Buttons:**
   - Rounded rectangles
   - Label inside

4. **Input Fields:**
   - Rectangles with label above
   - Or placeholder text

5. **Icons:**
   - Small squares or circles
   - Label what they represent

---

### Step 8: Add Annotations

**Add notes explaining elements:**

1. **Draw note boxes** (sticky notes)
2. **Add annotations:**
   - "Search filters vehicles by location"
   - "Vehicle cards show image, name, price"
   - "Payment modal appears on button click"
   - "Responsive design - adapts to mobile"

---

### Step 9: Format Wireframes

1. **Use simple shapes:**
   - Rectangles for containers
   - Lines for borders
   - No colors (or light gray)

2. **Keep it simple:**
   - Focus on layout, not design
   - Use placeholders
   - Show structure, not styling

3. **Add labels:**
   - Label all elements
   - Use clear text
   - Show hierarchy

---

### Step 10: Create Mobile Wireframes (Optional)

**Create mobile versions:**

1. **Narrower layout:**
   - Single column
   - Stacked elements
   - Hamburger menu

2. **Touch-friendly:**
   - Larger buttons
   - More spacing
   - Simplified navigation

---

### Step 11: Add Title

1. **Add text box:**
   - `HuruDrive - Home Page Wireframe`
   - Format: Bold, 16pt

---

### Step 12: Save and Export

1. **Save:** `HuruDrive_Wireframes.drawio` or `.fig`
2. **Export:** PNG (200-300% zoom)

---

## 🎨 Visual Layout Reference

### Home Page:
```
┌─────────────────────────────────────────┐
│ [Logo] HuruDrive  [Nav]  [Login][Reg]  │ Header
├─────────────────────────────────────────┤
│                                         │
│      Find Your Best Car in Nairobi      │ Hero
│   [Location▼] [Date] [Date] [Search]    │
│                                         │
├─────────────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐                │
│  │Img │  │Img │  │Img │                │ Vehicle
│  │Name│  │Name│  │Name│                │ Grid
│  │Price│  │Price│  │Price│                │
│  └────┘  └────┘  └────┘                │
├─────────────────────────────────────────┤
│  Contact | Links | Copyright            │ Footer
└─────────────────────────────────────────┘
```

### Vehicle Details:
```
┌─────────────────────────────────────────┐
│  [Logo]  [Nav]  [Login][Reg]            │
├──────────────┬──────────────────────────┤
│              │  Toyota Land Cruiser     │
│  [Large      │  Details                 │
│   Image]     │  KSh 15,000/day          │
│              │  [Book] [Payment]        │
│  [Thumb]     │                          │
│  [Thumb]     │                          │
└──────────────┴──────────────────────────┘
```

---

## ✅ Checklist

- [ ] Home page wireframe created
- [ ] Vehicle details page wireframe created
- [ ] Login page wireframe created
- [ ] Register page wireframe created
- [ ] Payment modal wireframe created
- [ ] All elements labeled
- [ ] Layout clear and readable
- [ ] Annotations added (optional)
- [ ] Mobile wireframes (optional)
- [ ] Title added
- [ ] Formatting consistent
- [ ] Diagram saved
- [ ] High-quality export created

---

## 💡 Pro Tips

1. **Keep it simple:** Wireframes show structure, not design
2. **Use placeholders:** "[Image]", "[Text]", etc.
3. **Show hierarchy:** Different sizes for headings
4. **Add annotations:** Explain complex interactions
5. **Think mobile:** Consider responsive design
6. **Use consistent symbols:** Same style throughout

---

## 🎨 Wireframe Tools Comparison

**Draw.io:**
- ✅ Free
- ✅ Good for basic wireframes
- ✅ Easy to use

**Figma:**
- ✅ Free tier available
- ✅ Professional wireframe tools
- ✅ Better for UI/UX design
- ✅ Collaboration features

**Balsamiq:**
- ✅ Specialized wireframing
- ⚠️ Paid (but has free trial)
- ✅ Sketchy style

---

**All diagram guides complete!** 🎉
