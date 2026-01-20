# 📊 Step-by-Step Guide: Creating Data Flow Diagram (DFD)

## Overview

This guide will help you create Data Flow Diagrams (DFD) for HuruDrive showing how data flows through the system.

---

## 🎯 What We're Creating

Three levels of DFD:
- **Level 0 (Context Diagram):** System and external entities
- **Level 1 DFD:** Major processes
- **Level 2 DFD:** Detailed processes

---

## 📋 Step-by-Step Instructions

### Step 1: Open Draw.io

1. **Go to:** https://app.diagrams.net
2. **Create New Diagram**
3. **Select "Blank Diagram"**

---

### Step 2: Create Level 0 (Context Diagram)

#### Add External Entities:

1. **Draw rectangles** for external entities:
   - `Customer` (left side)
   - `Administrator` (right side)

2. **Add System:**
   - Draw a large circle in center
   - Label: `HuruDrive System`

3. **Draw Data Flows:**
   - From Customer to System: `Booking Request`, `Payment Request`
   - From System to Customer: `Booking Confirmation`, `Payment Confirmation`
   - From Administrator to System: `Vehicle Management`, `Booking Management`
   - From System to Administrator: `Reports`, `Booking Updates`

4. **Format:**
   - Entities: Rectangles with rounded corners
   - System: Large circle
   - Flows: Arrows with labels

---

### Step 3: Create Level 1 DFD

#### Add Processes:

1. **Draw circles** for processes:
   - `1.0 Search Vehicles`
   - `2.0 Process Booking`
   - `3.0 Process Payment`
   - `4.0 Manage Vehicles` (Admin)

2. **Add Data Stores:**
   - Draw open rectangles (two parallel lines):
     - `D1: Vehicles`
     - `D2: Bookings`
     - `D3: Users`
     - `D4: Payments`

3. **Draw Data Flows:**

   **From Customer:**
   - Customer → 1.0: `Search Request`
   - Customer → 2.0: `Booking Request`
   - Customer → 3.0: `Payment Request`

   **Between Processes:**
   - 1.0 → D1: `Query Vehicles`
   - D1 → 1.0: `Vehicle Data`
   - 1.0 → Customer: `Search Results`
   
   - 2.0 → D2: `Create Booking`
   - D2 → 2.0: `Booking Data`
   - 2.0 → 3.0: `Payment Request`
   
   - 3.0 → D4: `Create Payment`
   - D4 → 3.0: `Payment Data`
   - 3.0 → D2: `Update Booking`
   - 3.0 → Customer: `Payment Confirmation`

4. **Format:**
   - Processes: Circles with numbers
   - Data Stores: Open rectangles
   - Flows: Arrows with labels

---

### Step 4: Create Level 2 DFD (Detailed Process)

**Expand Process 2.0 (Process Booking):**

1. **Sub-processes:**
   - `2.1 Validate Request`
   - `2.2 Check Availability`
   - `2.3 Create Booking`
   - `2.4 Calculate Price`

2. **Data Flows:**
   - Booking Request → 2.1
   - 2.1 → Valid Request → 2.2
   - 2.2 → D1: Check Vehicle
   - D1 → 2.2: Vehicle Status
   - 2.2 → Available → 2.4
   - 2.4 → Price → 2.3
   - 2.3 → D2: Save Booking
   - 2.3 → Booking Confirmation

3. **Error Flows:**
   - 2.1 → Invalid → Error Message
   - 2.2 → Not Available → Error Message

---

### Step 5: Add Data Store Symbols

**Data Store Notation:**
- Open rectangle (two parallel lines)
- Label: `D1: Vehicles`, `D2: Bookings`, etc.
- Position: Usually on sides or bottom

---

### Step 6: Format the Diagram

1. **Processes (Circles):**
   - Fill: Light yellow
   - Border: Black, 2px
   - Number: Top (1.0, 2.0, etc.)
   - Name: Center

2. **External Entities (Rectangles):**
   - Fill: Light blue
   - Border: Black, 2px
   - Rounded corners

3. **Data Stores (Open Rectangles):**
   - Fill: Light green
   - Border: Black, 2px
   - Label: D1, D2, etc.

4. **Data Flows (Arrows):**
   - Color: Black
   - Width: 2px
   - Labels: Clear and descriptive

---

### Step 7: Add Title

1. **Add text box:**
   - `HuruDrive - Data Flow Diagram (Level 1)`
   - Format: Bold, 18pt

---

### Step 8: Add Data Dictionary (Optional)

**Create a table listing all data flows:**

```
Data Flow Dictionary:
─────────────────────
Search Request: Vehicle criteria (location, category, price)
Vehicle Data: Vehicle details (id, title, price, images)
Booking Request: User ID, Vehicle ID, dates, locations
Payment Request: Booking ID, amount, payment method
```

---

### Step 9: Save and Export

1. **Save:** `HuruDrive_DFD_Level1.drawio`
2. **Export:** PNG (200-300% zoom)

---

## 🎨 Visual Layout Reference

### Level 0 (Context):
```
[Customer] ──Booking Request──> [HuruDrive System] <──Vehicle Management── [Admin]
            <──Confirmation──                              <──Reports──
```

### Level 1:
```
Customer ──Search Request──> [1.0 Search] ──Query──> D1:Vehicles
                              └──Results──> Customer

Customer ──Booking Request──> [2.0 Process Booking] ──Create──> D2:Bookings
                                                      └──Request──> [3.0 Payment]
                                                                     └──Create──> D4:Payments
```

---

## ✅ Checklist

- [ ] Level 0 diagram created
- [ ] External entities identified
- [ ] System boundary shown
- [ ] Level 1 processes created
- [ ] Data stores identified
- [ ] Data flows drawn and labeled
- [ ] Level 2 detail (optional) created
- [ ] Title added
- [ ] Formatting consistent
- [ ] Diagram saved
- [ ] High-quality export created

---

## 💡 Pro Tips

1. **Use standard DFD symbols:**
   - Circle = Process
   - Rectangle = External Entity
   - Open Rectangle = Data Store
   - Arrow = Data Flow

2. **Number processes:** 1.0, 2.0, 3.0, etc.

3. **Label all flows:** Every arrow needs a label

4. **Show data stores:** Where data is stored

5. **Keep it simple:** Don't overcrowd

---

**Next: Sequence Diagram Guide** 🔄
