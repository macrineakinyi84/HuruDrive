# Simple Password Reset Guide

The password authentication is failing. Here's the easiest way to reset it:

## Method 1: Reset via pgAdmin (If You Can Access It)

If pgAdmin opens but asks for a password:

1. **Cancel the connection dialog**
2. Look for **Servers** in the left panel
3. If you see a server already listed, try:
   - Right-click → **Properties**
   - Check the **Connection** tab for saved password
   - Or try common passwords: `postgres`, `admin`, `password`

## Method 2: Reset via Command Line (Recommended)

### Step 1: Stop PostgreSQL Service

Open PowerShell as Administrator and run:

```powershell
Stop-Service postgresql-x64-18
```

### Step 2: Edit pg_hba.conf

1. Navigate to: `C:\Program Files\PostgreSQL\18\data\`
2. Open `pg_hba.conf` in Notepad (as Administrator)
3. Find these lines (around line 85-90):
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   host    all             all             ::1/128                 scram-sha-256
   ```
4. Change `scram-sha-256` to `trust`:
   ```
   host    all             all             127.0.0.1/32            trust
   host    all             all             ::1/128                 trust
   ```
5. Also find and change:
   ```
   local   all             postgres                                peer
   ```
   To:
   ```
   local   all             postgres                                trust
   ```
6. Save the file

### Step 3: Start PostgreSQL

```powershell
Start-Service postgresql-x64-18
```

### Step 4: Reset Password

```powershell
cd "C:\Program Files\PostgreSQL\18\bin"
.\psql.exe -U postgres -d postgres
```

Then in psql, run:
```sql
ALTER USER postgres WITH PASSWORD 'superadmin';
\q
```

### Step 5: Restore pg_hba.conf

1. Change `trust` back to `scram-sha-256` in pg_hba.conf
2. Save the file
3. Restart PostgreSQL:
   ```powershell
   Restart-Service postgresql-x64-18
   ```

### Step 6: Test Connection

```powershell
$env:PGPASSWORD = "superadmin"
.\psql.exe -U postgres -h localhost -c "SELECT version();"
```

## Method 3: Use the Reset Script

I've created a script that does all of this automatically:

```powershell
.\reset-postgres-password.ps1
```

This will:
1. Stop PostgreSQL
2. Modify pg_hba.conf
3. Reset password to 'superadmin' (or ask you for a new one)
4. Restore pg_hba.conf
5. Test the connection

## After Password Reset

Once the password is reset:

1. **Update .env file:**
   ```env
   DATABASE_URL="postgresql://postgres:superadmin@localhost:5432/hurudrive_dev?schema=public&sslmode=disable"
   ```

2. **Let me know and I'll complete the setup!**

Or run:
```bash
npx prisma migrate dev
npm run prisma:seed
npm run dev
```
