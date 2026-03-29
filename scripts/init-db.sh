#!/bin/bash
set -e

# Create the sandbox database for user SQL execution
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE ${SANDBOX_DB_NAME} OWNER ${POSTGRES_USER};
EOSQL

# Set up permissions in the sandbox database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$SANDBOX_DB_NAME" <<-EOSQL
    GRANT ALL PRIVILEGES ON SCHEMA public TO ${POSTGRES_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${POSTGRES_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${POSTGRES_USER};
EOSQL
