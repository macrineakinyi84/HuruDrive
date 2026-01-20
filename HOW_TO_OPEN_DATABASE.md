# 🗄️ How to Open Your Database

## Method 1: Prisma Studio (Easiest - Recommended)

Prisma Studio is a visual database browser that's already set up in your project.

### Steps:

1. **Open a terminal** in your project directory:
   ```bash
   cd C:\Users\Awuor\HuruDrive
   ```

2. **Run Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

3. **Wait for it to open:**
   - It will automatically open in your browser
   - URL: `http://localhost:5555`
   - If it doesn't open automatically, go to that URL manually

4. **What you'll see:**
   - List of all your database tables (User, Vehicle, VehicleImage, Booking, Payment)
   - Click on any table to view/edit data
   - Add, edit, or delete records
   - Search and filter data

### Using Prisma Studio:

- **View Data:** Click on a table name (e.g., "Vehicle")
- **Add Record:** Click the "+ Add record" button
- **Edit Record:** Click on any row to edit
- **Delete Record:** Click on a row, then click delete
- **Search:** Use the search box at the top

---

## Method 2: pgAdmin 4 (PostgreSQL GUI)

If you have pgAdmin 4 installed:

1. **Open pgAdmin 4** from Start Menu
2. **Connect to server:**
   - Server name: `PostgreSQL 18` (or your server name)
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: `superadmin`
3. **Navigate:**
   - Expand: Servers → PostgreSQL 18 → Databases → hurudrive_dev → Schemas → public → Tables
4. **View data:**
   - Right-click any table → View/Edit Data → All Rows

---

## Method 3: Command Line (psql)

For command-line access:

1. **Open PowerShell**
2. **Navigate to PostgreSQL bin:**
   ```powershell
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```
3. **Connect:**
   ```powershell
   $env:PGPASSWORD = "superadmin"
   .\psql.exe -U postgres -d hurudrive_dev
   ```
4. **Use SQL commands:**
   ```sql
   -- List all tables
   \dt
   
   -- View vehicles
   SELECT * FROM "Vehicle";
   
   -- View users
   SELECT * FROM "User";
   
   -- Exit
   \q
   ```

---

## Method 4: VS Code Extension

If you use VS Code:

1. **Install extension:** "PostgreSQL" or "Database Client"
2. **Connect** using:
   - Host: `localhost`
   - Port: `5432`
   - Database: `hurudrive_dev`
   - User: `postgres`
   - Password: `superadmin`

---

## Quick Reference

### Database Connection Details:
- **Host:** localhost
- **Port:** 5432
- **Database:** hurudrive_dev
- **Username:** postgres
- **Password:** superadmin

### Your Tables:
- `User` - User accounts
- `Vehicle` - Car listings
- `VehicleImage` - Vehicle photos
- `Booking` - Rental bookings
- `Payment` - Payment records

---

## 🎯 Recommended: Use Prisma Studio

**Just run:**
```bash
npm run prisma:studio
```

**It's the easiest way to view and edit your database!** 🚀
