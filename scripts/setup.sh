#!/usr/bin/env bash
set -euo pipefail

echo "=== Data Modelling Lab Setup ==="

# Load env vars
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Start PostgreSQL
echo "Starting PostgreSQL..."
docker compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until docker compose exec -T postgres pg_isready -U "${POSTGRES_USER}" -d "${APP_DB_NAME}" > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is ready."

# Install dependencies
echo "Installing dependencies..."
npm install

# Run migrations
echo "Running migrations..."
npm run db:generate -w server 2>/dev/null || true
npm run db:migrate -w server 2>/dev/null || true

# Seed challenges
echo "Seeding challenges..."
npm run db:seed -w server

echo ""
echo "=== Setup complete! ==="
echo "Run 'npm run dev' to start the application."
echo "  Client: http://localhost:5173"
echo "  Server: http://localhost:${SERVER_PORT:-3001}"
