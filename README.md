# Restaurant Management System API

Backend API untuk sistem manajemen restoran yang lengkap dengan fitur order management, menu management, table reservations, dan customer reviews.

## Features

### Core Features
- Authentication & Authorization dengan JWT
- Role-Based Access Control (Customer, Staff, Admin)
- Menu Management dengan categories
- Order Processing (Dine-in, Takeaway, Delivery)
- Table Management dengan real-time status
- Customer Review System dengan rating
- Advanced filtering, searching, sorting, dan pagination

### Technical Features
- Input validation dengan Zod
- Password hashing dengan bcrypt
- JWT access & refresh tokens
- Comprehensive error handling
- Request logging
- Rate limiting
- Security headers dengan Helmet
- CORS configuration
- Response compression

## Tech Stack

- Node.js v20.x
- Express.js
- Prisma ORM
- SQLite (development) / PostgreSQL (production)
- JWT (jsonwebtoken)
- bcrypt
- Zod

## Database Schema

### Entities & Relationships

**User**
- Fields: id, email, password, name, phone, role
- Relations: orders, reviews

**Category**
- Fields: id, name, description, imageUrl
- Relations: menuItems

**MenuItem**
- Fields: id, name, description, price, imageUrl, categoryId, isAvailable, preparationTime
- Relations: category, orderItems, reviews

**Table**
- Fields: id, tableNumber (Int), capacity, location (INDOOR/OUTDOOR/VIP), status
- Relations: orders

**Order**
- Fields: id, orderNumber, userId, tableId, orderType (DINE_IN/TAKEAWAY/DELIVERY), status, totalAmount, notes
- Relations: user, table, orderItems

**OrderItem**
- Fields: id, orderId, menuItemId, quantity, price, subtotal, notes
- Relations: order, menuItem

**Review**
- Fields: id, userId, menuItemId, rating, comment
- Relations: user, menuItem

### Key Relationships
- User → Orders (one-to-many)
- User → Reviews (one-to-many)
- Category → MenuItems (one-to-many)
- Table → Orders (one-to-many)
- MenuItem → Reviews (one-to-many)
- Order → OrderItems (one-to-many)
- MenuItem ↔ Order (many-to-many via OrderItem)

## Getting Started

### Prerequisites
- Node.js v18.x or higher
- npm or yarn
- Git

### Installation

1. Clone repository
```bash
git clone <your-repo-url>
cd restaurant-api
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

Edit .env file:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-characters
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

4. Generate Prisma Client
```bash
npx prisma generate
```

5. Run database migrations
```bash
npx prisma migrate dev
```

6. Seed database
```bash
npm run seed
```

7. Start development server
```bash
npm run dev
```

API akan berjalan di: http://localhost:3000

## Project Structure

```
restaurant-api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── src/
│   ├── config/
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── menuItemController.js
│   │   ├── tableController.js
│   │   ├── orderController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validate.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── rateLimiter.js
│   │   ├── security.js
│   │   ├── corsConfig.js
│   │   └── compressionMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── menuItemRoutes.js
│   │   ├── tableRoutes.js
│   │   ├── orderRoutes.js
│   │   └── reviewRoutes.js
│   ├── validators/
│   │   ├── authValidation.js
│   │   ├── categoryValidation.js
│   │   ├── menuItemValidation.js
│   │   ├── tableValidation.js
│   │   ├── orderValidation.js
│   │   └── reviewValidation.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── password.js
│   └── index.js
├── tests/
│   └── restaurant-api.http
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── API-DOCS.md
└── DEPLOYMENT.md
```

## Available Scripts

### Development
```bash
npm run dev
```
Server akan restart otomatis ketika ada perubahan file.

### Production
```bash
npm start
```

### Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Run migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Seed database
npm run seed

# Open Prisma Studio
npx prisma studio
```

## API Documentation

Detailed API documentation tersedia di [API-DOCS.md](./API-DOCS.md)

### Quick Reference

**Base URL:** http://localhost:3000/api
**Production URL:** http://52.54.90.6/api

**Authentication Endpoints:**
- POST /auth/register - Register user baru
- POST /auth/login - Login & get tokens
- POST /auth/refresh - Refresh access token
- GET /auth/me - Get user profile

**Resource Endpoints:**
- /categories - Menu categories management
- /menu-items - Menu items management
- /tables - Table management
- /orders - Order processing
- /reviews - Customer reviews

## Test Credentials

Setelah menjalankan seeder, gunakan credentials berikut:

**Admin Account:**
- Email: admin@restaurant.com
- Password: password123
- Role: ADMIN

**Staff Account:**
- Email: staff@restaurant.com
- Password: password123
- Role: STAFF

**Customer Account:**
- Email: customer1@example.com
- Password: password123
- Role: CUSTOMER

## Testing

### Manual Testing
Gunakan file `tests/restaurant-api.http` dengan REST Client extension di VS Code.

### Health Check
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "message": "Restaurant API is running"
}
```

## Key Features Explained

### Order Flow
1. Customer creates order → status: **PENDING**
2. Staff confirms order → status: **CONFIRMED**
3. Kitchen prepares order → status: **PREPARING**
4. Order ready → status: **READY**
5. Order completed → status: **COMPLETED**
6. Atau di-cancel → status: **CANCELLED**

**Rules:**
- Customer hanya bisa cancel order dengan status PENDING
- Staff bisa update status sesuai flow atau cancel kapan saja
- Admin sama seperti Staff

### Review System
- User harus punya completed order dengan menu item tersebut
- Satu user hanya bisa review satu menu item sekali
- Owner dapat update/delete own reviews
- Admin dapat delete any review

### Table Management
- Status auto-update based on orders
- AVAILABLE → OCCUPIED (saat order DINE_IN created)
- OCCUPIED → AVAILABLE (saat order COMPLETED/CANCELLED)

## Deployment

Deployment guide lengkap tersedia di [DEPLOYMENT.md](./DEPLOYMENT.md)

## Author

Ikrar Gempur Tirani - D121231015
- GitHub: https://github.com/Ikrar06
