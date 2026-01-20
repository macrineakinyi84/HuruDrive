# Setup Database Using pgAdmin 4 (No Password Needed)

If you can't remember the password, use pgAdmin 4 to set everything up:

## Step 1: Open pgAdmin 4

1. Search for "pgAdmin 4" in Windows Start menu
2. Open it (it may prompt for a master password - this is different from PostgreSQL password)

## Step 2: Connect to Server

1. In the left panel, you should see **Servers**
2. Click on **PostgreSQL 18** (or your server name)
3. If it asks for a password, try:
   - `superadmin`
   - `postgres`
   - `admin`
   - Or the password you set during installation

## Step 3: Create Database

1. Right-click on **Databases** (under your server)
2. Select **Create** → **Database...**
3. In the **General** tab:
   - **Database name**: `hurudrive_dev`
4. Click **Save**

## Step 4: Update .env File

Once the database is created, update your `.env` file with the correct password:

```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/hurudrive_dev?schema=public&sslmode=disable"
PORT=3000
JWT_SECRET="your-secret-key-change-in-production"
```

## Step 5: Run Setup Commands

After database is created, run:

```bash
# Generate Prisma client
npx prisma generate

# Create tables
npx prisma migrate dev

# Add sample data
npm run prisma:seed

# Start the app
npm run dev
```

## Alternative: Reset Password in pgAdmin

If you're connected in pgAdmin:

1. Right-click on **PostgreSQL 18** server → **Properties**
2. Go to **Connection** tab
3. Note the password (or change it)
4. Or use Query Tool to reset:
   - Right-click server → **Query Tool**
   - Run: `ALTER USER postgres WITH PASSWORD 'superadmin';`
   - Click Execute (▶)
