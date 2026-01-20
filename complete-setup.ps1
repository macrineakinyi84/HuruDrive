# Complete HuruDrive Setup Script
$pgPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$password = "superadmin"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HuruDrive Complete Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find and start PostgreSQL service
Write-Host "Looking for PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service | Where-Object { $_.DisplayName -like "*PostgreSQL*" } | Select-Object -First 1

if ($pgService) {
    Write-Host "Found service: $($pgService.Name)" -ForegroundColor Green
    if ($pgService.Status -ne "Running") {
        Write-Host "Starting PostgreSQL service..." -ForegroundColor Yellow
        Start-Service -Name $pgService.Name
        Start-Sleep -Seconds 5
    }
    Write-Host "Service status: $($pgService.Status)" -ForegroundColor Green
} else {
    Write-Host "X PostgreSQL service not found!" -ForegroundColor Red
    Write-Host "Please start PostgreSQL manually or check installation." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can start it from:" -ForegroundColor Yellow
    Write-Host "1. Services (services.msc) - look for PostgreSQL" -ForegroundColor White
    Write-Host "2. pgAdmin 4 - it may start the service automatically" -ForegroundColor White
    exit 1
}

# Test connection
Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Yellow
$env:PGPASSWORD = $password
$test = & $pgPath -U postgres -h localhost -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "X Connection failed!" -ForegroundColor Red
    Write-Host $test -ForegroundColor Red
    Write-Host ""
    Write-Host "Trying alternative connection method..." -ForegroundColor Yellow
    # Try connecting via Windows authentication or different host
    $test2 = & $pgPath -U postgres -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK Connected via alternative method!" -ForegroundColor Green
        $useAlt = $true
    } else {
        Write-Host "X Still failed. Please check:" -ForegroundColor Red
        Write-Host "  1. PostgreSQL service is running" -ForegroundColor White
        Write-Host "  2. Password is correct: $password" -ForegroundColor White
        Write-Host "  3. Port 5432 is not blocked by firewall" -ForegroundColor White
        exit 1
    }
}

# Create database
Write-Host ""
Write-Host "Creating database 'hurudrive_dev'..." -ForegroundColor Yellow
if ($useAlt) {
    $create = & $pgPath -U postgres -c "CREATE DATABASE hurudrive_dev;" 2>&1
} else {
    $create = & $pgPath -U postgres -h localhost -c "CREATE DATABASE hurudrive_dev;" 2>&1
}

if ($LASTEXITCODE -eq 0 -or $create -match "already exists") {
    Write-Host "OK Database ready!" -ForegroundColor Green
} else {
    Write-Host "X Error creating database: $create" -ForegroundColor Red
    exit 1
}

# Update .env file
Write-Host ""
Write-Host "Updating .env file..." -ForegroundColor Yellow
$envContent = @"
DATABASE_URL="postgresql://postgres:$password@localhost:5432/hurudrive_dev?schema=public&sslmode=disable"
PORT=3000
JWT_SECRET="your-secret-key-change-in-production"
"@

Set-Content -Path ".env" -Value $envContent -Force
Write-Host "OK .env file updated!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next: Run migrations and seed data" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Run these commands:" -ForegroundColor Yellow
Write-Host "  npx prisma migrate dev" -ForegroundColor White
Write-Host "  npm run prisma:seed" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
