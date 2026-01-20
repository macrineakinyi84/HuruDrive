# Script to fix port 3000 conflict
Write-Host "Checking for processes using port 3000..." -ForegroundColor Yellow

# Find process using port 3000
$connection = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1

if ($connection) {
    $pid = $connection.OwningProcess
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "Found process: $($process.ProcessName) (PID: $pid)" -ForegroundColor Red
        Write-Host "Stopping process..." -ForegroundColor Yellow
        
        try {
            Stop-Process -Id $pid -Force
            Write-Host "✅ Process stopped successfully!" -ForegroundColor Green
            Write-Host "You can now run 'npm run dev' again" -ForegroundColor Green
        } catch {
            Write-Host "❌ Error stopping process: $_" -ForegroundColor Red
            Write-Host "Try running PowerShell as Administrator" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Process found but cannot get details. PID: $pid" -ForegroundColor Yellow
        Write-Host "Try: Stop-Process -Id $pid -Force" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ No process found on port 3000" -ForegroundColor Green
    Write-Host "Port 3000 is available!" -ForegroundColor Green
}

Write-Host "`nChecking port 5173..." -ForegroundColor Yellow
$connection5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($connection5173) {
    $pid5173 = $connection5173.OwningProcess
    $process5173 = Get-Process -Id $pid5173 -ErrorAction SilentlyContinue
    if ($process5173) {
        Write-Host "Port 5173 is in use by: $($process5173.ProcessName) (PID: $pid5173)" -ForegroundColor Yellow
        Write-Host "This is okay - Vite will use port 5174 instead" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Port 5173 is available" -ForegroundColor Green
}
