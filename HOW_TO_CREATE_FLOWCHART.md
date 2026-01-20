# 📊 Step-by-Step Guide: Creating a Flowchart in Draw.io

## Overview

This guide will help you create the **Main Booking Flow** flowchart for the HuruDrive project using Draw.io (diagrams.net).

---

## 🎯 What We're Creating

A flowchart showing the complete booking process from browsing vehicles to confirming a booking.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Draw.io

1. **Open your web browser**
2. **Go to:** https://app.diagrams.net
3. **Choose where to save:**
   - Select "Device" to save locally
   - Or choose Google Drive/OneDrive if you prefer cloud storage
4. **Click "Create New Diagram"**

---

### Step 2: Select Template

1. **In the template selection:**
   - Search for "Flowchart" or "Process"
   - OR select "Blank Diagram"
   - Click "Create"

---

### Step 3: Set Up Your Canvas

1. **On the right side panel, you'll see shapes:**
   - Look for "Flowchart" shapes section
   - You'll need these shapes:
     - **Terminator** (rounded rectangle) - for Start/End
     - **Process** (rectangle) - for actions
     - **Decision** (diamond) - for yes/no questions
     - **Arrow** - for connections

2. **If you don't see shapes:**
   - Click "More Shapes" at the bottom
   - Check "Flowchart"
   - Click "Apply"

---

### Step 4: Create the Start Node

1. **From the Flowchart shapes, drag a "Terminator" shape** onto the canvas
2. **Double-click on it** to add text
3. **Type:** `START`
4. **Format it:**
   - Make it bold (Ctrl+B)
   - Center align
   - Increase font size to 14pt

---

### Step 5: Add "Browse Vehicles" Process

1. **Drag a "Process" rectangle** below the START node
2. **Double-click and type:** `Browse Vehicles`
3. **Position it** directly below START
4. **Connect them:**
   - Hover over START node
   - Click the arrow that appears
   - Drag to "Browse Vehicles" node
   - An arrow will connect them

---

### Step 6: Add "Select Vehicle" Process

1. **Drag another "Process" rectangle** below "Browse Vehicles"
2. **Type:** `Select Vehicle`
3. **Connect "Browse Vehicles" to "Select Vehicle"** using the arrow

---

### Step 7: Add Decision Node - "User Logged In?"

1. **Drag a "Decision" diamond shape** below "Select Vehicle"
2. **Type:** `User Logged In?`
3. **Connect "Select Vehicle" to this decision node**

---

### Step 8: Add "Login/Register" Process

1. **From the decision node, you'll create two paths:**
   - **NO path (left side):**
     - Drag a "Process" rectangle to the left
     - Type: `Login/Register`
     - Connect from decision node (left side)
     - Add label "NO" to the arrow
   
2. **Connect "Login/Register" back to "Select Vehicle":**
   - Draw arrow from "Login/Register" back up
   - This creates a loop

---

### Step 9: Add "Enter Dates" Process

1. **From the decision node YES path (right side):**
   - Drag a "Process" rectangle to the right
   - Type: `Enter Dates`
   - Connect from decision node (right side)
   - Add label "YES" to the arrow

---

### Step 10: Add "Calculate Price" Process

1. **Drag a "Process" rectangle** below "Enter Dates"
2. **Type:** `Calculate Price`
3. **Connect "Enter Dates" to "Calculate Price"**

---

### Step 11: Add "Make Payment" Process

1. **Drag a "Process" rectangle** below "Calculate Price"
2. **Type:** `Make Payment`
3. **Connect "Calculate Price" to "Make Payment"**

---

### Step 12: Add Decision Node - "Payment Successful?"

1. **Drag a "Decision" diamond** below "Make Payment"
2. **Type:** `Payment Successful?`
3. **Connect "Make Payment" to this decision**

---

### Step 13: Add Payment Failure Path

1. **From "Payment Successful?" decision:**
   - **NO path (left side):**
     - Drag a "Process" rectangle
     - Type: `Retry`
     - Connect from decision (left side)
     - Add label "NO"
   
2. **Connect "Retry" back to "Make Payment":**
   - Draw arrow from "Retry" back up to "Make Payment"
   - This creates a retry loop

---

### Step 14: Add "Confirm Booking" Process

1. **From "Payment Successful?" decision:**
   - **YES path (right side):**
     - Drag a "Process" rectangle
     - Type: `Confirm Booking`
     - Connect from decision (right side)
     - Add label "YES"

---

### Step 15: Add End Node

1. **Drag a "Terminator" shape** below "Confirm Booking"
2. **Type:** `END`
3. **Connect "Confirm Booking" to "END"**

---

### Step 16: Format Your Flowchart

1. **Select all shapes:**
   - Click and drag to select all
   - Or press Ctrl+A

2. **Format shapes:**
   - **Fill Color:** Light blue or white
   - **Border:** Black, 2px
   - **Text:** Black, 12-14pt, Arial or Calibri
   - **Alignment:** Center

3. **Format decision diamonds:**
   - **Fill Color:** Light yellow
   - **Text:** Bold

4. **Format terminators (Start/End):**
   - **Fill Color:** Light green
   - **Text:** Bold, larger font

5. **Format arrows:**
   - **Color:** Black or dark gray
   - **Width:** 2px
   - **Arrowheads:** Make sure they point correctly

---

### Step 17: Add Labels to Decision Arrows

1. **Click on each arrow** coming from decision nodes
2. **Add labels:**
   - Arrow from "User Logged In?" → "Login/Register": Label "NO"
   - Arrow from "User Logged In?" → "Enter Dates": Label "YES"
   - Arrow from "Payment Successful?" → "Retry": Label "NO"
   - Arrow from "Payment Successful?" → "Confirm Booking": Label "YES"

**To add labels:**
- Double-click on the arrow
- Type the label text
- Position it appropriately

---

### Step 18: Align and Organize

1. **Select all shapes:**
   - Press Ctrl+A

2. **Use alignment tools:**
   - **Arrange → Align → Center** (for horizontal alignment)
   - **Arrange → Distribute → Vertically** (for even spacing)

3. **Adjust spacing:**
   - Make sure there's enough space between nodes
   - Keep the flowchart readable

---

### Step 19: Add Title (Optional)

1. **Click on the canvas** (empty area)
2. **Add a text box:**
   - Right-click → Insert → Text
   - Or use the Text tool (T icon)
3. **Type:** `HuruDrive - Main Booking Flow`
4. **Format:**
   - Bold, 18-20pt
   - Center align
   - Position at the top

---

### Step 20: Save Your Diagram

1. **Click "File" → "Save As"**
2. **Choose format:**
   - **For editing later:** Save as `.drawio` or `.xml`
   - **For documentation:** Save as `.png` (high resolution) or `.pdf`
3. **Name it:** `HuruDrive_Booking_Flowchart`
4. **Click "Save"**

---

### Step 21: Export for Documentation

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
                    [START]
                       │
                       ▼
              [Browse Vehicles]
                       │
                       ▼
              [Select Vehicle]
                       │
                       ▼
            [User Logged In?]
              ╱           ╲
            NO             YES
              ╲           ╱
        [Login/Register]  │
              │           │
              └───────────┘
                       │
                       ▼
              [Enter Dates]
                       │
                       ▼
            [Calculate Price]
                       │
                       ▼
            [Make Payment]
                       │
                       ▼
        [Payment Successful?]
              ╱           ╲
            NO             YES
              ╲           ╱
           [Retry]        │
              │           │
              └───────────┘
                       │
                       ▼
            [Confirm Booking]
                       │
                       ▼
                     [END]
```

---

## 💡 Pro Tips

1. **Use Consistent Colors:**
   - Start/End: Green
   - Processes: Light blue
   - Decisions: Yellow
   - Arrows: Black

2. **Keep It Simple:**
   - Don't overcrowd
   - Use clear, concise text
   - Maintain consistent spacing

3. **Test Readability:**
   - Zoom out to see the whole flowchart
   - Make sure arrows are clear
   - Ensure text is readable

4. **Use Grid/Snap:**
   - Enable grid (View → Grid)
   - Enable snap to grid
   - This helps alignment

5. **Group Related Steps:**
   - You can group sections if needed
   - Use different colors for different sections

---

## 🔧 Keyboard Shortcuts

- **Ctrl+A**: Select all
- **Ctrl+C**: Copy
- **Ctrl+V**: Paste
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Delete**: Delete selected
- **Arrow Keys**: Move selected shapes
- **Ctrl+D**: Duplicate

---

## ✅ Checklist

Before exporting, make sure:

- [ ] All shapes are properly connected
- [ ] All decision arrows have labels (YES/NO)
- [ ] Text is readable and properly formatted
- [ ] Flowchart follows logical flow
- [ ] Colors are consistent
- [ ] Title is added (optional)
- [ ] Diagram is saved
- [ ] High-quality export is created

---

## 📸 Example Colors

**Recommended Color Scheme:**

- **Start/End (Terminator):** 
  - Fill: #90EE90 (Light Green)
  - Border: #006400 (Dark Green)

- **Process (Rectangle):**
  - Fill: #E6F3FF (Light Blue)
  - Border: #0066CC (Blue)

- **Decision (Diamond):**
  - Fill: #FFFACD (Light Yellow)
  - Border: #FFA500 (Orange)

- **Arrows:**
  - Color: #000000 (Black)
  - Width: 2px

---

## 🎓 Final Result

Your flowchart should show:
1. Clear start point
2. Logical flow of steps
3. Decision points with YES/NO paths
4. Loops (retry, login)
5. Clear end point
6. Professional appearance
7. Readable text

---

## 📁 File Naming

Save your files as:
- **Editable:** `HuruDrive_Booking_Flowchart.drawio`
- **Image:** `HuruDrive_Booking_Flowchart.png`
- **PDF:** `HuruDrive_Booking_Flowchart.pdf`

---

## 🆘 Troubleshooting

**Problem: Shapes not connecting**
- Solution: Make sure you're using the connection arrows, not regular arrows

**Problem: Text too small**
- Solution: Select shape → Increase font size in format panel

**Problem: Can't align shapes**
- Solution: Use Arrange menu → Align options

**Problem: Export quality is poor**
- Solution: Increase zoom to 200-300% before exporting

---

## 🚀 Next Steps

After creating your flowchart:

1. **Review it** - Make sure it matches your documentation
2. **Export high-quality image** - For your report
3. **Save editable version** - In case you need to make changes
4. **Insert into documentation** - Add to Chapter 5

---

**Need help with other diagrams?** Let me know which one you'd like to create next! 🎨
