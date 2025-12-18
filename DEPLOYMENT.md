# Deployment Guide - Restaurant API

Panduan deployment REST API ke AWS EC2 untuk production.

---

## Information

### Repository
- **GitHub:** https://github.com/Ikrar06/restaurant-api
- **Branch:** main

### Production URLs
- **Base URL:** `http://44.216.9.251:3000/api`
- **Health Check:** `http://44.216.9.251:3000/`
- **With Nginx:** `http://44.216.9.251/api` (port 80)

### AWS EC2 Details
```
Instance ID    : i-00822e43a0feb1580
Instance Type  : t2.micro (Free Tier)
Region         : us-east-1a
OS             : Ubuntu Server 22.04 LTS
Public IP      : 52.54.90.6
Storage        : 8GB gp2
```

### Elastic IP (Static Public IP)

Elastic IP (EIP) telah dialokasikan dan di-associate ke EC2 instance untuk memastikan alamat publik tidak berubah saat instance direstart.  
- **Elastic IP:** `44.216.9.251`  
- **Associated Instance ID:** `i-00822e43a0feb1580`  
- **Kegunaan:** Memastikan endpoint publik tetap stabil (baik untuk dokumentasi, DNS A record, SSL/TLS issuance, dan URL production).  
- **Verifikasi di server:** jalankan `curl ifconfig.me` → hasil harus `44.216.9.251`.  
- **Catatan biaya:** AWS mengenakan biaya bila Elastic IP dialokasikan tetapi **tidak attached** ke instance. Lepaskan (Release) EIP jika sudah tidak digunakan untuk menghindari biaya.

**Rekomendasi:** Gunakan Elastic IP ini sebagai A record untuk domain produksi (mis. `api.example.com`) agar lebih profesional dan mudah berpindah server di masa depan.


### Test Credentials
```
Admin:
- Email: admin@restaurant.com
- Password: password123

Staff:
- Email: staff@restaurant.com
- Password: password123

Customer:
- Email: customer1@example.com
- Password: password123
```

---

## Step-by-Step Deployment

### 1. Persiapan AWS EC2 Instance

#### 1.1 Login ke AWS Academy
1. Buka AWS Academy Learner Lab
2. Klik **Start Lab** dan tunggu hingga status hijau
3. Klik **AWS** untuk membuka AWS Console

#### 1.2 Launch EC2 Instance
1. Di AWS Console, cari dan buka **EC2**
2. Klik **Launch Instance**
3. Konfigurasi instance:
   ```
   Name                 : restaurant-api-server
   OS                   : Ubuntu Server 22.04 LTS (64-bit x86)
   Instance Type        : t2.micro
   Key Pair             : Create new atau gunakan existing
                          (Download .pem file dan simpan dengan aman!)
   ```

4. **Configure Security Group:**
   - Klik **Edit** di Network Settings
   - Add rules berikut:

   | Type        | Protocol | Port Range | Source    | Description          |
   |-------------|----------|------------|-----------|----------------------|
   | SSH         | TCP      | 22         | 0.0.0.0/0 | SSH access           |
   | HTTP        | TCP      | 80         | 0.0.0.0/0 | HTTP access          |
   | Custom TCP  | TCP      | 3000       | 0.0.0.0/0 | Node.js app          |

5. **Storage:** 8 GB gp2 (default sudah cukup)
6. Klik **Launch Instance**
7. Tunggu hingga **Instance State** = running (hijau)

#### 1.3 Catat Informasi Instance
Setelah instance running, catat:
- **Public IPv4 address** (contoh: 54.123.45.67)
- **Public IPv4 DNS** (contoh: ec2-54-123-45-67.compute-1.amazonaws.com)
- **Instance ID** (contoh: i-0123456789abcdef)

---

### 2. Koneksi ke EC2 Instance

#### 2.1 Set Permission Key File (Local Terminal)
```bash
# Mac
chmod 400 ~/.ssh/restaurant-api-key.pem 

```

#### 2.2 SSH ke EC2
```bash
ssh -i ~/.ssh/restaurant-api-key.pem ubuntu@44.216.9.251
```

Contoh:
```bash
ssh -i ~/.ssh/restaurant-api-key.pem ubuntu@44.216.9.251
```

Ketik `yes` kalau diminta confirm connection.

---

### 3. Setup Environment di EC2

#### 3.1 Update Sistem
```bash
sudo apt update
sudo apt upgrade -y
```

#### 3.2 Install Node.js (v20.x)
```bash
# Install Node.js repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js dan npm
sudo apt install -y nodejs

# Verifikasi instalasi
node --version   # Output: v20.x.x
npm --version    # Output: 10.x.x
```

#### 3.3 Install Git
```bash
sudo apt install -y git

# Verifikasi
git --version
```

#### 3.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Verifikasi
pm2 --version
```

#### 3.5 Install Nginx (Opsional - Recommended)
```bash
sudo apt install -y nginx

# Verifikasi
nginx -v

# Enable dan start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

### 4. Clone dan Setup Aplikasi

#### 4.1 Clone Repository
```bash
# Clone dari GitHub
git clone https://github.com/Ikrar06/restaurant-api.git

# Masuk ke folder project
cd restaurant-api
```

#### 4.2 Install Dependencies
```bash
npm install
```

Tunggu hingga selesai (biasanya 1-2 menit).

#### 4.3 Setup Environment Variables
```bash
# Copy template .env
cp .env.example .env

# Edit file .env
nano .env
```

Isi dengan nilai production (PENTING: ganti dengan nilai yang aman!):
```env
NODE_ENV=production
PORT=3000

# Database (SQLite untuk simplicity)
DATABASE_URL="file:./prod.db"

# JWT Secrets (GANTI dengan random string minimum 32 karakter!)
JWT_SECRET=your-super-secure-production-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secure-production-refresh-secret-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# CORS (ganti dengan domain frontend jika ada)
ALLOWED_ORIGINS=http://44.216.9.251,http://44.216.9.251:3000
```

**Save:** Ctrl+O, Enter, Ctrl+X

> **Catatan Keamanan:** Jangan gunakan secret yang sama dengan development!

---

### 4.4 Setup PostgreSQL (Opsional)

Secara default, aplikasi menggunakan SQLite. Untuk menggunakan PostgreSQL:

#### 4.4.1 Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Verifikasi installation
psql --version
```

#### 4.4.2 Konfigurasi PostgreSQL
```bash
# Login sebagai postgres user
sudo -i -u postgres psql

# Di dalam PostgreSQL shell, jalankan commands berikut:
# 1. Buat database baru
CREATE DATABASE restaurant_db;

# 2. Buat user baru
CREATE USER restaurant_user WITH ENCRYPTED PASSWORD 'RestaurantDB2025SecurePassword';;

# 3. Berikan privileges
GRANT ALL PRIVILEGES ON DATABASE restaurant_db TO restaurant_user;

# 4. Exit PostgreSQL shell
\q
```

#### 4.4.3 Update Environment Variables
Edit file `.env` dan ubah DATABASE_URL:
```bash
nano .env
```

Ganti DATABASE_URL dari SQLite ke PostgreSQL:
```env
# Ganti baris DATABASE_URL menjadi:
DATABASE_URL="postgresql://restaurant_user:RestaurantDB2025SecurePassword@localhost:5432/restaurant_db?schema=public"
```

#### 4.4.4 Update Prisma Schema
Edit file `prisma/schema.prisma`:
```bash
nano prisma/schema.prisma
```

Ubah provider dari `sqlite` ke `postgresql`:
```prisma
datasource db {
  provider = "postgresql"  // Ubah dari "sqlite"
  url      = env("DATABASE_URL")
}
```

**Save:** Ctrl+O, Enter, Ctrl+X

---

### 5. Setup Database

#### 5.1 Generate Prisma Client
```bash
npx prisma generate
```

#### 5.2 Run Migrations
```bash
npx prisma migrate deploy
```

Jika error "no migration found", jalankan:
```bash
npx prisma migrate dev --name init
```

#### 5.3 Seed Database (Opsional)
```bash
npm run seed
```

Output yang benar:
```
Starting seed...
Cleared existing data
Created users, categories, menu items, tables, orders, and reviews
Seed completed successfully!
```

---

### 6. Start Aplikasi dengan PM2

#### 6.1 Start dengan PM2
```bash
pm2 start src/index.js --name restaurant-api
```

#### 6.2 Setup Auto-Start on Reboot
```bash
# Generate startup script
pm2 startup

# Jalankan command yang muncul (copy-paste output di atas)
# Contoh: sudo env PATH=$PATH:/usr/bin...

# Save PM2 process list
pm2 save
```

#### 6.3 Verifikasi Status
```bash
pm2 status
```

Output yang benar:
```
┌────┬─────────────────┬─────────┬─────────┬───────┐
│ id │ name            │ status  │ restart │ uptime│
├────┼─────────────────┼─────────┼─────────┼───────┤
│ 0  │ restaurant-api  │ online  │ 0       │ 5s    │
└────┴─────────────────┴─────────┴─────────┴───────┘
```

---

### 7. Konfigurasi Nginx (Opsional - Recommended)

Nginx berfungsi sebagai reverse proxy agar:
- Akses tanpa port `:3000` (langsung port 80)
- Load balancing capability
- SSL/TLS termination (untuk HTTPS nanti)
- Better security

#### 7.1 Buat File Konfigurasi
```bash
sudo nano /etc/nginx/sites-available/restaurant-api
```

Isi dengan:
```nginx
server {
    listen 80;
    server_name 44.216.9.251;

    # Logging
    access_log /var/log/nginx/restaurant-api-access.log;
    error_log /var/log/nginx/restaurant-api-error.log;

    # Proxy ke Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save:** Ctrl+O, Enter, Ctrl+X

#### 7.2 Enable Site
```bash
# Buat symbolic link
sudo ln -s /etc/nginx/sites-available/restaurant-api /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t
```

Output yang benar:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

#### 7.3 Restart Nginx
```bash
sudo systemctl restart nginx
```

---

## Verifikasi Deployment

### 8.1 Test Health Check
```bash
# Dari EC2 terminal
curl http://localhost:3000/

# Dari browser/local terminal
curl http://44.216.9.251:3000/
```

Expected response:
```json
{
  "message": "Restaurant API is running"
}
```

### 8.2 Test dengan Nginx (jika sudah setup)
```bash
curl http://44.216.9.251/
```

### 8.3 Test Authentication
```bash
# Register user baru
curl -X POST http://44.216.9.251:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://44.216.9.251:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "password123"
  }'
```

### 8.4 Test API Endpoints
Gunakan Postman atau REST Client dengan base URL:
```
http://44.216.9.251:3000/api
```

Test endpoints:
- GET `/categories` - Harus return list categories
- GET `/menu-items` - Harus return list menu items
- POST `/auth/login` - Harus return tokens

---

## Monitoring

### Check PM2 Status
```bash
pm2 status           # Lihat status aplikasi
pm2 logs             # Lihat logs real-time (Ctrl+C untuk keluar)
pm2 logs --lines 100 # Lihat 100 baris terakhir
pm2 monit            # Monitor CPU dan memory
```

### Check Application Logs
```bash
# Logs dari aplikasi (file logger)
cat ~/restaurant-api/logs/access.log
cat ~/restaurant-api/logs/error.log

# Tail logs (live)
tail -f ~/restaurant-api/logs/access.log
```

### Check Nginx Logs (jika pakai Nginx)
```bash
sudo tail -f /var/log/nginx/restaurant-api-access.log
sudo tail -f /var/log/nginx/restaurant-api-error.log
```

### Check System Resources
```bash
# CPU dan Memory usage
top

# Disk usage
df -h

# Memory details
free -m
```

---

## Troubleshooting

### Issue: Port 3000 sudah digunakan
**Gejala:** Error `EADDRINUSE: address already in use`

**Solusi:**
```bash
# Cari process yang pakai port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 PID_NUMBER

# Atau restart PM2
pm2 restart restaurant-api
```

---

### Issue: PM2 tidak start setelah reboot
**Gejala:** Setelah reboot EC2, aplikasi tidak jalan

**Solusi:**
```bash
# Cek PM2 status
pm2 status

# Jika kosong, startup belum di-setup
pm2 startup
pm2 save
```

---

### Issue: Cannot connect to EC2
**Gejala:** SSH atau HTTP timeout

**Solusi:**
1. Cek Security Group di AWS Console
2. Pastikan port 22 (SSH) dan 3000/80 (HTTP) terbuka
3. Cek apakah instance masih running (bukan stopped)
4. Cek apakah Public IP benar

---

### Issue: Database migration failed
**Gejala:** Error saat `prisma migrate`

**Solusi:**
```bash
# Reset database (DEVELOPMENT ONLY!)
npx prisma migrate reset

# Atau hapus database dan migrate ulang
rm prod.db
npx prisma migrate deploy
npm run seed
```

---

### Issue: Nginx 502 Bad Gateway
**Gejala:** Nginx return error 502

**Solusi:**
```bash
# Cek apakah Node.js app jalan
pm2 status

# Jika stopped, start lagi
pm2 start restaurant-api

# Cek Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

### Issue: Permission denied untuk logs/
**Gejala:** Error writing to log files

**Solusi:**
```bash
# Buat folder logs manual
mkdir -p ~/restaurant-api/logs

# Set permission
chmod 755 ~/restaurant-api/logs

# Restart app
pm2 restart restaurant-api
```

---

## Maintenance & Updates

### Update Aplikasi
```bash
# SSH ke EC2
ssh -i ~/.ssh/restaurant-api-key.pem ubuntu@44.216.9.251

# Masuk ke folder project
cd restaurant-api

# Pull perubahan terbaru dari GitHub
git pull origin main

# Install dependencies baru (jika ada)
npm install

# Run migrations baru (jika ada)
npx prisma migrate deploy

# Restart aplikasi
pm2 restart restaurant-api

# Verifikasi
pm2 status
pm2 logs --lines 50
```

---

### Backup Database
```bash
# Backup file SQLite
cp prod.db prod.db.backup-$(date +%Y%m%d)

# Atau download ke local
# Dari local terminal:
scp -i ~/.ssh/restaurant-api-key.pem ubuntu@44.216.9.251:~/restaurant-api/prod.db ./backup/
```

---

### Restore Database
```bash
# Restore dari backup
cp prod.db.backup-YYYYMMDD prod.db

# Restart aplikasi
pm2 restart restaurant-api
```

---

### Clean Up Logs
```bash
# Hapus log lama
cd ~/restaurant-api/logs
rm access.log error.log

# Atau truncate (kosongkan tanpa hapus file)
> access.log
> error.log

# PM2 logs
pm2 flush
```

---

## Security Best Practices

### 1. Environment Variables
- Gunakan JWT secrets yang kuat (min 32 karakter random)
- Berbeda dari development
- Tidak pernah commit `.env` ke Git

### 2. Database
- Regular backup
- Set permission file database (chmod 600)

### 3. SSH
- Simpan key pair (.pem) dengan aman
- Jangan share key pair
- Set permission 400 untuk key file

### 4. API
- Rate limiting sudah aktif
- Helmet.js security headers aktif
- CORS configured untuk origin yang diizinkan

---

## Checklist Deployment

Sebelum submit, pastikan:

- [ ] EC2 instance running dan accessible
- [ ] Node.js, npm, git, PM2 terinstall
- [ ] Repository ter-clone dengan benar
- [ ] File `.env` production sudah dikonfigurasi
- [ ] Database migrations berhasil
- [ ] Seeder berhasil (test credentials tersedia)
- [ ] PM2 running dengan auto-restart
- [ ] Health check endpoint (`/`) merespons
- [ ] Login endpoint (`/api/auth/login`) berfungsi
- [ ] Test semua CRUD endpoints berfungsi
- [ ] Nginx configured (opsional)
- [ ] Logs directory writeable
- [ ] Security Group configured dengan benar
- [ ] Public IP documented
- [ ] Test credentials documented

---

## Support

Jika ada masalah:
1. Cek logs: `pm2 logs`
2. Cek status: `pm2 status`
3. Cek dokumentasi: README.md, API-DOCS.md
4. Cek GitHub Issues: https://github.com/Ikrar06/restaurant-api/issues

---

## Important Notes

- **AWS Academy Lab:** Instance akan berhenti otomatis setelah 4 jam. Pastikan Stop Lab dan Start Lab lagi saat perlu testing.
- **Public IP:** IP bisa berubah saat stop/start instance. Update documentation jika berubah.
- **Costs:** t2.micro free tier mencakup 750 jam/bulan. Jangan lupa stop instance saat tidak digunakan.
- **Persistence:** Data di instance akan hilang jika terminate instance. Backup penting!

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** December 2025
**Author:** Ikrar Gempur Tirani - D121231015
