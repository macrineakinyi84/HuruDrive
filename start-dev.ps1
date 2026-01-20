# Script to start dev server after ensuring ports are free
Write-Host "Preparing to start HuruDrive..." -ForegroundColor Cyan

# Kill process on port 3000 if exists
$conn3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn3000) {
    $procId = $conn3000.OwningProcess
    Write-Host "Stopping process on port 3000 (PID: $procId)..." -ForegroundColor Yellow
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "✅ Port 3000 freed" -ForegroundColor Green
}

# Start the dev server
Write-Host "`nStarting development server...`n" -ForegroundColor Cyan
npm run dev
