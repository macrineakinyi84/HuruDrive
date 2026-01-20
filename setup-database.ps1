# HuruDrive Database Setup Script
# This script sets up the PostgreSQL database for HuruDrive

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HuruDrive Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$pgPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Check if PostgreSQL is installed
if (-not (Test-Path $pgPath)) {
    Write-Host "X PostgreSQL not found at expected location" -ForegroundColor Red
    exit 1
}

Write-Host "OK PostgreSQL 18 found" -ForegroundColor Green
Write-Host ""

# Get password from user
$password = Read-Host "Enter PostgreSQL password for user 'postgres' (press Enter if password is 'postgres')"
if ([string]::IsNullOrWhiteSpace($password)) {
    $password = "postgres"
}

$env:PGPASSWORD = $password

# Test connection
Write-Host "Testing connection..." -ForegroundColor Yellow
$testResult = & $pgPath -U postgres -h localhost -c "SELECT version();" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "X Connection failed!" -ForegroundColor Red
    Write-Host $testResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check if the password is correct" -ForegroundColor White
    Write-Host "2. Reset password using pgAdmin or:" -ForegroundColor White
    Write-Host "   - Edit pg_hba.conf to allow trust authentication" -ForegroundColor White
    Write-Host "   - Restart PostgreSQL service" -ForegroundColor White
    Write-Host "   - Connect without password and set new password" -ForegroundColor White
    exit 1
}

Write-Host "OK Connected successfully!" -ForegroundColor Green
Write-Host ""

# Check if database exists
Write-Host "Checking if database 'hurudrive_dev' exists..." -ForegroundColor Yellow
$dbCheck = & $pgPath -U postgres -h localhost -lqt -d postgres 2>&1 | Select-String "hurudrive_dev"

if ($dbCheck) {
    Write-Host "OK Database 'hurudrive_dev' already exists" -ForegroundColor Green
    $recreate = Read-Host "Do you want to recreate it? (y/N)"
    if ($recreate -eq "y" -or $recreate -eq "Y") {
        Write-Host "Dropping existing database..." -ForegroundColor Yellow
        & $pgPath -U postgres -h localhost -c "DROP DATABASE IF EXISTS hurudrive_dev;" 2>&1 | Out-Null
        Write-Host "OK Database dropped" -ForegroundColor Green
    } else {
        Write-Host "Using existing database" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "Setup Complete!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Update .env file with your password:" -ForegroundColor White
        Write-Host "   DATABASE_URL=`"postgresql://postgres:$password@localhost:5432/hurudrive_dev?schema=public&sslmode=disable`"" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Run migrations:" -ForegroundColor White
        Write-Host "   npx prisma migrate dev" -ForegroundColor Gray
        Write-Host ""
        Write-Host "3. Seed data:" -ForegroundColor White
        Write-Host "   npm run prisma:seed" -ForegroundColor Gray
        exit 0
    }
}

# Create database
Write-Host "Creating database 'hurudrive_dev'..." -ForegroundColor Yellow
$createResult = & $pgPath -U postgres -h localhost -c "CREATE DATABASE hurudrive_dev;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Database created successfully!" -ForegroundColor Green
} else {
    if ($createResult -match "already exists") {
        Write-Host "OK Database already exists" -ForegroundColor Green
    } else {
        Write-Host "X Failed to create database" -ForegroundColor Red
        Write-Host $createResult -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your database password is: $password" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Update .env file with:" -ForegroundColor Yellow
Write-Host "   DATABASE_URL=`"postgresql://postgres:$password@localhost:5432/hurudrive_dev?schema=public&sslmode=disable`"" -ForegroundColor White
Write-Host ""
Write-Host "2. Run Prisma migrations:" -ForegroundColor Yellow
Write-Host "   npx prisma migrate dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Seed sample data:" -ForegroundColor Yellow
Write-Host "   npm run prisma:seed" -ForegroundColor White
Write-Host ""
Write-Host "4. Start the application:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
