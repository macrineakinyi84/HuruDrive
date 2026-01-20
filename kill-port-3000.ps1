# Quick script to kill process on port 3000
Write-Host "Killing process on port 3000..." -ForegroundColor Yellow

$connection = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1

if ($connection) {
    $processId = $connection.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "Stopping: $($process.ProcessName) (PID: $processId)" -ForegroundColor Red
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        Write-Host "✅ Port 3000 is now free!" -ForegroundColor Green
    } else {
        Write-Host "Could not find process details" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Port 3000 is already free" -ForegroundColor Green
}

Write-Host "`nYou can now run 'npm run dev' again" -ForegroundColor Cyan
