# PostgreSQL Setup Guide for HuruDrive

## Option 1: Quick Setup with SQLite (Recommended for Testing)

SQLite requires no installation and works immediately. I'll switch your system to use SQLite so you can start testing right away.

**Advantages:**
- ✅ No installation needed
- ✅ Works immediately
- ✅ Perfect for development/testing
- ✅ Single file database

**To switch to SQLite, I'll:**
1. Update Prisma schema to use SQLite
2. Run migrations
3. Seed sample data
4. You can start using the system immediately

## Option 2: Install PostgreSQL (For Production)

If you want to use PostgreSQL (better for production), follow these steps:

### Windows Installation Steps:

1. **Download PostgreSQL**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer (recommended: PostgreSQL 15 or 16)
   - Or use: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Run the Installer**
   - Run the downloaded `.exe` file
   - During installation:
     - **Port**: Keep default `5432`
     - **Superuser password**: Set to `postgres` (or remember your password)
     - **Locale**: Default is fine

3. **Verify Installation**
   - Open Command Prompt or PowerShell
   - Navigate to PostgreSQL bin directory (usually `C:\Program Files\PostgreSQL\15\bin`)
   - Or add PostgreSQL to your PATH

4. **Create Database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE hurudrive_dev;
   
   # Exit
   \q
   ```

5. **Update .env File**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hurudrive_dev?schema=public&sslmode=disable"
   ```
   Replace `YOUR_PASSWORD` with the password you set during installation.

6. **Run Migrations**
   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   ```

### Alternative: Use Docker (If You Have Docker)

If you have Docker installed:

```bash
docker run --name hurudrive-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=hurudrive_dev -p 5432:5432 -d postgres:15
```

Then update your `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hurudrive_dev?schema=public&sslmode=disable"
```

## Recommendation

For **quick testing and development**: Use SQLite (Option 1)
For **production deployment**: Use PostgreSQL (Option 2)

Let me know which option you prefer!
