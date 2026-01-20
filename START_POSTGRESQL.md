# How to Start PostgreSQL 18

Your `.env` file has been updated with password: **superadmin**

## Start PostgreSQL Service

### Method 1: Using Services (Easiest)

1. Press `Windows + R`
2. Type: `services.msc` and press Enter
3. Look for a service named:
   - `postgresql-x64-18`
   - `PostgreSQL 18`
   - Or any service with "PostgreSQL" in the name
4. Right-click on it → **Start**
5. Wait a few seconds for it to start

### Method 2: Using pgAdmin 4

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. It may automatically start the PostgreSQL service
3. If prompted, enter password: `superadmin`

### Method 3: Using Command Line

Open PowerShell as Administrator and run:

```powershell
# Find the service
Get-Service | Where-Object { $_.DisplayName -like "*PostgreSQL*" }

# Start it (replace SERVICE_NAME with actual name)
Start-Service SERVICE_NAME
```

### Method 4: Manual Start from Installation

1. Go to: `C:\Program Files\PostgreSQL\18\bin`
2. Run: `pg_ctl.exe -D "C:\Program Files\PostgreSQL\18\data" start`

## After Starting PostgreSQL

Once PostgreSQL is running, I'll help you:

1. ✅ Create the database (already configured in .env)
2. ✅ Run Prisma migrations
3. ✅ Seed sample data
4. ✅ Start your application

**Just let me know when PostgreSQL is running!**

Or run this command to test:
```bash
node test-connection.js
```
