# Simple Database Setup - tries common passwords
$pgPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

Write-Host "Setting up HuruDrive database..." -ForegroundColor Cyan
Write-Host ""

# Try common passwords
$passwords = @("postgres", "admin", "password", "root")

$foundPassword = $null
foreach ($pwd in $passwords) {
    $env:PGPASSWORD = $pwd
    $test = & $pgPath -U postgres -h localhost -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $foundPassword = $pwd
        Write-Host "OK Connected with password: $pwd" -ForegroundColor Green
        break
    }
}

if (-not $foundPassword) {
    Write-Host "X Could not connect. Please provide your PostgreSQL password." -ForegroundColor Red
    Write-Host ""
    Write-Host "To find or reset your password:" -ForegroundColor Yellow
    Write-Host "1. Open pgAdmin 4 (installed with PostgreSQL)" -ForegroundColor White
    Write-Host "2. Or check your installation notes" -ForegroundColor White
    Write-Host ""
    Write-Host "Then update your .env file manually:" -ForegroundColor Yellow
    Write-Host "DATABASE_URL=`"postgresql://postgres:YOUR_PASSWORD@localhost:5432/hurudrive_dev?schema=public&sslmode=disable`"" -ForegroundColor White
    exit 1
}

# Create database
Write-Host "Creating database..." -ForegroundColor Yellow
$create = & $pgPath -U postgres -h localhost -c "CREATE DATABASE hurudrive_dev;" 2>&1
if ($LASTEXITCODE -eq 0 -or $create -match "already exists") {
    Write-Host "OK Database ready!" -ForegroundColor Green
} else {
    Write-Host "X Error: $create" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "OK Setup complete! Your password is: $foundPassword" -ForegroundColor Green
Write-Host ""
Write-Host "Your .env should have:" -ForegroundColor Yellow
Write-Host "DATABASE_URL=`"postgresql://postgres:$foundPassword@localhost:5432/hurudrive_dev?schema=public&sslmode=disable`"" -ForegroundColor White
