#!/bin/bash
set -euo pipefail

required_variables=(
    IDENTITY_DB_USERNAME IDENTITY_DB_PASSWORD
    COMMUNITY_DB_USERNAME COMMUNITY_DB_PASSWORD
    CHAT_DB_USERNAME CHAT_DB_PASSWORD
    FACILITY_DB_USERNAME FACILITY_DB_PASSWORD
    FAVORITE_DB_USERNAME FAVORITE_DB_PASSWORD
)

for variable_name in "${required_variables[@]}"; do
    if [[ -z "${!variable_name:-}" ]]; then
        echo "Required environment variable is empty: ${variable_name}" >&2
        exit 1
    fi
done

sql_escape() {
    local value="$1"
    value="${value//\\/\\\\}"
    value="${value//\'/\'\'}"
    printf '%s' "$value"
}

create_module_database() {
    local database_name="$1"
    local username_variable="$2"
    local password_variable="$3"
    local username="${!username_variable}"
    local password="${!password_variable}"

    if [[ ! "$username" =~ ^[a-zA-Z0-9_]+$ ]]; then
        echo "Invalid database username: ${username_variable}" >&2
        exit 1
    fi

    local escaped_password
    escaped_password="$(sql_escape "$password")"

    mysql --protocol=socket -uroot -p"${MYSQL_ROOT_PASSWORD}" <<-SQL
        CREATE DATABASE IF NOT EXISTS \`${database_name}\`
            CHARACTER SET utf8mb4
            COLLATE utf8mb4_unicode_ci;
        CREATE USER IF NOT EXISTS '${username}'@'%' IDENTIFIED BY '${escaped_password}';
        ALTER USER '${username}'@'%' IDENTIFIED BY '${escaped_password}';
        GRANT ALL PRIVILEGES ON \`${database_name}\`.* TO '${username}'@'%';
SQL
}

create_module_database identity_db IDENTITY_DB_USERNAME IDENTITY_DB_PASSWORD
create_module_database community_db COMMUNITY_DB_USERNAME COMMUNITY_DB_PASSWORD
create_module_database chat_db CHAT_DB_USERNAME CHAT_DB_PASSWORD
create_module_database facility_db FACILITY_DB_USERNAME FACILITY_DB_PASSWORD
create_module_database favorite_db FAVORITE_DB_USERNAME FAVORITE_DB_PASSWORD
