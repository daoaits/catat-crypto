@echo off
REM Script untuk migrasi dari MySQL ke PostgreSQL (Windows)
REM Usage: migrate-to-postgresql.bat

echo.
echo 🐘 Migrasi MySQL ke PostgreSQL
echo ================================
echo.

REM Check if .env exists
if not exist .env (
    echo ❌ File .env tidak ditemukan!
    echo    Copy dari .env.example terlebih dahulu
    exit /b 1
)

REM Backup current .env
echo 📦 Backup .env ke .env.mysql.backup...
copy .env .env.mysql.backup >nul

REM Prompt for PostgreSQL credentials
echo.
echo Masukkan kredensial PostgreSQL:
set /p DB_HOST="Host (default: 127.0.0.1): "
if "%DB_HOST%"=="" set DB_HOST=127.0.0.1

set /p DB_PORT="Port (default: 5432): "
if "%DB_PORT%"=="" set DB_PORT=5432

set /p DB_DATABASE="Database name (default: laravel_trading): "
if "%DB_DATABASE%"=="" set DB_DATABASE=laravel_trading

set /p DB_USERNAME="Username (default: postgres): "
if "%DB_USERNAME%"=="" set DB_USERNAME=postgres

set /p DB_PASSWORD="Password: "

REM Update .env file using PowerShell
echo.
echo 📝 Update .env file...
powershell -Command "(Get-Content .env) -replace '^DB_CONNECTION=.*', 'DB_CONNECTION=pgsql' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_HOST=.*', 'DB_HOST=%DB_HOST%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_PORT=.*', 'DB_PORT=%DB_PORT%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_DATABASE=.*', 'DB_DATABASE=%DB_DATABASE%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_USERNAME=.*', 'DB_USERNAME=%DB_USERNAME%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace '^DB_PASSWORD=.*', 'DB_PASSWORD=%DB_PASSWORD%' | Set-Content .env"

REM Clear config cache
echo 🧹 Clear config cache...
php artisan config:clear
php artisan cache:clear

REM Test connection
echo.
echo 🔌 Test koneksi PostgreSQL...
php artisan tinker --execute="try { DB::connection()->getPdo(); echo 'Koneksi berhasil!'; } catch (Exception $e) { echo 'Error: ' . $e->getMessage(); exit(1); }"

if errorlevel 1 (
    echo.
    echo ❌ Koneksi gagal! Periksa kredensial PostgreSQL
    echo    Restore .env dari backup: copy .env.mysql.backup .env
    exit /b 1
)

REM Ask for migration confirmation
echo.
set /p RUN_MIGRATION="Jalankan migration? (y/n): "

if /i "%RUN_MIGRATION%"=="y" (
    echo.
    echo 🚀 Jalankan migration...
    php artisan migrate:fresh --force
    
    if errorlevel 1 (
        echo.
        echo ❌ Migration gagal!
        echo    Restore .env: copy .env.mysql.backup .env
        exit /b 1
    )
    
    echo.
    echo ✅ Migrasi berhasil!
    echo.
    echo 📋 Next steps:
    echo    1. Test API endpoints
    echo    2. Import data jika ada (php artisan db:seed^)
    echo    3. Update .env.example untuk dokumentasi
    echo.
    echo 💾 Backup MySQL .env tersimpan di: .env.mysql.backup
) else (
    echo.
    echo ⏭️  Migration dibatalkan
    echo    Jalankan manual: php artisan migrate:fresh
)

echo.
echo ✨ Selesai!
pause
