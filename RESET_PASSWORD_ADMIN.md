# Reset Password - Administrator Required

You need to run PowerShell **as Administrator** to stop the PostgreSQL service.

## Option 1: Run PowerShell as Administrator (Recommended)

1. **Close your current PowerShell window**
2. **Right-click** on PowerShell in Start Menu
3. Select **"Run as Administrator"**
4. Click **Yes** when prompted
5. Navigate to your project:
   ```powershell
   cd C:\Users\Awuor\HuruDrive
   ```
6. Then run:
   ```powershell
   Stop-Service postgresql-x64-18
   ```

## Option 2: Use Services Window (Easier)

1. Press `Windows + R`
2. Type: `services.msc` and press Enter
3. Find **postgresql-x64-18** in the list
4. Right-click on it → **Stop**
5. Wait a few seconds

Then continue with the password reset steps.

## Option 3: Reset Password Without Stopping Service (Alternative)

If you can't stop the service, we can try to reset the password using pgAdmin or by modifying the authentication method differently.

Let me know which option you prefer, or if you successfully stopped the service!
