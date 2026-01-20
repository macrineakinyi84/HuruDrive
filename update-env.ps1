# Update .env file with correct password
$envContent = @"
DATABASE_URL="postgresql://postgres:superadmin@localhost:5432/hurudrive_dev?schema=public&sslmode=disable"
PORT=3000
JWT_SECRET="your-secret-key-change-in-production"
"@

Set-Content -Path ".env" -Value $envContent -Force
Write-Host "OK .env file updated with password: superadmin" -ForegroundColor Green
