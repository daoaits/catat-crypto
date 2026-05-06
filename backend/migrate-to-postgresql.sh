#!/bin/bash

# Script untuk migrasi dari MySQL ke PostgreSQL
# Usage: ./migrate-to-postgresql.sh

echo "🐘 Migrasi MySQL ke PostgreSQL"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ File .env tidak ditemukan!"
    echo "   Copy dari .env.example terlebih dahulu"
    exit 1
fi

# Backup current .env
echo "📦 Backup .env ke .env.mysql.backup..."
cp .env .env.mysql.backup

# Prompt for PostgreSQL credentials
echo ""
echo "Masukkan kredensial PostgreSQL:"
read -p "Host (default: 127.0.0.1): " DB_HOST
DB_HOST=${DB_HOST:-127.0.0.1}

read -p "Port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Database name (default: laravel_trading): " DB_DATABASE
DB_DATABASE=${DB_DATABASE:-laravel_trading}

read -p "Username (default: postgres): " DB_USERNAME
DB_USERNAME=${DB_USERNAME:-postgres}

read -sp "Password: " DB_PASSWORD
echo ""

# Update .env file
echo ""
echo "📝 Update .env file..."
sed -i "s/^DB_CONNECTION=.*/DB_CONNECTION=pgsql/" .env
sed -i "s/^DB_HOST=.*/DB_HOST=$DB_HOST/" .env
sed -i "s/^DB_PORT=.*/DB_PORT=$DB_PORT/" .env
sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_DATABASE/" .env
sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$DB_USERNAME/" .env
sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env

# Clear config cache
echo "🧹 Clear config cache..."
php artisan config:clear
php artisan cache:clear

# Test connection
echo ""
echo "🔌 Test koneksi PostgreSQL..."
php artisan tinker --execute="DB::connection()->getPdo(); echo 'Koneksi berhasil!';"

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Koneksi gagal! Periksa kredensial PostgreSQL"
    echo "   Restore .env dari backup: cp .env.mysql.backup .env"
    exit 1
fi

# Ask for migration confirmation
echo ""
read -p "Jalankan migration? (y/n): " RUN_MIGRATION

if [ "$RUN_MIGRATION" = "y" ] || [ "$RUN_MIGRATION" = "Y" ]; then
    echo ""
    echo "🚀 Jalankan migration..."
    php artisan migrate:fresh --force
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Migrasi berhasil!"
        echo ""
        echo "📋 Next steps:"
        echo "   1. Test API endpoints"
        echo "   2. Import data jika ada (php artisan db:seed)"
        echo "   3. Update .env.example untuk dokumentasi"
        echo ""
        echo "💾 Backup MySQL .env tersimpan di: .env.mysql.backup"
    else
        echo ""
        echo "❌ Migration gagal!"
        echo "   Restore .env: cp .env.mysql.backup .env"
        exit 1
    fi
else
    echo ""
    echo "⏭️  Migration dibatalkan"
    echo "   Jalankan manual: php artisan migrate:fresh"
fi

echo ""
echo "✨ Selesai!"
