# 📊 Step-by-Step Guide: Creating Use Case Diagram

## Overview

This guide will help you create the Use Case Diagram for HuruDrive using Draw.io (diagrams.net).

---

## 🎯 What We're Creating

A Use Case Diagram showing:
- **3 Actors:** Customer, Administrator, System
- **Customer Use Cases:** Register, Login, Search Vehicles, View Details, Create Booking, Make Payment, etc.
- **Admin Use Cases:** Manage Vehicles, View Bookings, Manage Users, etc.
- **System Use Cases:** Validate Payment, Send Notifications, etc.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Draw.io

1. **Open your web browser**
2. **Go to:** https://app.diagrams.net
3. **Choose where to save:** Select "Device"
4. **Click "Create New Diagram"**
5. **Select "Blank Diagram"**

---

### Step 2: Enable UML Shapes

1. **Click "More Shapes"** at the bottom left
2. **Check "UML"** (Unified Modeling Language)
3. **Click "Apply"**

---

### Step 3: Create System Boundary

1. **Drag a large rectangle** onto the canvas
2. **This represents the HuruDrive system**
3. **Add label:**
   - Double-click on the rectangle
   - Type: `HuruDrive System`
   - Make it bold, center align
4. **Format:**
   - Fill: Light gray or white
   - Border: Black, 2px
   - Make it large enough to contain all use cases

---

### Step 4: Create Actors

#### Actor 1: Customer

1. **From UML shapes, drag "Actor"** (stick figure) to the left of system boundary
2. **OR use a rectangle with "Actor" stereotype:**
   - Drag rectangle
   - Add text: `<<Actor>>` (on top)
   - Add text: `Customer` (below)
3. **Position:** Left side of system boundary

#### Actor 2: Administrator

1. **Drag another Actor** to the right of system boundary
2. **Add text:** `Administrator`
3. **Position:** Right side of system boundary

#### Actor 3: System

1. **Drag another Actor** below system boundary
2. **Add text:** `System`
3. **Position:** Bottom of system boundary

---

### Step 5: Create Customer Use Cases

**Inside the system boundary, add use cases for Customer:**

1. **Drag "Use Case" ellipse** (or use oval shape)
2. **Add use cases:**
   - `Register Account`
   - `Login`
   - `Search Vehicles`
   - `View Vehicle Details`
   - `Filter Vehicles`
   - `Create Booking`
   - `Make Payment`
   - `View Booking History`
   - `Update Profile`

3. **Arrange them:**
   - Group related use cases together
   - Left side of system boundary
   - Connect to Customer actor

---

### Step 6: Create Admin Use Cases

**Inside the system boundary, add use cases for Administrator:**

1. **Add use cases:**
   - `Manage Vehicles`
   - `Add Vehicle`
   - `Edit Vehicle`
   - `Delete Vehicle`
   - `Upload Vehicle Images`
   - `View All Bookings`
   - `Update Booking Status`
   - `Manage Users`
   - `View Reports`

2. **Arrange them:**
   - Right side of system boundary
   - Connect to Administrator actor

---

### Step 7: Create System Use Cases

**Inside the system boundary, add use cases for System:**

1. **Add use cases:**
   - `Validate Payment`
   - `Send Notifications`
   - `Generate Reports`

2. **Arrange them:**
   - Bottom of system boundary
   - Connect to System actor

---

### Step 8: Connect Actors to Use Cases

#### Connect Customer Actor:

1. **Use "Association" line** (solid line, no arrow)
2. **Draw lines from Customer to:**
   - Register Account
   - Login
   - Search Vehicles
   - View Vehicle Details
   - Filter Vehicles
   - Create Booking
   - Make Payment
   - View Booking History
   - Update Profile

#### Connect Administrator Actor:

1. **Draw lines from Administrator to:**
   - Manage Vehicles
   - Add Vehicle
   - Edit Vehicle
   - Delete Vehicle
   - Upload Vehicle Images
   - View All Bookings
   - Update Booking Status
   - Manage Users
   - View Reports

#### Connect System Actor:

1. **Draw lines from System to:**
   - Validate Payment
   - Send Notifications
   - Generate Reports

---

### Step 9: Add Relationships Between Use Cases

#### Include Relationship (<<include>>):

**Example:** "Create Booking" includes "Login"

1. **Draw dashed arrow** from "Create Booking" to "Login"
2. **Add label:** `<<include>>`
3. **Meaning:** Creating a booking requires login

**Other include relationships:**
- "Make Payment" includes "Create Booking"
- "View Booking History" includes "Login"
- "Update Profile" includes "Login"

#### Extend Relationship (<<extend>>):

**Example:** "Send Notifications" extends "Create Booking"

1. **Draw dashed arrow** from "Send Notifications" to "Create Booking"
2. **Add label:** `<<extend>>`
3. **Meaning:** Notifications are sent after booking creation

---

### Step 10: Format the Diagram

1. **Select all use cases:**
   - Press Ctrl+A

2. **Format use cases:**
   - **Shape:** Ellipse/Oval
   - **Fill:** Light yellow or white
   - **Border:** Black, 2px
   - **Text:** Center aligned, 10-12pt

3. **Format actors:**
   - **Fill:** Light blue
   - **Border:** Black, 2px
   - **Text:** Bold, 12-14pt

4. **Format system boundary:**
   - **Fill:** Light gray or white
   - **Border:** Black, 3px
   - **Text:** Bold, 16pt

5. **Format relationships:**
   - **Association:** Solid line, black
   - **Include/Extend:** Dashed line, black
   - **Arrows:** Simple arrowhead

---

### Step 11: Add Title

1. **Click on canvas** (empty area)
2. **Add text box:**
   - Type: `HuruDrive - Use Case Diagram`
   - Format: Bold, 18-20pt, center align
   - Position at top

---

### Step 12: Add Legend (Optional)

1. **Create a box** in corner
2. **Add:**
   ```
   Legend:
   ────────────────
   Solid Line = Association
   Dashed → = <<include>>
   Dashed → = <<extend>>
   ```

---

### Step 13: Final Adjustments

1. **Review:**
   - All actors present
   - All use cases listed
   - All relationships shown
   - System boundary clear

2. **Adjust spacing:**
   - No overlapping
   - Clear connections
   - Readable layout

---

### Step 14: Save and Export

1. **Save:** File → Save As → `HuruDrive_UseCase_Diagram.drawio`
2. **Export:** File → Export as → PNG (200-300% zoom)

---

## 🎨 Visual Layout Reference

```
                    [HuruDrive System]
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  Customer Use Cases:                            │
    │  (Register) (Login) (Search) (View) (Filter)   │
    │  (Create Booking) (Make Payment) (History)     │
    │                                                 │
    │  Admin Use Cases:                               │
    │  (Manage Vehicles) (Add) (Edit) (Delete)       │
    │  (View Bookings) (Manage Users) (Reports)       │
    │                                                 │
    │  System Use Cases:                              │
    │  (Validate Payment) (Send Notifications)         │
    │                                                 │
    └─────────────────────────────────────────────────┘
         │                    │                    │
    [Customer]        [Administrator]        [System]
```

---

## ✅ Checklist

- [ ] System boundary created
- [ ] 3 actors present (Customer, Admin, System)
- [ ] Customer use cases (9 use cases)
- [ ] Admin use cases (9 use cases)
- [ ] System use cases (3 use cases)
- [ ] All actors connected to use cases
- [ ] Include relationships shown
- [ ] Extend relationships shown
- [ ] Title added
- [ ] Formatting consistent
- [ ] Diagram saved
- [ ] High-quality export created

---

## 💡 Pro Tips

1. **Use Ellipses** for use cases (standard UML)
2. **Group related use cases** together
3. **Keep system boundary** large enough
4. **Use dashed lines** for include/extend
5. **Label all relationships** clearly

---

**Next: System Architecture Diagram Guide** 🏗️
