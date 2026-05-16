# Panduan Instalasi & Pengembangan Projek Crypto Journal

Dokumen ini ditujukan untuk pengembang selanjutnya guna memastikan kelancaran operasional dan sinkronisasi data API Exchange.

## 🛠 Prasyarat Sistem
- PHP >= 8.2 (Disarankan menggunakan Laragon/XAMPP)
- PostgreSQL / MySQL (Projek saat ini menggunakan PostgreSQL)
- Node.js & NPM (untuk Frontend React)
- Composer (untuk Backend Laravel)

## 🚀 Langkah Instalasi

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 2. Frontend (React)
```bash
cd ..
npm install
npm run dev
```

## 🌐 Informasi Penting: Konektivitas API Exchange

Berdasarkan pengujian pada infrastruktur jaringan di Indonesia (khususnya ISP Telkom/IndiHome), terdapat batasan akses pada beberapa endpoint API CEX.

### ✅ Exchange Aman (Tanpa VPN)
Exchange berikut menggunakan CEX lokal atau memiliki endpoint yang tidak diblokir:
- **Tokocrypto**: Menggunakan sistem *failover* otomatis ke domain `.site` atau `.com` yang sudah dioptimalkan di dalam kode.
- **Indodax**: API lokal Indonesia, akses sangat lancar tanpa kendala.

### ⚠️ Exchange Butuh VPN/Proxy
Exchange global berikut terkena blokir (SSL Interception/Connection Timeout) oleh beberapa ISP lokal:
- **Binance**, **Bybit**, **Bitget**, **MEXC**, **OKX**.

#### **Solusi untuk Developer Selanjutnya:**
Jika Anda mengalami `cURL error 60` (SSL) atau `cURL error 28` (Timeout) saat melakukan sinkronisasi, Anda memiliki dua pilihan:

1. **Menggunakan VPN**: Nyalakan VPN (seperti Cloudflare WARP atau lainnya) sebelum melakukan proses sinkronisasi data.
2. **Menggunakan Proxy (Disarankan)**: 
   Sistem sudah mendukung konfigurasi proxy secara global. Anda cukup menambahkan konfigurasi berikut di file `.env` backend:
   ```env
   # Ganti dengan detail proxy Anda
   HTTP_PROXY=http://username:password@ip_proxy:port
   
   # Jika masih mengalami kendala SSL pada lingkungan lokal
   CURL_VERIFY_SSL=false
   ```

## 🔧 Catatan Teknis (Optimasi Kode)
Semua class exchange di `app/Services/Exchanges/` telah dioptimalkan dengan:
- **Force IPv4**: Untuk menghindari *handshake timeout* pada jaringan IPv6 yang tidak stabil.
- **Dynamic Base URLs**: Khusus untuk Binance dan Tokocrypto, sistem akan mencoba beberapa domain alternatif jika domain utama gagal diakses.
- **Global HTTP Client**: Menggunakan fungsi `getHttpClient()` yang terpusat untuk memastikan semua settingan proxy dan timeout diterapkan secara konsisten.
