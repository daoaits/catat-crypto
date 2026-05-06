# 🌐 Ngrok Tunnel Setup - Akses Publik untuk Proyek Lokal

## 📋 Daftar Isi
1. [Apa itu Ngrok?](#apa-itu-ngrok)
2. [Instalasi Ngrok](#instalasi-ngrok)
3. [Konfigurasi Proyek](#konfigurasi-proyek)
4. [Cara Menggunakan](#cara-menggunakan)
5. [Cara Mematikan](#cara-mematikan)
6. [Troubleshooting](#troubleshooting)

---

## 🤔 Apa itu Ngrok?

Ngrok adalah tool yang membuat aplikasi lokal Anda (localhost) bisa diakses dari internet melalui URL publik.

### Keuntungan:
- ✅ **Mudah digunakan** - Install dan jalankan dalam hitungan menit
- ✅ **Gratis** - Versi gratis sudah cukup untuk demo dan testing
- ✅ **Fleksibel** - Bisa dinyalakan dan dimatikan kapan saja
- ✅ **Aman** - URL berubah setiap kali restart (kecuali pakai custom domain)
- ✅ **HTTPS otomatis** - Langsung dapat SSL certificate

### Kapan Digunakan:
- 🎯 Demo ke klien atau tim
- 🎯 Testing dari device lain (HP, tablet)
- 🎯 Webhook testing (untuk API dari exchange)
- 🎯 Share sementara tanpa perlu deploy

---

## 📥 Instalasi Ngrok

### Windows (Recommended):

#### Opsi 1: Download Manual
1. Kunjungi: https://ngrok.com/download
2. Download versi Windows
3. Extract file `ngrok.exe` ke folder yang mudah diakses (contoh: `C:\ngrok\`)
4. Tambahkan ke PATH (opsional tapi recommended):
   - Buka System Properties → Environment Variables
   - Edit PATH, tambahkan `C:\ngrok\`

#### Opsi 2: Via Chocolatey (jika sudah install Chocolatey)
```bash
choco install ngrok
```

#### Opsi 3: Via Scoop (jika sudah install Scoop)
```bash
scoop install ngrok
```

### Verifikasi Instalasi:
```bash
ngrok version
```

### Setup Account (Gratis):
1. Daftar di: https://dashboard.ngrok.com/signup
2. Setelah login, copy authtoken dari dashboard
3. Jalankan command ini (hanya sekali):
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

---

## ⚙️ Konfigurasi Proyek

### 1. Update CORS di Backend

File: `backend/config/cors.php`

**SUDAH DIKONFIGURASI** - CORS sudah allow all origins (`'*'`), jadi tidak perlu diubah.

Tapi untuk production nanti, sebaiknya ganti dengan:
```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:5173'),
    // Tambahkan ngrok URL di sini nanti
],
```

### 2. Buat Environment Variables untuk Tunnel

File: `.env` (root project - untuk frontend)

Tambahkan:
```env
# Development (default)
VITE_API_URL=http://localhost:8000

# Untuk Ngrok Tunnel (uncomment saat pakai ngrok)
# VITE_API_URL=https://your-backend-url.ngrok-free.app
```

File: `backend/.env` (untuk backend)

Tambahkan:
```env
# Frontend URL untuk CORS
FRONTEND_URL=http://localhost:5173

# Untuk Ngrok Tunnel (uncomment saat pakai ngrok)
# FRONTEND_URL=https://your-frontend-url.ngrok-free.app
```

### 3. Update API Base URL di Frontend

Cek file yang menggunakan API URL (biasanya di `src/` folder).

Pastikan menggunakan environment variable:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## 🚀 Cara Menggunakan

### Port yang Digunakan:
- **Frontend (React/Vite)**: Port 5173 (default Vite)
- **Backend (Laravel)**: Port 8000 (default Laravel)

### Langkah-langkah:

#### 1. Start Aplikasi Lokal (seperti biasa)

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
# Backend berjalan di http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Frontend berjalan di http://localhost:5173
```

#### 2. Start Ngrok Tunnel

**Terminal 3 - Ngrok untuk Backend:**
```bash
ngrok http 8000
```

Output akan seperti ini:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        Asia Pacific (ap)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**COPY URL INI**: `https://abc123.ngrok-free.app`

**Terminal 4 - Ngrok untuk Frontend:**
```bash
ngrok http 5173
```

Output akan seperti ini:
```
Forwarding                    https://xyz789.ngrok-free.app -> http://localhost:5173
```

**COPY URL INI**: `https://xyz789.ngrok-free.app`

#### 3. Update Environment Variables

**File: `.env` (root)**
```env
VITE_API_URL=https://abc123.ngrok-free.app
```

**File: `backend/.env`**
```env
FRONTEND_URL=https://xyz789.ngrok-free.app
```

#### 4. Restart Frontend (agar env variable ter-load)

Di Terminal 2, tekan `Ctrl+C` lalu:
```bash
npm run dev
```

#### 5. Akses Aplikasi

Buka browser dan akses:
```
https://xyz789.ngrok-free.app
```

**PENTING**: Ngrok free akan menampilkan warning page dulu, klik "Visit Site" untuk lanjut.

#### 6. Share URL ke Orang Lain

Kirim URL frontend ke orang yang ingin akses:
```
https://xyz789.ngrok-free.app
```

Mereka bisa langsung akses dari browser mereka!

---

## 🛑 Cara Mematikan

### Matikan Tunnel (Aplikasi Tidak Bisa Diakses Lagi):

1. **Matikan Ngrok:**
   - Di Terminal 3 (Backend Ngrok): Tekan `Ctrl+C`
   - Di Terminal 4 (Frontend Ngrok): Tekan `Ctrl+C`

2. **Kembalikan Environment Variables:**

   **File: `.env`**
   ```env
   VITE_API_URL=http://localhost:8000
   ```

   **File: `backend/.env`**
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

3. **Restart Frontend:**
   ```bash
   # Di Terminal 2
   Ctrl+C
   npm run dev
   ```

4. **Aplikasi Lokal Tetap Jalan:**
   - Backend masih jalan di `http://localhost:8000`
   - Frontend masih jalan di `http://localhost:5173`
   - Hanya tidak bisa diakses dari internet

### Matikan Semua (Termasuk Aplikasi Lokal):

```bash
# Terminal 1 (Backend): Ctrl+C
# Terminal 2 (Frontend): Ctrl+C
# Terminal 3 (Ngrok Backend): Ctrl+C
# Terminal 4 (Ngrok Frontend): Ctrl+C
```

---

## 🔧 Troubleshooting

### 1. "ERR_NGROK_3200" atau "Tunnel not found"

**Penyebab**: Authtoken belum di-setup

**Solusi**:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### 2. CORS Error di Browser

**Penyebab**: Frontend URL belum ditambahkan ke CORS config

**Solusi**: Update `backend/config/cors.php` atau pastikan `allowed_origins` adalah `['*']`

### 3. API Request Gagal (404 atau 500)

**Penyebab**: Environment variable belum ter-load

**Solusi**: 
1. Pastikan `.env` sudah diupdate dengan ngrok URL
2. Restart frontend: `Ctrl+C` lalu `npm run dev`
3. Clear browser cache atau buka incognito

### 4. "Too Many Connections" (Free Plan)

**Penyebab**: Ngrok free plan limit 40 connections/minute

**Solusi**: 
- Tunggu 1 menit
- Atau upgrade ke paid plan
- Atau gunakan Cloudflare Tunnel (unlimited)

### 5. URL Berubah Setiap Restart

**Penyebab**: Ngrok free plan memberikan random URL

**Solusi**:
- Upgrade ke paid plan untuk custom domain
- Atau gunakan Cloudflare Tunnel (gratis + custom domain)

### 6. "Visit Site" Warning Page

**Penyebab**: Ngrok free plan menampilkan warning page

**Solusi**: 
- Klik "Visit Site" untuk lanjut (normal untuk free plan)
- Atau upgrade ke paid plan untuk hilangkan warning

### 7. Slow Response / Latency Tinggi

**Penyebab**: Request harus lewat ngrok server dulu

**Solusi**:
- Normal untuk tunnel (tambah ~100-300ms latency)
- Pilih region terdekat saat signup
- Atau gunakan Cloudflare Tunnel (lebih cepat)

---

## 📊 Monitoring Ngrok

### Web Interface

Ngrok menyediakan web interface untuk monitoring:

```
http://127.0.0.1:4040
```

Buka di browser untuk melihat:
- ✅ Request/Response logs
- ✅ Request details
- ✅ Replay requests
- ✅ Connection stats

---

## 🎯 Tips & Best Practices

### 1. Keamanan

⚠️ **PENTING**: Jangan expose aplikasi dengan data sensitif!

- ✅ Gunakan database testing, bukan production
- ✅ Jangan commit ngrok URL ke git
- ✅ Matikan tunnel setelah selesai demo
- ✅ Gunakan environment variables untuk sensitive data

### 2. Performance

- ✅ Ngrok menambah latency ~100-300ms (normal)
- ✅ Untuk production, gunakan proper hosting
- ✅ Ngrok hanya untuk development/demo

### 3. Free Plan Limitations

- ⚠️ Random URL setiap restart
- ⚠️ 40 connections/minute
- ⚠️ Warning page sebelum akses
- ⚠️ 1 online ngrok process per account (tapi bisa multiple tunnels)

### 4. Multiple Tunnels Sekaligus

Buat file `ngrok.yml` untuk start multiple tunnels:

```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN
tunnels:
  backend:
    proto: http
    addr: 8000
  frontend:
    proto: http
    addr: 5173
```

Lalu jalankan:
```bash
ngrok start --all
```

---

## 🆚 Alternatif: Cloudflare Tunnel

Jika butuh:
- ✅ Unlimited bandwidth
- ✅ Custom domain gratis
- ✅ Tidak ada warning page
- ✅ Lebih cepat

Bisa gunakan Cloudflare Tunnel. Dokumentasi terpisah bisa dibuat jika diperlukan.

---

## 📝 Checklist Sebelum Share ke Orang Lain

- [ ] Backend sudah jalan di localhost:8000
- [ ] Frontend sudah jalan di localhost:5173
- [ ] Ngrok backend sudah jalan dan dapat URL
- [ ] Ngrok frontend sudah jalan dan dapat URL
- [ ] Environment variables sudah diupdate
- [ ] Frontend sudah di-restart setelah update env
- [ ] Test akses dari browser sendiri dulu
- [ ] Database sudah ada data testing (bukan data sensitif)
- [ ] Share URL frontend (bukan backend) ke orang lain

---

## 🎬 Quick Start Commands

```bash
# 1. Start Backend
cd backend && php artisan serve

# 2. Start Frontend (terminal baru)
npm run dev

# 3. Start Ngrok Backend (terminal baru)
ngrok http 8000

# 4. Start Ngrok Frontend (terminal baru)
ngrok http 5173

# 5. Copy URLs dan update .env files

# 6. Restart frontend
# Ctrl+C di terminal frontend, lalu:
npm run dev

# 7. Share frontend URL ke orang lain!
```

---

## 📞 Support

Jika ada masalah:
1. Cek Troubleshooting section di atas
2. Cek ngrok web interface: http://127.0.0.1:4040
3. Cek browser console untuk error
4. Cek Laravel logs: `backend/storage/logs/laravel.log`

---

**Dibuat**: 2026-05-07  
**Versi**: 1.0  
**Status**: Ready to Use ✅
