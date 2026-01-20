# Troubleshooting Connection Issues

## If Frontend (Port 5173) Won't Start

### Option 1: Start Frontend Separately

Open a **new terminal window** and run:

```bash
cd C:\Users\Awuor\HuruDrive
npm run dev:client
```

Wait for it to show:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Option 2: Check for Port Conflicts

If port 5173 is already in use:

1. Find what's using it:
   ```powershell
   netstat -ano | findstr :5173
   ```

2. Or change the port in `vite.config.js`:
   ```js
   server: {
     port: 5174,  // Change to different port
     // ... rest of config
   }
   ```

### Option 3: Check for Errors

Look at the terminal output for:
- Compilation errors
- Missing dependencies
- Port already in use errors

### Option 4: Manual Start (Both Servers)

**Terminal 1 (Backend):**
```bash
cd C:\Users\Awuor\HuruDrive
npm run dev:server
```

**Terminal 2 (Frontend):**
```bash
cd C:\Users\Awuor\HuruDrive
npm run dev:client
```

## If Backend (Port 3000) Won't Start

1. Check if PostgreSQL is running
2. Verify `.env` file has correct DATABASE_URL
3. Check for errors in terminal

## Quick Fix: Restart Everything

1. Stop all Node processes:
   ```powershell
   Get-Process node | Stop-Process -Force
   ```

2. Start fresh:
   ```bash
   npm run dev
   ```

3. Wait 15-20 seconds for both servers to start

## Verify Servers Are Running

**Backend:**
```powershell
curl http://localhost:3000/api/health
```
Should return: `{"status":"ok"}`

**Frontend:**
Open browser: http://localhost:5173

## Common Issues

### "Port already in use"
- Another process is using the port
- Kill the process or change the port

### "Cannot find module"
- Run: `npm install`

### "Database connection failed"
- Check PostgreSQL is running
- Verify `.env` file has correct password

### "Vite compilation errors"
- Check for syntax errors in React components
- Look at terminal for specific error messages
