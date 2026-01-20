# 🔄 Step-by-Step Guide: Creating Sequence Diagram

## Overview

This guide will help you create Sequence Diagrams for HuruDrive showing the interaction between components over time.

---

## 🎯 What We're Creating

A Sequence Diagram showing:
- **Actors/Objects:** Customer, Frontend, Backend, Database
- **Messages:** API calls, responses, queries
- **Time flow:** Top to bottom
- **Lifelines:** Vertical lines for each component

---

## 📋 Step-by-Step Instructions

### Step 1: Open Draw.io

1. **Go to:** https://app.diagrams.net
2. **Create New Diagram**
3. **Select "Blank Diagram"**

---

### Step 2: Enable UML Shapes

1. **Click "More Shapes"**
2. **Check "UML"**
3. **Click "Apply"**

---

### Step 3: Create Lifelines (Actors/Objects)

**Draw vertical lines for each component:**

1. **Customer (Left):**
   - Draw vertical line
   - Add label at top: `:Customer`
   - Add rectangle at top (activation box)

2. **Frontend:**
   - Draw vertical line next to Customer
   - Label: `:Frontend`
   - Activation box at top

3. **Backend:**
   - Draw vertical line next to Frontend
   - Label: `:Backend`
   - Activation box at top

4. **Database:**
   - Draw vertical line next to Backend
   - Label: `:Database`
   - Activation box at top

5. **Format lifelines:**
   - Dashed vertical lines
   - Black color
   - Extend to bottom of diagram

---

### Step 4: Add Activation Boxes

**For each lifeline:**
1. **Draw thin rectangle** along the lifeline
2. **Shows when object is active**
3. **Start at first message, end at last response**

---

### Step 5: Draw Messages (Booking Creation Example)

#### Message 1: Search Request

1. **Draw horizontal arrow** from Customer to Frontend
2. **Label:** `Search Request`
3. **Style:** Solid arrow (synchronous call)
4. **Position:** Near top

#### Message 2: API Call

1. **Draw horizontal arrow** from Frontend to Backend
2. **Label:** `GET /api/vehicles`
3. **Style:** Solid arrow
4. **Position:** Below Message 1

#### Message 3: Database Query

1. **Draw horizontal arrow** from Backend to Database
2. **Label:** `SELECT * FROM Vehicle`
3. **Style:** Solid arrow
4. **Position:** Below Message 2

#### Message 4: Query Results

1. **Draw horizontal arrow** from Database to Backend
2. **Label:** `Vehicle Data`
3. **Style:** Dashed arrow (response)
4. **Position:** Below Message 3

#### Message 5: API Response

1. **Draw horizontal arrow** from Backend to Frontend
2. **Label:** `JSON Response`
3. **Style:** Dashed arrow
4. **Position:** Below Message 4

#### Message 6: Display Results

1. **Draw horizontal arrow** from Frontend to Customer
2. **Label:** `Display Results`
3. **Style:** Dashed arrow
4. **Position:** Below Message 5

---

### Step 6: Add Booking Creation Sequence

**Continue below the search sequence:**

#### Message 7: Select Vehicle

1. **Arrow:** Customer → Frontend
2. **Label:** `Select Vehicle`

#### Message 8: Create Booking Request

1. **Arrow:** Customer → Frontend
2. **Label:** `Create Booking`

#### Message 9: POST Booking API

1. **Arrow:** Frontend → Backend
2. **Label:** `POST /api/bookings`

#### Message 10: Check Availability

1. **Arrow:** Backend → Database
2. **Label:** `Check Vehicle Status`

#### Message 11: Vehicle Available

1. **Arrow:** Database → Backend
2. **Label:** `Status: AVAILABLE`
3. **Style:** Dashed

#### Message 12: Create Booking Record

1. **Arrow:** Backend → Database
2. **Label:** `INSERT INTO Booking`

#### Message 13: Booking Created

1. **Arrow:** Database → Backend
2. **Label:** `Booking ID`
3. **Style:** Dashed

#### Message 14: Send Notifications

1. **Self-call arrow** on Backend (loop back)
2. **Label:** `Send Email & SMS`

#### Message 15: Booking Confirmation

1. **Arrow:** Backend → Frontend
2. **Label:** `Booking Created`
3. **Style:** Dashed

#### Message 16: Show Confirmation

1. **Arrow:** Frontend → Customer
2. **Label:** `Booking Confirmed`
3. **Style:** Dashed

---

### Step 7: Format Messages

1. **Synchronous calls:**
   - Solid arrow with filled arrowhead
   - Horizontal line

2. **Responses:**
   - Dashed arrow
   - Horizontal line

3. **Self-calls:**
   - Loop back on same lifeline
   - Small rectangle on lifeline

4. **Labels:**
   - Above arrows (for calls)
   - Below arrows (for responses)

---

### Step 8: Add Activation Boxes

**Show when each component is active:**

1. **Draw thin rectangles** along lifelines
2. **Start** when component receives first message
3. **End** when component sends last response
4. **Format:** Light gray fill

---

### Step 9: Add Time Markers (Optional)

**Add timestamps or sequence numbers:**

1. **Add numbers** to messages: 1, 2, 3, etc.
2. **OR add timestamps:** t1, t2, t3, etc.
3. **Position:** Left side of diagram

---

### Step 10: Format the Diagram

1. **Lifelines:**
   - Dashed vertical lines
   - Extend full height
   - Black color

2. **Activation boxes:**
   - Thin rectangles
   - Light gray fill
   - Along lifelines

3. **Messages:**
   - Solid arrows for calls
   - Dashed arrows for responses
   - Clear labels

4. **Actors:**
   - Rectangles at top
   - Bold labels
   - Colored backgrounds

---

### Step 11: Add Title

1. **Add text box:**
   - `HuruDrive - Booking Creation Sequence Diagram`
   - Format: Bold, 18pt

---

### Step 12: Add Notes (Optional)

**Add explanatory notes:**

1. **Draw note box** (sticky note shape)
2. **Add text:**
   ```
   Note: Notifications are sent
   asynchronously after booking
   creation
   ```
3. **Connect to relevant message** with dashed line

---

### Step 13: Save and Export

1. **Save:** `HuruDrive_Sequence_Diagram.drawio`
2. **Export:** PNG (200-300% zoom)

---

## 🎨 Visual Layout Reference

```
:Customer    :Frontend     :Backend      :Database
    │            │             │              │
    │──Search───>│             │              │
    │            │──GET /api──>│              │
    │            │             │──SELECT───> │
    │            │             │<──Data────── │
    │            │<──JSON──────│              │
    │<──Display── │             │              │
    │            │             │              │
    │──Book─────>│             │              │
    │            │──POST──────>│              │
    │            │             │──Check─────> │
    │            │             │<──Available──│
    │            │             │──INSERT─────>│
    │            │             │<──Booking ID─│
    │            │             │──Notify─────>│
    │            │<──Success───│              │
    │<──Confirm──│             │              │
    │            │             │              │
```

---

## ✅ Checklist

- [ ] Lifelines created (Customer, Frontend, Backend, Database)
- [ ] Activation boxes added
- [ ] Messages drawn with arrows
- [ ] Synchronous calls (solid arrows)
- [ ] Responses (dashed arrows)
- [ ] Self-calls shown (if any)
- [ ] Labels on all messages
- [ ] Time flow clear (top to bottom)
- [ ] Title added
- [ ] Formatting consistent
- [ ] Diagram saved
- [ ] High-quality export created

---

## 💡 Pro Tips

1. **Time flows top to bottom:** Earlier messages at top
2. **Use solid arrows** for calls/requests
3. **Use dashed arrows** for responses
4. **Activation boxes** show when object is active
5. **Keep messages horizontal:** Easy to read
6. **Label clearly:** Every message needs a label

---

**Next: Wireframe Diagram Guide** 🎨
