# 🐘 Panduan Migrasi MySQL ke PostgreSQL

> **TL;DR**: Jalankan `backend/migrate-to-postgresql.bat` dan ikuti instruksi. Selesai dalam 5 menit! ✅

## 📋 Yang Sudah Diperbaiki

- ✅ Migration file `update_trade_journals_remarks_to_mediumtext.php` sudah diupdate
- ✅ Semua migration compatible dengan PostgreSQL
- ✅ Tidak perlu ubah application code
- ✅ Script otomatis sudah tersedia

---

## 🚀 Quick Start (3 Langkah)

### 1. Install PostgreSQL
**Windows:** Download dari https://www.postgresql.org/download/windows/  
**Atau Docker:** `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:16`

### 2. Buat Database
```bash
psql -U postgres
CREATE DATABASE laravel_trading;
\q
```

### 3. Jalankan Script
```bash
cd backend
./migrate-to-postgresql.bat  # Windows
```

**Done!** ✅

---

## Persiapan Manual (Jika Tidak Pakai Script)

### 1. Install PostgreSQL
**Windows:**
- Download dari https://www.postgresql.org/download/windows/
- Atau gunakan Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:16`

**Verifikasi instalasi:**
```bash
psql --version
```

### 2. Buat Database PostgreSQL
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE laravel_trading;

# Buat user (opsional)
CREATE USER laravel_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE laravel_trading TO laravel_user;

# Keluar
\q
```

## Konfigurasi Laravel

### 1. Update `.env`
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laravel_trading
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 2. Update `.env.example` (untuk dokumentasi)
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laravel_trading
DB_USERNAME=postgres
DB_PASSWORD=
```

## Migrasi Data (Jika Ada Data di MySQL)

### Opsi 1: Export/Import Manual

**Export dari MySQL:**
```bash
cd backend
php artisan db:seed --class=ExportDataSeeder  # Jika ada seeder
# Atau export manual per table
```

**Import ke PostgreSQL:**
```bash
php artisan migrate:fresh
php artisan db:seed  # Jika ada seeder
```

### Opsi 2: Menggunakan Tool Migrasi

**Menggunakan pgLoader (Recommended):**
```bash
# Install pgLoader
# Windows: Download dari https://github.com/dimitri/pgloader/releases

# Buat file config: mysql-to-pgsql.load
LOAD DATABASE
     FROM mysql://user:password@localhost/mysql_database
     INTO postgresql://postgres:password@localhost/laravel_trading

WITH include drop, create tables, create indexes, reset sequences

SET maintenance_work_mem to '128MB', work_mem to '12MB'

CAST type datetime to timestamptz
     drop default drop not null using zero-dates-to-null,
     type date drop not null drop default using zero-dates-to-null;

# Jalankan
pgloader mysql-to-pgsql.load
```

## Jalankan Migrasi

```bash
cd backend

# Fresh migration (akan drop semua table)
php artisan migrate:fresh

# Atau rollback dulu jika ada data
php artisan migrate:rollback --all
php artisan migrate
```

## Verifikasi

### 1. Test Koneksi
```bash
php artisan tinker
```
```php
DB::connection()->getPdo();
// Harus return PDO object tanpa error

User::count();
// Test query
```

### 2. Test API Endpoints
```bash
# Test health check
curl http://localhost:8000/api/health

# Test dengan Postman/Thunder Client
```

## Perbedaan MySQL vs PostgreSQL yang Perlu Diketahui

### Case Sensitivity
```php
// MySQL - case-insensitive
User::where('email', 'LIKE', '%TEST%')->get();

// PostgreSQL - gunakan ILIKE untuk case-insensitive
User::where('email', 'ILIKE', '%TEST%')->get();

// Atau pakai Eloquent (otomatis handle)
User::where('email', 'like', '%test%')->get(); // ✅ Recommended
```

### JSON Queries
```php
// Laravel Eloquent (works on both) ✅
TradeJournal::whereJsonContains('screenshots', ['url' => $url])->get();
```

### Date Functions
```php
// Laravel Eloquent (works on both) ✅
TradeJournal::whereDate('trade_date', now())->get();
TradeJournal::whereYear('trade_date', 2026)->get();
```

**Good news:** Semua code di proyek ini sudah pakai Eloquent, jadi tidak perlu ubah apapun! ✅

---

## ⚠️ Important Notes

1. **TEXT Types**: PostgreSQL TEXT bisa simpan sampai 1GB (MySQL MEDIUMTEXT cuma 16MB)
2. **JSON**: PostgreSQL pakai JSONB (binary, lebih cepat, bisa di-index)
3. **ENUM**: Otomatis jadi CHECK constraint di PostgreSQL
4. **Boolean**: PostgreSQL pakai `true`/`false` (MySQL pakai `0`/`1`) - Laravel handle otomatis

---

## 🔙 Rollback ke MySQL

```bash
cp backend/.env.mysql.backup backend/.env
php artisan config:clear
```

---

## 🎯 Keuntungan PostgreSQL

✅ **Better JSON Support** - JSONB untuk `screenshots` field  
✅ **Better Concurrent Writes** - Multiple users sync bersamaan  
✅ **More Reliable** - ACID compliance lebih strict  
✅ **Better for Analytics** - Window functions, CTEs  
✅ **Industry Standard** - Dipakai oleh perusahaan besar  

---

## 📊 Testing Checklist

Setelah migrate, test:
- [ ] Login/Register
- [ ] Onboarding flow
- [ ] Add/Edit/Delete CEX account
- [ ] Sync exchange data
- [ ] Create/Edit trade journal dengan screenshots
- [ ] List journals dengan filter tanggal

---

## ❓ Troubleshooting

### Error: "could not connect to server"
```bash
# Check PostgreSQL service
# Windows: Services -> PostgreSQL
# Atau: net start postgresql-x64-16
```

### Error: "database does not exist"
```bash
psql -U postgres
CREATE DATABASE laravel_trading;
\q
```

### Error: "authentication failed"
```bash
# Check password di .env
# Check username (default: postgres)
```

---

## 💡 Tips Production

1. **Backup Rutin**
   ```bash
   pg_dump -U postgres laravel_trading > backup.sql
   ```

2. **Connection Pooling** - Install PgBouncer

3. **Monitoring** - Check query performance dengan `EXPLAIN ANALYZE`

---

**Estimasi Waktu**: 5-10 menit  
**Risk Level**: 🟢 Low (easy rollback)  
**Recommendation**: ✅ **GO!**
