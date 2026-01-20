# How to Start the Frontend Server

The frontend server needs to be started manually so you can see any errors.

## Step-by-Step Instructions

### Option 1: Start Both Servers (Recommended)

1. **Open a new PowerShell or Command Prompt window**
2. **Navigate to your project:**
   ```powershell
   cd C:\Users\Awuor\HuruDrive
   ```

3. **Start both servers:**
   ```bash
   npm run dev
   ```

4. **Wait for both to start:**
   - You should see output from both servers
   - Backend: "API listening on http://localhost:3000"
   - Frontend: "Local: http://localhost:5173/"

5. **Keep this terminal window open** (don't close it)

6. **Open your browser:** http://localhost:5173

### Option 2: Start Servers Separately (If Option 1 Fails)

**Terminal 1 - Backend:**
```powershell
cd C:\Users\Awuor\HuruDrive
npm run dev:server
```

**Terminal 2 - Frontend (Open a NEW terminal):**
```powershell
cd C:\Users\Awuor\HuruDrive
npm run dev:client
```

## What You Should See

### Backend Output:
```
API listening on http://localhost:3000
```

### Frontend Output:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## If You See Errors

### "Port 5173 already in use"
- Another process is using the port
- Kill it: `Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process`
- Or change port in `vite.config.js`

### "Cannot find module"
- Run: `npm install`

### Compilation errors
- Check the error message
- Usually a syntax error in a React component
- Fix the error and save the file (auto-reloads)

## Verify It's Working

1. **Backend:** Open http://localhost:3000/api/health
   - Should show: `{"status":"ok"}`

2. **Frontend:** Open http://localhost:5173
   - Should show your HuruDrive homepage

## Quick Test

Once both are running, you should see:
- ✅ Backend responding at http://localhost:3000/api/vehicles
- ✅ Frontend showing at http://localhost:5173
- ✅ All 10 vehicles displayed on the page

---

**Try starting it manually now and let me know what errors (if any) you see!**
