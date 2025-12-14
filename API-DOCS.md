# API Documentation

Dokumentasi lengkap untuk semua endpoint API Restaurant Management System.

## Base URL
```
http://44.216.9.251/api
```

## Response Format

Semua response menggunakan format JSON dengan struktur:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

## Authentication

### Register User
Mendaftarkan user baru.

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "081234567890",
      "role": "CUSTOMER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validasi:**
- name: minimal 2 karakter
- email: format email valid
- password: minimal 6 karakter
- phone: opsional, 10-15 digit

---

### Login
Login dan mendapatkan access token + refresh token.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "admin@restaurant.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@restaurant.com",
      "role": "ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Refresh Token
Mendapatkan access token baru menggunakan refresh token.

**Endpoint:** `POST /auth/refresh`

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Profile
Mendapatkan data profile user yang sedang login.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@restaurant.com",
      "phone": "081234567890",
      "role": "ADMIN",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## Categories

### Get All Categories
Mendapatkan semua kategori dengan pagination dan filter.

**Endpoint:** `GET /categories`

**Query Parameters:**
- `page` (number, default: 1) - Halaman
- `limit` (number, default: 10) - Jumlah data per halaman
- `search` (string) - Cari berdasarkan nama
- `sortBy` (string: name|createdAt|updatedAt, default: name) - Sort berdasarkan field
- `order` (string: asc|desc, default: asc) - Urutan sorting

**Example:**
```
GET /categories?page=1&limit=5&search=main&sortBy=name&order=asc
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Main Course",
      "description": "Main dishes",
      "imageUrl": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "menuItems": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 10,
    "totalPages": 2
  }
}
```

---

### Get Category by ID
Mendapatkan detail kategori berdasarkan ID.

**Endpoint:** `GET /categories/:id`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Main Course",
    "description": "Main dishes",
    "imageUrl": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "menuItems": [
      {
        "id": 1,
        "name": "Nasi Goreng",
        "description": "Fried rice with chicken",
        "price": 25000,
        "imageUrl": null,
        "categoryId": 1,
        "isAvailable": true,
        "preparationTime": 15,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

---

### Create Category
Membuat kategori baru. (ADMIN only)

**Endpoint:** `POST /categories`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "name": "Beverages",
  "description": "All drinks"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": 5,
      "name": "Beverages",
      "description": "All drinks",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Validasi:**
- name: 2-100 karakter, harus unik
- description: opsional, maksimal 500 karakter

---

### Update Category
Mengupdate kategori. (ADMIN only)

**Endpoint:** `PUT /categories/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "name": "Hot Beverages",
  "description": "Hot drinks only"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "id": 5,
      "name": "Hot Beverages",
      "description": "Hot drinks only",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  }
}
```

---

### Delete Category
Menghapus kategori. (ADMIN only)

**Endpoint:** `DELETE /categories/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Cannot delete category with existing menu items"
}
```

---

## Menu Items

### Get All Menu Items
Mendapatkan semua menu dengan pagination, filter, dan rating.

**Endpoint:** `GET /menu-items`

**Query Parameters:**
- `page` (number, default: 1) - Halaman
- `limit` (number, default: 10) - Jumlah data per halaman
- `search` (string) - Cari berdasarkan nama atau deskripsi
- `categoryId` (number) - Filter berdasarkan kategori
- `isAvailable` (boolean) - Filter menu yang tersedia (true/false)
- `minPrice` (number) - Harga minimum
- `maxPrice` (number) - Harga maksimum
- `sortBy` (string: name|price|createdAt, default: name) - Sort berdasarkan field
- `order` (string: asc|desc, default: asc) - Urutan sorting

**Example:**
```
GET /menu-items?categoryId=1&isAvailable=true&minPrice=10000&maxPrice=50000&sortBy=price&order=asc
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
      {
        "id": 1,
        "name": "Nasi Goreng",
        "description": "Fried rice with chicken",
        "price": 25000,
        "categoryId": 1,
        "isAvailable": true,
        "preparationTime": 15,
        "imageUrl": "https://example.com/image.jpg",
        "avgRating": 4.5,
        "reviewCount": 10,
        "category": {
          "id": 1,
          "name": "Main Course"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

### Get Menu Item by ID
Mendapatkan detail menu berdasarkan ID.

**Endpoint:** `GET /menu-items/:id`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nasi Goreng",
    "description": "Fried rice with chicken",
    "price": 25000,
    "categoryId": 1,
    "isAvailable": true,
    "preparationTime": 15,
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Main Course",
      "description": "Main dishes",
      "imageUrl": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "reviews": [
      {
        "id": 1,
        "userId": 3,
        "menuItemId": 1,
        "rating": 5,
        "comment": "Sangat enak!",
        "createdAt": "2024-01-01T15:00:00.000Z",
        "updatedAt": "2024-01-01T15:00:00.000Z",
        "user": {
          "name": "Customer One",
          "email": "customer1@example.com"
        }
      }
    ],
    "avgRating": 4.5,
    "reviewCount": 10
  }
}
```

---

### Create Menu Item
Membuat menu baru. (ADMIN/STAFF only)

**Endpoint:** `POST /menu-items`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "name": "Mie Goreng",
  "description": "Fried noodles",
  "price": 20000,
  "categoryId": 1,
  "isAvailable": true,
  "preparationTime": 10,
  "imageUrl": "https://example.com/mie.jpg"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "menuItem": {
      "id": 10,
      "name": "Mie Goreng",
      "description": "Fried noodles",
      "price": 20000,
      "categoryId": 1,
      "isAvailable": true,
      "preparationTime": 10,
      "imageUrl": "https://example.com/mie.jpg"
    }
  }
}
```

**Validasi:**
- name: 2-200 karakter
- description: wajib, maksimal 1000 karakter
- price: minimum 0
- categoryId: harus ada di database
- isAvailable: boolean, default true
- preparationTime: number (dalam menit), wajib
- imageUrl: opsional, format URL valid

---

### Update Menu Item
Mengupdate menu. (ADMIN/STAFF only)

**Endpoint:** `PUT /menu-items/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "name": "Mie Goreng Special",
  "price": 25000,
  "isAvailable": true
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    "menuItem": {
      "id": 10,
      "name": "Mie Goreng Special",
      "price": 25000,
      "isAvailable": true,
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  }
}
```

---

### Delete Menu Item
Menghapus menu. (ADMIN only)

**Endpoint:** `DELETE /menu-items/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## Tables

### Get All Tables
Mendapatkan semua meja dengan pagination dan filter.

**Endpoint:** `GET /tables`

**Query Parameters:**
- `page` (number, default: 1) - Halaman
- `limit` (number, default: 10) - Jumlah data per halaman
- `location` (string: INDOOR|OUTDOOR|VIP) - Filter berdasarkan lokasi
- `status` (string: AVAILABLE|OCCUPIED|RESERVED) - Filter berdasarkan status
- `available` (boolean) - Shortcut untuk filter status AVAILABLE (available=true sama dengan status=AVAILABLE)
- `sortBy` (string: tableNumber|capacity|createdAt, default: tableNumber)
- `order` (string: asc|desc, default: asc)

**Example:**
```
GET /tables?status=AVAILABLE&location=INDOOR
GET /tables?available=true&location=OUTDOOR
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tableNumber": 1,
      "capacity": 4,
      "location": "INDOOR",
      "status": "AVAILABLE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

---

### Get Table by ID
Mendapatkan detail meja berdasarkan ID.

**Endpoint:** `GET /tables/:id`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "tableNumber": 1,
    "capacity": 4,
    "location": "INDOOR",
    "status": "AVAILABLE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "orders": [
      {
        "id": 5,
        "orderNumber": "ORD-20240101-0005",
        "userId": 3,
        "tableId": 1,
        "orderType": "DINE_IN",
        "status": "PREPARING",
        "totalAmount": 50000,
        "notes": null,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:15:00.000Z"
      }
    ]
  }
}
```

**Note:** Field `orders` berisi order yang sedang aktif (status: PENDING, CONFIRMED, PREPARING, READY)

---

### Create Table
Membuat meja baru. (ADMIN only)

**Endpoint:** `POST /tables`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "tableNumber": 15,
  "capacity": 6,
  "location": "OUTDOOR",
  "status": "AVAILABLE"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Table created successfully",
  "data": {
    "table": {
      "id": 15,
      "tableNumber": 15,
      "capacity": 6,
      "location": "OUTDOOR",
      "status": "AVAILABLE"
    }
  }
}
```

**Validasi:**
- tableNumber: number (integer), harus unik
- capacity: minimum 1
- location: INDOOR|OUTDOOR|VIP (wajib)
- status: AVAILABLE|OCCUPIED|RESERVED, default AVAILABLE

---

### Update Table
Mengupdate meja. (ADMIN/STAFF only)

**Endpoint:** `PUT /tables/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "status": "OCCUPIED",
  "capacity": 8
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Table updated successfully",
  "data": {
    "table": {
      "id": 15,
      "tableNumber": 15,
      "capacity": 8,
      "status": "OCCUPIED",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  }
}
```

---

### Delete Table
Menghapus meja. (ADMIN only)

**Endpoint:** `DELETE /tables/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Table deleted successfully"
}
```

---

## Orders

### Get All Orders
Mendapatkan semua order dengan pagination dan filter.

**Endpoint:** `GET /orders`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `page` (number, default: 1) - Halaman
- `limit` (number, default: 10) - Jumlah data per halaman
- `status` (string: PENDING|CONFIRMED|PREPARING|READY|COMPLETED|CANCELLED) - Filter berdasarkan status
- `orderType` (string: DINE_IN|TAKEAWAY|DELIVERY) - Filter berdasarkan tipe order
- `userId` (number) - Filter berdasarkan user (ADMIN/STAFF only)
- `dateFrom` (date) - Filter tanggal mulai (format: YYYY-MM-DD)
- `dateTo` (date) - Filter tanggal akhir
- `minAmount` (number) - Total amount minimum
- `maxAmount` (number) - Total amount maksimum
- `sortBy` (string: createdAt|totalAmount|status, default: createdAt)
- `order` (string: asc|desc, default: desc)

**Example:**
```
GET /orders?status=COMPLETED&dateFrom=2024-01-01&dateTo=2024-01-31&sortBy=totalAmount&order=desc
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-20240101-0001",
      "userId": 1,
      "tableId": 1,
      "orderType": "DINE_IN",
      "status": "COMPLETED",
      "totalAmount": 75000,
      "notes": "Extra spicy",
      "user": {
        "name": "Customer One",
        "email": "customer1@example.com"
      },
      "table": {
        "id": 1,
        "tableNumber": 1,
        "capacity": 4,
        "location": "INDOOR",
        "status": "AVAILABLE"
      },
      "orderItems": [
        {
          "id": 1,
          "menuItemId": 1,
          "quantity": 2,
          "price": 25000,
          "subtotal": 50000,
          "notes": null,
          "menuItem": {
            "id": 1,
            "name": "Nasi Goreng",
            "price": 25000
          }
        }
      ],
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Note:**
- CUSTOMER hanya bisa melihat order mereka sendiri
- ADMIN/STAFF bisa melihat semua order

---

### Get Order by ID
Mendapatkan detail order berdasarkan ID.

**Endpoint:** `GET /orders/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "order": {
      "id": 1,
      "userId": 1,
      "tableId": 1,
      "orderType": "DINE_IN",
      "status": "COMPLETED",
      "totalAmount": 75000,
      "notes": "Extra spicy",
      "user": {
        "id": 1,
        "name": "Customer One"
      },
      "table": {
        "id": 1,
        "tableNumber": 1,
        "location": "INDOOR"
      },
      "orderItems": [
        {
          "id": 1,
          "menuItemId": 1,
          "quantity": 2,
          "price": 25000,
          "subtotal": 50000,
          "menuItem": {
            "id": 1,
            "name": "Nasi Goreng",
            "imageUrl": "https://example.com/nasigoreng.jpg"
          }
        },
        {
          "id": 2,
          "menuItemId": 2,
          "quantity": 1,
          "price": 25000,
          "subtotal": 25000,
          "menuItem": {
            "id": 2,
            "name": "Mie Goreng"
          }
        }
      ],
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:30:00.000Z"
    }
  }
}
```

**Note:**
- CUSTOMER hanya bisa melihat order mereka sendiri
- ADMIN/STAFF bisa melihat semua order

---

### Create Order
Membuat order baru. (All authenticated users)

**Endpoint:** `POST /orders`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "tableId": 1,
  "orderType": "DINE_IN",
  "notes": "Extra spicy please",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 3,
      "quantity": 1
    }
  ]
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 25,
      "userId": 1,
      "tableId": 1,
      "orderType": "DINE_IN",
      "status": "PENDING",
      "totalAmount": 75000,
      "notes": "Extra spicy please",
      "orderItems": [
        {
          "id": 50,
          "menuItemId": 1,
          "quantity": 2,
          "price": 25000,
          "subtotal": 50000
        },
        {
          "id": 51,
          "menuItemId": 3,
          "quantity": 1,
          "price": 25000,
          "subtotal": 25000
        }
      ],
      "createdAt": "2024-01-02T10:00:00.000Z"
    }
  }
}
```

**Validasi:**
- tableId: opsional untuk TAKEAWAY dan DELIVERY, wajib untuk DINE_IN
- orderType: wajib (DINE_IN|TAKEAWAY|DELIVERY)
- notes: opsional, maksimal 500 karakter
- items: wajib, minimal 1 item
  - menuItemId: harus ada di database dan available
  - quantity: minimum 1

**Business Logic:**
- totalAmount dihitung otomatis dari sum(price × quantity)
- Table status otomatis berubah jadi OCCUPIED (untuk DINE_IN)
- Order status default: PENDING

---

### Update Order
Mengupdate order (status dan notes).

**Endpoint:** `PUT /orders/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "status": "CONFIRMED",
  "notes": "Tambahan catatan"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "order": {
      "id": 25,
      "userId": 1,
      "tableId": 1,
      "orderType": "DINE_IN",
      "status": "CONFIRMED",
      "totalAmount": 75000,
      "notes": "Tambahan catatan",
      "orderItems": [
        {
          "id": 50,
          "menuItemId": 1,
          "quantity": 2,
          "price": 25000,
          "subtotal": 50000,
          "menuItem": {
            "id": 1,
            "name": "Nasi Goreng"
          }
        }
      ],
      "table": {
        "id": 1,
        "tableNumber": 1
      },
      "updatedAt": "2024-01-02T10:15:00.000Z"
    }
  }
}
```

**Validasi:**
- status: PENDING|CONFIRMED|PREPARING|READY|COMPLETED|CANCELLED
- notes: opsional, maksimal 500 karakter

**Authorization & Business Logic:**

**CUSTOMER:**
- Hanya bisa update order mereka sendiri
- Hanya bisa cancel (status = CANCELLED) order dengan status PENDING

**STAFF:**
- Bisa update semua order
- Status harus mengikuti flow: PENDING → CONFIRMED → PREPARING → READY → COMPLETED
- Bisa cancel order kapan saja (status = CANCELLED)

**ADMIN:**
- Sama seperti STAFF

**Business Logic:**
- Status flow: PENDING → CONFIRMED → PREPARING → READY → COMPLETED
- Jika status berubah menjadi COMPLETED atau CANCELLED, table status berubah jadi AVAILABLE

---

### Delete Order
Menghapus order. (ADMIN only)

**Endpoint:** `DELETE /orders/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Only cancelled orders can be deleted"
}
```

**Business Logic:**
- Hanya order dengan status CANCELLED yang bisa dihapus
- Hanya ADMIN yang bisa delete order

---

## Reviews

### Get All Reviews
Mendapatkan semua review dengan pagination dan filter.

**Endpoint:** `GET /reviews`

**Query Parameters:**
- `page` (number, default: 1) - Halaman
- `limit` (number, default: 10) - Jumlah data per halaman
- `menuItemId` (number) - Filter berdasarkan menu item
- `userId` (number) - Filter berdasarkan user
- `minRating` (number: 1-5) - Rating minimum
- `maxRating` (number: 1-5) - Rating maksimum
- `sortBy` (string: rating|createdAt, default: createdAt)
- `order` (string: asc|desc, default: desc)

**Example:**
```
GET /reviews?menuItemId=1&minRating=4&maxRating=5&sortBy=createdAt&order=desc
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "menuItemId": 1,
      "rating": 5,
      "comment": "Sangat enak!",
      "createdAt": "2024-01-01T15:00:00.000Z",
      "updatedAt": "2024-01-01T15:00:00.000Z",
      "user": {
        "name": "Customer One",
        "email": "customer1@example.com"
      },
      "menuItem": {
        "name": "Nasi Goreng"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### Get Review by ID
Mendapatkan detail review berdasarkan ID.

**Endpoint:** `GET /reviews/:id`

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "menuItemId": 1,
    "rating": 5,
    "comment": "Sangat enak!",
    "createdAt": "2024-01-01T15:00:00.000Z",
    "updatedAt": "2024-01-01T15:00:00.000Z",
    "user": {
      "name": "Customer One",
      "email": "customer1@example.com"
    },
    "menuItem": {
      "name": "Nasi Goreng",
      "description": "Fried rice with chicken",
      "price": 25000
    }
  }
}
```

---

### Create Review
Membuat review baru. (All authenticated users)

**Endpoint:** `POST /reviews`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "menuItemId": 1,
  "rating": 5,
  "comment": "Makanannya enak sekali!"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 50,
    "userId": 1,
    "menuItemId": 1,
    "rating": 5,
    "comment": "Makanannya enak sekali!",
    "createdAt": "2024-01-02T15:00:00.000Z",
    "updatedAt": "2024-01-02T15:00:00.000Z",
    "user": {
      "name": "Customer One",
      "email": "customer1@example.com"
    },
    "menuItem": {
      "name": "Nasi Goreng"
    }
  }
}
```

**Validasi:**
- menuItemId: harus ada di database
- rating: 1-5 (integer)
- comment: opsional, maksimal 1000 karakter

**Business Logic:**
- User harus punya order COMPLETED yang berisi menuItemId tersebut sebelum bisa review
- User hanya bisa review 1x per menu item

**Error Response (400):**
```json
{
  "success": false,
  "message": "You can only review menu items from your completed orders"
}
```

atau

```json
{
  "success": false,
  "message": "You have already reviewed this item"
}
```

---

### Update Review
Mengupdate review. (User yang membuat review)

**Endpoint:** `PUT /reviews/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Body:**
```json
{
  "rating": 4,
  "comment": "Setelah dipikir-pikir 4 bintang lebih cocok"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "id": 50,
    "userId": 1,
    "menuItemId": 1,
    "rating": 4,
    "comment": "Setelah dipikir-pikir 4 bintang lebih cocok",
    "createdAt": "2024-01-02T15:00:00.000Z",
    "updatedAt": "2024-01-02T16:00:00.000Z",
    "user": {
      "name": "Customer One",
      "email": "customer1@example.com"
    },
    "menuItem": {
      "name": "Nasi Goreng"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You can only update your own reviews"
}
```

---

### Delete Review
Menghapus review. (User yang membuat review atau ADMIN)

**Endpoint:** `DELETE /reviews/:id`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You can only delete your own reviews"
}
```

**Note:** ADMIN bisa delete semua review

---

## Authorization Summary

| Endpoint | CUSTOMER | STAFF | ADMIN |
|----------|----------|-------|-------|
| **Auth** |
| POST /auth/register | ✅ Public | ✅ Public | ✅ Public |
| POST /auth/login | ✅ Public | ✅ Public | ✅ Public |
| POST /auth/refresh | ✅ Public | ✅ Public | ✅ Public |
| GET /auth/me | ✅ | ✅ | ✅ |
| **Categories** |
| GET /categories | ✅ Public | ✅ Public | ✅ Public |
| GET /categories/:id | ✅ Public | ✅ Public | ✅ Public |
| POST /categories | ❌ | ❌ | ✅ |
| PUT /categories/:id | ❌ | ❌ | ✅ |
| DELETE /categories/:id | ❌ | ❌ | ✅ |
| **Menu Items** |
| GET /menu-items | ✅ Public | ✅ Public | ✅ Public |
| GET /menu-items/:id | ✅ Public | ✅ Public | ✅ Public |
| POST /menu-items | ❌ | ✅ | ✅ |
| PUT /menu-items/:id | ❌ | ✅ | ✅ |
| DELETE /menu-items/:id | ❌ | ❌ | ✅ |
| **Tables** |
| GET /tables | ✅ Public | ✅ Public | ✅ Public |
| GET /tables/:id | ✅ Public | ✅ Public | ✅ Public |
| POST /tables | ❌ | ❌ | ✅ |
| PUT /tables/:id | ❌ | ✅ | ✅ |
| DELETE /tables/:id | ❌ | ❌ | ✅ |
| **Orders** |
| GET /orders | ✅ Own only | ✅ All | ✅ All |
| GET /orders/:id | ✅ Own only | ✅ All | ✅ All |
| POST /orders | ✅ | ✅ | ✅ |
| PUT /orders/:id | ✅ Own only (cancel) | ✅ All | ✅ All |
| DELETE /orders/:id | ❌ | ❌ | ✅ |
| **Reviews** |
| GET /reviews | ✅ Public | ✅ Public | ✅ Public |
| GET /reviews/:id | ✅ Public | ✅ Public | ✅ Public |
| POST /reviews | ✅ | ✅ | ✅ |
| PUT /reviews/:id | ✅ Own only | ✅ Own only | ✅ Own only |
| DELETE /reviews/:id | ✅ Own only | ✅ Own only | ✅ All |

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Validasi error atau business logic error |
| 401 | Unauthorized - Token tidak valid atau expired |
| 403 | Forbidden - Tidak punya akses ke resource |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Data duplikat (misal email sudah ada) |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Error di server |

---

## Rate Limiting

Beberapa endpoint punya rate limiting:

- **POST /orders**: 10 request per 15 menit per user
- **POST /reviews**: 5 request per 15 menit per user
- **POST /auth/login**: 5 request per 15 menit per IP

Jika melebihi rate limit, akan muncul error:

```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## Testing

Untuk testing API bisa menggunakan:

1. **REST Client Extension** (VSCode)
   - Buka file `tests/restaurant-api.http`
   - Install extension "REST Client"
   - Klik "Send Request" di atas setiap request

2. **Postman / Insomnia**
   - Import collection
   - Set base URL: `http://44.216.9.251/api`
   - Set Authorization header dengan token

3. **cURL**
   ```bash
   # Login
   curl -X POST http://44.216.9.251/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@restaurant.com","password":"password123"}'

   # Get categories dengan token
   curl http://44.216.9.251/api/categories \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

---

## Test Credentials

Gunakan credentials ini untuk testing (sudah ada di seed data):

**Admin:**
- Email: `admin@restaurant.com`
- Password: `password123`
- Role: ADMIN

**Staff:**
- Email: `staff@restaurant.com`
- Password: `password123`
- Role: STAFF

**Customer:**
- Email: `customer1@example.com`
- Password: `password123`
- Role: CUSTOMER
