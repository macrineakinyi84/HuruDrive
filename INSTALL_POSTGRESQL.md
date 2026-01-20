# PostgreSQL Installation Guide for Windows

## Quick Installation Steps

### Method 1: Official PostgreSQL Installer (Recommended)

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Or direct link: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Download **PostgreSQL 15** or **16** (latest stable)

2. **Run the Installer**
   - Double-click the downloaded `.exe` file
   - Follow the installation wizard:
     - **Installation Directory**: Keep default (`C:\Program Files\PostgreSQL\15`)
     - **Data Directory**: Keep default
     - **Password**: Set to `postgres` (or remember your password)
     - **Port**: Keep default `5432`
     - **Advanced Options**: Keep defaults
     - **Pre Installation Summary**: Click Next
     - **Ready to Install**: Click Next
     - Wait for installation to complete

3. **Complete Installation**
   - Uncheck "Launch Stack Builder" (not needed)
   - Click Finish

4. **Verify Installation**
   - Open PowerShell
   - Run: `psql --version`
   - If you see a version number, PostgreSQL is installed!

### Method 2: Using Chocolatey (If You Have Chocolatey)

```powershell
choco install postgresql15
```

### Method 3: Using Docker (If You Have Docker)

```bash
docker run --name hurudrive-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=hurudrive_dev `
  -p 5432:5432 `
  -d postgres:15
```

## After Installation

### 1. Start PostgreSQL Service

If the service isn't running automatically:

```powershell
# Check service status
Get-Service *postgresql*

# Start the service
Start-Service postgresql-x64-15  # Adjust version number if different
```

### 2. Create the Database

Open PowerShell and run:

```powershell
# Set password (if prompted)
$env:PGPASSWORD = "postgres"

# Create database
psql -U postgres -h localhost -c "CREATE DATABASE hurudrive_dev;"
```

Or use pgAdmin (GUI tool installed with PostgreSQL):
1. Open pgAdmin 4
2. Connect to server (password: `postgres`)
3. Right-click "Databases" → Create → Database
4. Name: `hurudrive_dev`
5. Click Save

### 3. Update .env File

Make sure your `.env` file has:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hurudrive_dev?schema=public&sslmode=disable"
```

**Important**: If you set a different password during installation, replace `postgres` in the URL with your password.

### 4. Run Setup Script

I've created a PowerShell script to help you:

```powershell
.\setup-postgresql.ps1
```

This will:
- Check if PostgreSQL is installed
- Verify connection
- Create the database if needed
- Guide you through next steps

### 5. Run Migrations and Seed

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev

# Seed sample data
npm run prisma:seed
```

### 6. Start Your Application

```bash
npm run dev
```

## Troubleshooting

### "psql is not recognized"
- PostgreSQL is not in your PATH
- Add to PATH: `C:\Program Files\PostgreSQL\15\bin`
- Or use full path: `"C:\Program Files\PostgreSQL\15\bin\psql.exe"`

### "Cannot connect to server"
- Check if PostgreSQL service is running:
  ```powershell
  Get-Service *postgresql*
  Start-Service postgresql-x64-15
  ```

### "Password authentication failed"
- Check your `.env` file has the correct password
- Default password is `postgres` if you used it during installation

### "Database does not exist"
- Create it manually:
  ```powershell
  psql -U postgres -h localhost -c "CREATE DATABASE hurudrive_dev;"
  ```

## Alternative: Use SQLite for Quick Testing

If you want to test immediately without installing PostgreSQL, I can switch your system to SQLite. Just let me know!

SQLite advantages:
- ✅ No installation needed
- ✅ Works immediately
- ✅ Perfect for development
- ⚠️ Not recommended for production

## Need Help?

Run the setup script:
```powershell
.\setup-postgresql.ps1
```

Or check the connection:
```bash
node test-connection.js
```
