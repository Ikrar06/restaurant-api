# Restaurant Management System API

Backend API untuk sistem manajemen restoran.

## Fitur

- Authentication & Authorization
- Menu Management
- Order Processing
- Table Management
- Customer Reviews

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- SQLite (development)
- JWT Authentication

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` ke `.env` dan sesuaikan konfigurasi.

## Database Setup

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Run Development

```bash
npm run dev
```

## API Documentation

Lihat dokumentasi lengkap di `API-DOCS.md` (akan dibuat nanti).
