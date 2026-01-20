# 🔄 How to Restart Your Servers

## Quick Fix

Your servers stopped running. Here's how to restart them:

### Step 1: Open a New Terminal

Open PowerShell or Command Prompt in your project directory:
```
C:\Users\Awuor\HuruDrive
```

### Step 2: Start the Servers

Run this command:
```bash
npm run dev
```

### Step 3: Wait for Both to Start

You should see output like:
```
[0] API listening on http://localhost:3000
[1] VITE v6.x.x  ready in xxx ms
[1] ➜  Local:   http://localhost:5173/
```

### Step 4: Open Browser

Once you see both servers running, open:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000/api/health

## If It Still Doesn't Work

### Check for Port Conflicts

If ports 3000 or 5173 are in use:

1. **Find what's using the port:**
   ```powershell
   netstat -ano | findstr :5173
   netstat -ano | findstr :3000
   ```

2. **Kill the process** (replace PID with actual process ID):
   ```powershell
   taskkill /PID <PID> /F
   ```

### Alternative: Start Servers Separately

**Terminal 1 (Backend):**
```bash
npm run dev:server
```

**Terminal 2 (Frontend - Open NEW terminal):**
```bash
npm run dev:client
```

## Verify Servers Are Running

**Backend:**
```powershell
curl http://localhost:3000/api/health
```
Should return: `{"status":"ok"}`

**Frontend:**
Open browser: http://localhost:5173

---

**After restarting, the images should work!** 🚀
