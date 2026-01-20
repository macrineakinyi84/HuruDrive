# Quick Fix: Port 3000 Already in Use

## Problem
Error: `EADDRINUSE: address already in use :::3000`

This means another process is already using port 3000 (likely a previous instance of the server).

## Solution 1: Use the Auto-Fix Script (Recommended)

The VS Code task now automatically kills the process on port 3000 before starting. Just run the task again!

## Solution 2: Manual Fix

### Option A: Run the Kill Script
```powershell
.\kill-port-3000.ps1
```

Then run:
```bash
npm run dev
```

### Option B: Kill Process Manually

1. **Find the process:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
   ```

2. **Kill it:**
   ```powershell
   Stop-Process -Id <PID> -Force
   ```
   (Replace `<PID>` with the process ID from step 1)

### Option C: Change Port (Alternative)

If you want to use a different port:

1. Edit `.env` file:
   ```env
   PORT=3001
   ```

2. Update `vite.config.mjs` proxy to use port 3001:
   ```javascript
   '/api': {
     target: 'http://localhost:3001',
     ...
   }
   ```

## Solution 3: Restart Everything

1. Close all VS Code terminals
2. Close any running Node processes
3. Run `npm run dev` again

## Prevention

The VS Code task now automatically handles this, but if you still get the error:
- Make sure to stop the previous `npm run dev` before starting a new one
- Use `Ctrl+C` in the terminal to stop the server properly
