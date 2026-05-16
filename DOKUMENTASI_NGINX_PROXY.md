# Dokumentasi Konfigurasi Nginx Reverse Proxy

Dokumen ini menjelaskan cara menggunakan Nginx sebagai Reverse Proxy untuk menghubungkan Frontend (React/Vite) dan Backend (Laravel) di bawah satu domain yang sama. Ini sangat disarankan agar developer selanjutnya tidak perlu mengubah-ubah URL API secara manual di kode Frontend.

## 1. Manfaat Menggunakan Reverse Proxy
- **Satu Domain**: FE dan BE berjalan di bawah domain yang sama (misal: `crypto-journal.test`), sehingga tidak ada masalah CORS.
- **Kemudahan Deployment**: Tidak perlu melakukan hardcode IP atau Port di sisi Frontend.
- **Keamanan**: Backend tidak terekspos langsung ke publik.
- **Clean Code**: Frontend cukup memanggil endpoint relatif seperti `/api/login` daripada `http://127.0.0.1:8000/api/login`.

## 2. Contoh Konfigurasi Nginx
Berikut adalah contoh konfigurasi server block Nginx untuk Windows (Laragon/XAMPP) atau Linux:

```nginx
server {
    listen 80;
    server_name crypto-journal.test;

    # Frontend (Vite Dev Server atau Build Folder)
    location / {
        proxy_pass http://localhost:5173; # Sesuaikan dengan port Vite Anda
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend (Laravel)
    location /api {
        proxy_pass http://localhost:8000; # Sesuaikan dengan port Laravel Artisan Serve
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 3. Penyesuaian di Sisi Frontend
Setelah Nginx dikonfigurasi, developer harus mengubah cara pemanggilan API di file `src/services/apiService.ts`.

### Sebelum (Manual/Hardcoded):
```typescript
const response = await fetch('http://127.0.0.1:8000/api/login', { ... });
```

### Sesudah (Menggunakan Relative Path):
Ubah base URL menjadi string kosong atau gunakan environment variable:
```typescript
const BASE_URL = window.location.origin; // Akan mengambil http://crypto-journal.test secara otomatis
const response = await fetch(`${BASE_URL}/api/login`, { ... });
```

## 4. Cara Implementasi di Laragon
Jika menggunakan Laragon, Anda bisa membuat file baru di `C:\laragon\etc\nginx\sites-enabled\crypto-journal.conf` dan masukkan konfigurasi di atas, lalu restart Nginx.

---
*Dokumentasi ini dibuat untuk mempermudah handover proyek ke developer lain.*
