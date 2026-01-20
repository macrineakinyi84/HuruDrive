# Reset PostgreSQL Password Script
# This script helps reset the postgres user password

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Password Reset" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$pgPath = "C:\Program Files\PostgreSQL\18\bin"
$dataPath = "C:\Program Files\PostgreSQL\18\data"
$pgHbaPath = "$dataPath\pg_hba.conf"

Write-Host "Step 1: Stopping PostgreSQL service..." -ForegroundColor Yellow
$service = Get-Service | Where-Object { $_.DisplayName -like "*PostgreSQL*" } | Select-Object -First 1
if ($service) {
    Stop-Service -Name $service.Name -Force
    Start-Sleep -Seconds 3
    Write-Host "OK Service stopped" -ForegroundColor Green
} else {
    Write-Host "X Service not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Backing up pg_hba.conf..." -ForegroundColor Yellow
if (Test-Path $pgHbaPath) {
    Copy-Item $pgHbaPath "$pgHbaPath.backup" -Force
    Write-Host "OK Backup created" -ForegroundColor Green
} else {
    Write-Host "X pg_hba.conf not found at: $pgHbaPath" -ForegroundColor Red
    Write-Host "Please check your PostgreSQL data directory" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 3: Modifying pg_hba.conf for trust authentication..." -ForegroundColor Yellow
$pgHbaContent = Get-Content $pgHbaPath
$newContent = $pgHbaContent | ForEach-Object {
    if ($_ -match "^#?host\s+all\s+all\s+127\.0\.0\.1/32\s+") {
        "host    all             all             127.0.0.1/32            trust"
    } elseif ($_ -match "^#?host\s+all\s+all\s+::1/128\s+") {
        "host    all             all             ::1/128                 trust"
    } elseif ($_ -match "^#?local\s+all\s+postgres\s+") {
        "local   all             postgres                                trust"
    } else {
        $_
    }
}
Set-Content -Path $pgHbaPath -Value $newContent
Write-Host "OK pg_hba.conf modified" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Starting PostgreSQL in single-user mode..." -ForegroundColor Yellow
$newPassword = Read-Host "Enter new password for 'postgres' user (or press Enter for 'superadmin')"
if ([string]::IsNullOrWhiteSpace($newPassword)) {
    $newPassword = "superadmin"
}

# Start PostgreSQL in single-user mode to reset password
Write-Host "Starting PostgreSQL in single-user mode..." -ForegroundColor Yellow
$process = Start-Process -FilePath "$pgPath\postgres.exe" -ArgumentList "--single", "-D", "`"$dataPath`"" -NoNewWindow -PassThru -RedirectStandardInput "reset-password-input.txt" -RedirectStandardOutput "reset-password-output.txt" -RedirectStandardError "reset-password-error.txt"

# Create input file with SQL commands
$sqlCommands = @"
ALTER USER postgres WITH PASSWORD '$newPassword';
\q
"@
Set-Content -Path "reset-password-input.txt" -Value $sqlCommands

Start-Sleep -Seconds 2

# Alternative method: Start service and use psql
Write-Host ""
Write-Host "Step 5: Starting PostgreSQL service..." -ForegroundColor Yellow
Start-Service -Name $service.Name
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Step 6: Resetting password..." -ForegroundColor Yellow
# Now connect without password (trust mode) and reset
$resetSQL = "ALTER USER postgres WITH PASSWORD '$newPassword';"
$resetSQL | & "$pgPath\psql.exe" -U postgres -d postgres 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Password reset successfully!" -ForegroundColor Green
} else {
    Write-Host "X Password reset failed. Trying alternative method..." -ForegroundColor Yellow
    
    # Try with environment variable
    $env:PGPASSWORD = ""
    $resetSQL | & "$pgPath\psql.exe" -U postgres -d postgres 2>&1
}

Write-Host ""
Write-Host "Step 7: Restoring pg_hba.conf..." -ForegroundColor Yellow
Copy-Item "$pgHbaPath.backup" $pgHbaPath -Force
Write-Host "OK pg_hba.conf restored" -ForegroundColor Green

Write-Host ""
Write-Host "Step 8: Restarting PostgreSQL service..." -ForegroundColor Yellow
Restart-Service -Name $service.Name
Start-Sleep -Seconds 3
Write-Host "OK Service restarted" -ForegroundColor Green

Write-Host ""
Write-Host "Step 9: Testing new password..." -ForegroundColor Yellow
$env:PGPASSWORD = $newPassword
$test = & "$pgPath\psql.exe" -U postgres -h localhost -c "SELECT version();" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Connection successful with new password!" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Password Reset Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "New password: $newPassword" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Update your .env file:" -ForegroundColor Cyan
    Write-Host "DATABASE_URL=`"postgresql://postgres:$newPassword@localhost:5432/hurudrive_dev?schema=public&sslmode=disable`"" -ForegroundColor White
} else {
    Write-Host "X Connection test failed" -ForegroundColor Red
    Write-Host $test -ForegroundColor Red
}

# Cleanup
Remove-Item "reset-password-input.txt" -ErrorAction SilentlyContinue
Remove-Item "reset-password-output.txt" -ErrorAction SilentlyContinue
Remove-Item "reset-password-error.txt" -ErrorAction SilentlyContinue
