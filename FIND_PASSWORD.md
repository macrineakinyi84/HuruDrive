# How to Find or Reset PostgreSQL Password

The password "superadmin" is not working. Here's how to find or reset it:

## Method 1: Check pgAdmin 4 (Easiest)

1. **Open pgAdmin 4** (installed with PostgreSQL)
2. Look at the **Servers** section in the left panel
3. Expand **PostgreSQL 18** or your server
4. If it's already connected, the password is saved
5. To see it: Right-click server → Properties → Connection tab (password may be masked)

## Method 2: Reset Password via pgAdmin

1. Open **pgAdmin 4**
2. Connect to your server (if not already connected)
3. Right-click on **PostgreSQL 18** → **Properties**
4. Go to **Connection** tab
5. Enter the password you remember, or try to reset it

## Method 3: Reset Password via Command Line

If you have Windows authentication or can access the server:

1. Open PowerShell as Administrator
2. Navigate to PostgreSQL bin:
   ```powershell
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```
3. Try connecting with Windows authentication:
   ```powershell
   .\psql.exe -U postgres -d postgres
   ```
4. If that works, reset the password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'superadmin';
   ```

## Method 4: Check Installation Notes

- Check if you wrote down the password during installation
- Look for any installation notes or documentation

## Method 5: Use pgAdmin to Create Database

Instead of command line, you can use pgAdmin:

1. Open **pgAdmin 4**
2. Connect to PostgreSQL 18 server
3. Right-click **Databases** → **Create** → **Database**
4. Name: `hurudrive_dev`
5. Click **Save**

Then update your `.env` file with the correct password.

## What to Do Next

Once you have the correct password:

1. Update `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hurudrive_dev?schema=public&sslmode=disable"
   ```

2. Let me know the password and I'll complete the setup, OR

3. Run these commands yourself:
   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   npm run dev
   ```
