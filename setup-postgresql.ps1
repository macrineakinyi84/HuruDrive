# HuruDrive PostgreSQL Setup Script
# This script helps you set up PostgreSQL for HuruDrive

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HuruDrive PostgreSQL Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking for PostgreSQL installation..." -ForegroundColor Yellow

$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if ($pgPath) {
    Write-Host "✓ PostgreSQL is already installed!" -ForegroundColor Green
    Write-Host "  Location: $($pgPath.Source)" -ForegroundColor Gray
    Write-Host ""
    
    # Check if service is running
    $pgService = Get-Service -Name "*postgresql*" -ErrorAction SilentlyContinue
    if ($pgService) {
        Write-Host "PostgreSQL Service Status:" -ForegroundColor Yellow
        $pgService | Format-Table Name, Status, DisplayName
    }
} else {
    Write-Host "✗ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Or use EnterpriseDB installer: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads" -ForegroundColor White
    Write-Host "3. During installation, set password to 'postgres' (or remember your password)" -ForegroundColor White
    Write-Host "4. Keep default port: 5432" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    exit
}

# Check if database exists
Write-Host "Checking database connection..." -ForegroundColor Yellow
$env:PGPASSWORD = "postgres"
$dbCheck = & psql -U postgres -h localhost -c "SELECT 1" -d postgres 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Connected to PostgreSQL successfully!" -ForegroundColor Green
    Write-Host ""
    
    # Check if database exists
    $dbExists = & psql -U postgres -h localhost -lqt -d postgres 2>&1 | Select-String "hurudrive_dev"
    
    if ($dbExists) {
        Write-Host "✓ Database 'hurudrive_dev' already exists" -ForegroundColor Green
    } else {
        Write-Host "Creating database 'hurudrive_dev'..." -ForegroundColor Yellow
        & psql -U postgres -h localhost -c "CREATE DATABASE hurudrive_dev;" 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Database created successfully!" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to create database" -ForegroundColor Red
            Write-Host "You may need to create it manually:" -ForegroundColor Yellow
            Write-Host "  psql -U postgres -c 'CREATE DATABASE hurudrive_dev;'" -ForegroundColor White
        }
    }
} else {
    Write-Host "✗ Cannot connect to PostgreSQL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. PostgreSQL service is not running" -ForegroundColor White
    Write-Host "2. Wrong password (default is 'postgres')" -ForegroundColor White
    Write-Host "3. PostgreSQL is not installed correctly" -ForegroundColor White
    Write-Host ""
    Write-Host "To start PostgreSQL service:" -ForegroundColor Yellow
    Write-Host "  Get-Service *postgresql* | Start-Service" -ForegroundColor White
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Verify your .env file has:" -ForegroundColor Yellow
Write-Host "   DATABASE_URL=`"postgresql://postgres:postgres@localhost:5432/hurudrive_dev?schema=public&sslmode=disable`"" -ForegroundColor White
Write-Host ""
Write-Host "2. Run Prisma migrations:" -ForegroundColor Yellow
Write-Host "   npx prisma migrate dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Seed the database:" -ForegroundColor Yellow
Write-Host "   npm run prisma:seed" -ForegroundColor White
Write-Host ""
Write-Host "4. Start the application:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
