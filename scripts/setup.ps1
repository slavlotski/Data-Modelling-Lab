Write-Host "=== Data Modelling Lab Setup ===" -ForegroundColor Cyan

# Load env vars from .env
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
        }
    }
}

$pgUser = $env:POSTGRES_USER ?? "dml_admin"
$appDb = $env:APP_DB_NAME ?? "dml_app"
$serverPort = $env:SERVER_PORT ?? "3001"

# Start PostgreSQL
Write-Host "Starting PostgreSQL..."
docker compose up -d

# Wait for PostgreSQL to be ready
Write-Host "Waiting for PostgreSQL..."
do {
    Start-Sleep -Seconds 1
    $ready = docker compose exec -T postgres pg_isready -U $pgUser -d $appDb 2>$null
} until ($LASTEXITCODE -eq 0)
Write-Host "PostgreSQL is ready."

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Run migrations
Write-Host "Running migrations..."
npm run db:generate -w server 2>$null
npm run db:migrate -w server 2>$null

# Seed challenges
Write-Host "Seeding challenges..."
npm run db:seed -w server

Write-Host ""
Write-Host "=== Setup complete! ===" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the application."
Write-Host "  Client: http://localhost:5173"
Write-Host "  Server: http://localhost:$serverPort"
