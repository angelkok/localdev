#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER rails_user WITH PASSWORD 'rails_password';
    CREATE DATABASE rails_service_db;
    GRANT ALL PRIVILEGES ON DATABASE rails_service_db TO rails_user;

    CREATE USER go_user WITH PASSWORD 'go_password';
    CREATE DATABASE go_service_db;
    GRANT ALL PRIVILEGES ON DATABASE go_service_db TO go_user;

    CREATE USER python_user WITH PASSWORD 'python_password';
    CREATE DATABASE python_service_db;
    GRANT ALL PRIVILEGES ON DATABASE python_service_db TO python_user;

    CREATE USER node_user WITH PASSWORD 'node_password';
    CREATE DATABASE node_service_db;
    GRANT ALL PRIVILEGES ON DATABASE node_service_db TO node_user;
EOSQL
