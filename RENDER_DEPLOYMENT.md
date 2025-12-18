# Render.com Deployment Guide - Restaurant API

Panduan lengkap deploy REST API ke Render.com untuk 24/7 uptime (GRATIS dengan keep-alive workaround).

---

## 📋 Informasi

### Repository
- **GitHub:** https://github.com/Ikrar06/restaurant-api
- **Branch:** main

### Stack
- **Platform:** Render.com (Free Tier)
- **Runtime:** Node.js 20.x
- **Database:** PostgreSQL (Render Free - 90 hari)
- **ORM:** Prisma
- **Keep-Alive:** UptimeRobot

---

## ✅ Persiapan (Dilakukan)

File-file berikut sudah disiapkan:

- ✅ `render.yaml` - Konfigurasi infrastructure as code
- ✅ `prisma/schema.prisma` - Diupdate ke PostgreSQL
- ✅ `package.json` - Ditambahkan build & postinstall scripts

---

## 🚀 Step-by-Step Deployment

### Step 1: Push ke GitHub

**1.1 Commit perubahan:**
```bash
cd restaurant-api

# Add semua perubahan
git add .

# Commit
git commit -m "feat: add Render.com deployment configuration"

# Push ke GitHub
git push origin main
```

**Catatan:** Pastikan file `.env` TIDAK ter-commit (sudah ada di `.gitignore`).

---

### Step 2: Setup Render.com

**2.1 Buat Akun Render:**
1. Buka [render.com](https://render.com)
2. Klik **Get Started for Free**
3. Sign up dengan **GitHub account** (recommended)
4. Authorize Render untuk akses GitHub repos

**2.2 Connect Repository:**
1. Di Render Dashboard, klik **New +** → **Blueprint**
2. Pilih **Connect a repository**
3. Cari dan pilih repo: `Ikrar06/restaurant-api`
4. Klik **Connect**

**2.3 Render akan Auto-Detect `render.yaml`:**
- Render akan membaca `render.yaml` dan setup otomatis:
  - ✅ Web Service: `restaurant-api`
  - ✅ PostgreSQL Database: `restaurant-db`
  - ✅ Environment variables

**2.4 Review & Deploy:**
1. Review konfigurasi yang terdeteksi
2. Klik **Apply** untuk mulai deployment
3. Tunggu proses build & deploy (~5-10 menit):
   ```
   → Installing dependencies...
   → Running build command...
   → Generating Prisma Client...
   → Running migrations...
   → Starting application...
   ✓ Live!
   ```

**2.5 Catat URL Production:**
- Render akan memberikan URL seperti:
  ```
  https://restaurant-api-xxxx.onrender.com
  ```
- Catat URL ini untuk UptimeRobot nanti!

---

### Step 3: Setup Database & Seed Data

**3.1 Akses Shell di Render:**
1. Di Render Dashboard, buka service **restaurant-api**
2. Klik tab **Shell** di menu atas
3. Tunggu shell terbuka

**3.2 Run Seed (Optional):**
```bash
# Di Render Shell
npm run seed
```

Expected output:
```
Starting seed...
Cleared existing data
Created users, categories, menu items, tables, orders, and reviews
Seed completed successfully!
```

**3.3 Test Credentials:**
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

### Step 4: Verifikasi Deployment

**4.1 Test Health Check:**
```bash
# Dari local terminal
curl https://restaurant-api-xxxx.onrender.com/

# Expected response:
# {"message":"Restaurant API is running"}
```

**4.2 Test Login Endpoint:**
```bash
curl -X POST https://restaurant-api-xxxx.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "password123"
  }'

# Expected: Return access_token & refresh_token
```

**4.3 Test API dengan Postman:**
- Base URL: `https://restaurant-api-xxxx.onrender.com/api`
- Test endpoints:
  - GET `/categories`
  - GET `/menu-items`
  - POST `/auth/login`

---

## 🔄 Setup UptimeRobot (Keep-Alive)

**Masalah:** Render free tier sleep setelah 15 menit inactive.
**Solusi:** Ping app setiap 5 menit dengan UptimeRobot.

### Step 5: Setup UptimeRobot

**5.1 Buat Akun:**
1. Buka [uptimerobot.com](https://uptimerobot.com)
2. Klik **Register for FREE**
3. Sign up dengan email atau Google
4. Verify email

**5.2 Add Monitor:**
1. Di Dashboard, klik **+ Add New Monitor**
2. Isi form:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: Restaurant API
   URL (or IP): https://restaurant-api-xxxx.onrender.com/
   Monitoring Interval: Every 5 minutes
   ```
3. (Optional) Alert Contacts:
   - Email notification jika app down
4. Klik **Create Monitor**

**5.3 Verifikasi:**
- Monitor status harus **Up**
- Check log di Render: kamu akan lihat ping setiap 5 menit dari UptimeRobot

**Result:** 🎉 **App tidak akan sleep lagi!**

---

## 📊 Monitoring & Logs

### View Logs di Render:
1. Buka service **restaurant-api**
2. Klik tab **Logs**
3. Real-time logs akan muncul

### View Metrics di Render:
1. Klik tab **Metrics**
2. Lihat:
   - CPU usage
   - Memory usage
   - Request count
   - Response time

### View Uptime di UptimeRobot:
1. Dashboard UptimeRobot
2. Lihat:
   - Uptime percentage (harus 100%)
   - Response time
   - Down events (seharusnya 0)

---

## 🔧 Troubleshooting

### Issue: Build Failed

**Gejala:** Deployment gagal saat build

**Solusi:**
```bash
# Cek logs di Render
# Biasanya karena:

1. Dependencies error:
   - Pastikan package.json valid
   - Run `npm install` di local dulu

2. Prisma generate error:
   - Pastikan schema.prisma valid
   - Cek DATABASE_URL sudah tersedia

3. Node version mismatch:
   - Render pakai Node 20.x by default
   - Pastikan compatible
```

---

### Issue: Database Connection Failed

**Gejala:** Error "Can't reach database server"

**Solusi:**
1. Cek environment variable `DATABASE_URL`:
   ```bash
   # Di Render Dashboard → Environment
   # Pastikan DATABASE_URL terisi otomatis dari database
   ```

2. Restart service:
   - Klik **Manual Deploy** → **Deploy latest commit**

---

### Issue: App Sleep Tetap Terjadi

**Gejala:** First request lambat (cold start)

**Solusi:**
1. Cek UptimeRobot monitor aktif
2. Pastikan interval 5 menit (bukan 30 menit)
3. Cek log Render: harus ada request dari UptimeRobot setiap 5 menit

---

### Issue: Migration Failed

**Gejala:** Error "Migration ... failed to apply"

**Solusi:**
```bash
# Opsi 1: Reset database (DEVELOPMENT ONLY!)
# Di Render Shell:
npx prisma migrate reset

# Opsi 2: Manual migrate
npx prisma migrate deploy

# Opsi 3: Force migrate
npx prisma db push
```

---

## 🔄 Update & Maintenance

### Deploy Update Terbaru:

**Auto-deploy sudah aktif!** Setiap push ke `main` branch akan auto-deploy.

```bash
# Local:
git add .
git commit -m "feat: add new feature"
git push origin main

# Render akan auto-deploy dalam ~5 menit
```

### Manual Deploy:
1. Render Dashboard → Service
2. Klik **Manual Deploy**
3. Pilih **Deploy latest commit**

### Rollback ke Version Sebelumnya:
1. Klik tab **Events**
2. Cari deploy yang sukses sebelumnya
3. Klik **Rollback to this version**

---

## 📦 Database Management

### Backup Database:

**Via Render UI:**
1. Dashboard → Database `restaurant-db`
2. Klik **Backups**
3. Klik **Create Backup**

**Via CLI (Advanced):**
```bash
# Install Render CLI
npm install -g @render.com/cli

# Backup
render db:backup restaurant-db
```

### Export Data:
```bash
# Via Render Shell
npx prisma db pull  # Download schema
npx prisma db seed  # Re-seed if needed
```

---

## ⚠️ Limitasi Free Tier

### Render Free Tier Limits:
- ✅ 750 jam/bulan (cukup 24/7 untuk 1 app)
- ✅ 512 MB RAM
- ✅ Shared CPU
- ⚠️ Spin down after 15 min inactive (solve dengan UptimeRobot)
- ⚠️ Build time max 15 menit
- ⚠️ Bandwidth limited

### PostgreSQL Free Tier:
- ✅ 1 GB storage
- ✅ 97 connection limit
- ⚠️ **Expire setelah 90 hari!**
- ⚠️ Setelah 90 hari: upgrade ($7/month) atau migrate database

**Solusi setelah 90 hari:**
- **Option 1:** Upgrade Render DB ($7/month)
- **Option 2:** Migrate ke database gratis lain:
  - [Neon.tech](https://neon.tech) - PostgreSQL gratis 0.5GB
  - [Supabase](https://supabase.com) - PostgreSQL gratis 500MB
  - [ElephantSQL](https://elephantsql.com) - PostgreSQL gratis 20MB

---

## 🎯 Checklist Production

Sebelum go-live, pastikan:

- [x] Deployment sukses di Render
- [x] Database migrations applied
- [x] Seeder data loaded (test credentials)
- [x] Health check endpoint works
- [x] Login endpoint works
- [x] All CRUD endpoints tested
- [x] UptimeRobot monitor aktif
- [x] Monitor status: Up
- [x] Logs clean (no critical errors)
- [x] Environment variables configured
- [x] Auto-deploy dari GitHub aktif
- [ ] Custom domain (optional)
- [ ] SSL certificate (auto by Render)

---

## 🔐 Security Notes

### Environment Variables:
- JWT secrets auto-generated oleh Render (aman)
- Tidak pernah hardcode secrets di code
- `.env` tidak pernah commit ke Git

### Database:
- Connection string secure (via Render internal network)
- Database tidak publicly accessible
- Regular backups recommended

### API:
- ✅ Rate limiting aktif
- ✅ Helmet.js security headers
- ✅ CORS configured
- ✅ HTTPS by default (Render)

---

## 📈 Production URLs

### Base URLs:
```
API Base URL: https://restaurant-api-xxxx.onrender.com/api
Health Check: https://restaurant-api-xxxx.onrender.com/
Documentation: https://github.com/Ikrar06/restaurant-api
```

### Test dengan cURL:
```bash
# Health check
curl https://restaurant-api-xxxx.onrender.com/

# Login
curl -X POST https://restaurant-api-xxxx.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"password123"}'

# Get categories (public)
curl https://restaurant-api-xxxx.onrender.com/api/categories

# Get menu items (public)
curl https://restaurant-api-xxxx.onrender.com/api/menu-items
```

---

## 📞 Support

**Render Documentation:**
- https://render.com/docs

**Prisma Documentation:**
- https://www.prisma.io/docs

**UptimeRobot Documentation:**
- https://uptimerobot.com/help/

**Project Issues:**
- https://github.com/Ikrar06/restaurant-api/issues

---

## 🎉 Summary

### What You Get:
✅ **100% GRATIS hosting** (dengan batasan wajar)
✅ **24/7 uptime** (dengan UptimeRobot)
✅ **Auto-deploy** dari GitHub
✅ **PostgreSQL database** gratis 90 hari
✅ **HTTPS/SSL** otomatis
✅ **Monitoring** gratis via UptimeRobot
✅ **Professional URL** (.onrender.com)

### Total Setup Time:
- Render setup: **~10 menit**
- UptimeRobot setup: **~5 menit**
- **Total: ~15 menit** 🚀

---

**Deployment Guide Version:** 1.0.0
**Last Updated:** December 2024
**Platform:** Render.com + UptimeRobot
**Author:** Ikrar Gempur Tirani - D121231015
