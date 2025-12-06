const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.table.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Hash password untuk semua user
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@restaurant.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '081234567890',
      role: 'ADMIN'
    }
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@restaurant.com',
      password: hashedPassword,
      name: 'Staff User',
      phone: '081234567891',
      role: 'STAFF'
    }
  });

  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      password: hashedPassword,
      name: 'John Doe',
      phone: '081234567892',
      role: 'CUSTOMER'
    }
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      phone: '081234567893',
      role: 'CUSTOMER'
    }
  });

  console.log('Created users');

  // Create Categories
  const appetizer = await prisma.category.create({
    data: {
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers'
    }
  });

  const mainCourse = await prisma.category.create({
    data: {
      name: 'Main Course',
      description: 'Our signature main dishes'
    }
  });

  const dessert = await prisma.category.create({
    data: {
      name: 'Desserts',
      description: 'Sweet treats to end your meal'
    }
  });

  const beverage = await prisma.category.create({
    data: {
      name: 'Beverages',
      description: 'Refreshing drinks'
    }
  });

  const salad = await prisma.category.create({
    data: {
      name: 'Salads',
      description: 'Fresh and healthy salads'
    }
  });

  console.log('Created categories');

  // Create Menu Items
  const springRoll = await prisma.menuItem.create({
    data: {
      name: 'Spring Rolls',
      description: 'Crispy vegetable spring rolls with sweet chili sauce',
      price: 25000,
      categoryId: appetizer.id,
      isAvailable: true,
      preparationTime: 10
    }
  });

  const garlicBread = await prisma.menuItem.create({
    data: {
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter',
      price: 20000,
      categoryId: appetizer.id,
      isAvailable: true,
      preparationTime: 8
    }
  });

  const nasiGoreng = await prisma.menuItem.create({
    data: {
      name: 'Nasi Goreng Special',
      description: 'Indonesian fried rice with egg and chicken',
      price: 35000,
      categoryId: mainCourse.id,
      isAvailable: true,
      preparationTime: 15
    }
  });

  const mieGoreng = await prisma.menuItem.create({
    data: {
      name: 'Mie Goreng',
      description: 'Indonesian fried noodles with vegetables',
      price: 32000,
      categoryId: mainCourse.id,
      isAvailable: true,
      preparationTime: 15
    }
  });

  const chickenSteak = await prisma.menuItem.create({
    data: {
      name: 'Chicken Steak',
      description: 'Grilled chicken with black pepper sauce',
      price: 55000,
      categoryId: mainCourse.id,
      isAvailable: true,
      preparationTime: 20
    }
  });

  const beefSteak = await prisma.menuItem.create({
    data: {
      name: 'Beef Steak',
      description: 'Premium beef steak with mushroom sauce',
      price: 85000,
      categoryId: mainCourse.id,
      isAvailable: true,
      preparationTime: 25
    }
  });

  const iceCream = await prisma.menuItem.create({
    data: {
      name: 'Ice Cream',
      description: 'Vanilla ice cream with chocolate sauce',
      price: 18000,
      categoryId: dessert.id,
      isAvailable: true,
      preparationTime: 5
    }
  });

  const tiramisu = await prisma.menuItem.create({
    data: {
      name: 'Tiramisu',
      description: 'Classic Italian dessert',
      price: 35000,
      categoryId: dessert.id,
      isAvailable: true,
      preparationTime: 5
    }
  });

  const esTeh = await prisma.menuItem.create({
    data: {
      name: 'Es Teh Manis',
      description: 'Sweet iced tea',
      price: 8000,
      categoryId: beverage.id,
      isAvailable: true,
      preparationTime: 3
    }
  });

  const orange = await prisma.menuItem.create({
    data: {
      name: 'Orange Juice',
      description: 'Fresh squeezed orange juice',
      price: 15000,
      categoryId: beverage.id,
      isAvailable: true,
      preparationTime: 5
    }
  });

  const caesarSalad = await prisma.menuItem.create({
    data: {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      price: 30000,
      categoryId: salad.id,
      isAvailable: true,
      preparationTime: 10
    }
  });

  console.log('Created menu items');

  // Create Tables
  await prisma.table.createMany({
    data: [
      { tableNumber: 1, capacity: 2, location: 'INDOOR', status: 'AVAILABLE' },
      { tableNumber: 2, capacity: 4, location: 'INDOOR', status: 'AVAILABLE' },
      { tableNumber: 3, capacity: 4, location: 'INDOOR', status: 'OCCUPIED' },
      { tableNumber: 4, capacity: 6, location: 'OUTDOOR', status: 'AVAILABLE' },
      { tableNumber: 5, capacity: 4, location: 'OUTDOOR', status: 'AVAILABLE' },
      { tableNumber: 6, capacity: 8, location: 'VIP', status: 'RESERVED' },
      { tableNumber: 7, capacity: 6, location: 'VIP', status: 'AVAILABLE' },
      { tableNumber: 8, capacity: 2, location: 'INDOOR', status: 'AVAILABLE' }
    ]
  });

  console.log('Created tables');

  // Get table 3 untuk order dine-in
  const table3 = await prisma.table.findFirst({ where: { tableNumber: 3 } });

  // Create Orders dengan OrderItems
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20251206-0001',
      userId: customer1.id,
      tableId: table3.id,
      orderType: 'DINE_IN',
      status: 'COMPLETED',
      totalAmount: 123000,
      notes: 'Extra spicy please',
      orderItems: {
        create: [
          {
            menuItemId: nasiGoreng.id,
            quantity: 2,
            price: nasiGoreng.price,
            subtotal: nasiGoreng.price * 2
          },
          {
            menuItemId: esTeh.id,
            quantity: 2,
            price: esTeh.price,
            subtotal: esTeh.price * 2
          },
          {
            menuItemId: iceCream.id,
            quantity: 1,
            price: iceCream.price,
            subtotal: iceCream.price * 1
          }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20251206-0002',
      userId: customer2.id,
      orderType: 'TAKEAWAY',
      status: 'COMPLETED',
      totalAmount: 115000,
      orderItems: {
        create: [
          {
            menuItemId: chickenSteak.id,
            quantity: 1,
            price: chickenSteak.price,
            subtotal: chickenSteak.price * 1
          },
          {
            menuItemId: orange.id,
            quantity: 2,
            price: orange.price,
            subtotal: orange.price * 2
          },
          {
            menuItemId: tiramisu.id,
            quantity: 1,
            price: tiramisu.price,
            subtotal: tiramisu.price * 1
          }
        ]
      }
    }
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20251206-0003',
      userId: customer1.id,
      orderType: 'DELIVERY',
      status: 'PREPARING',
      totalAmount: 67000,
      notes: 'Please deliver before 7 PM',
      orderItems: {
        create: [
          {
            menuItemId: mieGoreng.id,
            quantity: 2,
            price: mieGoreng.price,
            subtotal: mieGoreng.price * 2
          },
          {
            menuItemId: esTeh.id,
            quantity: 3,
            price: esTeh.price,
            subtotal: esTeh.price * 3
          }
        ]
      }
    }
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-20251206-0004',
      userId: customer2.id,
      orderType: 'TAKEAWAY',
      status: 'PENDING',
      totalAmount: 50000,
      orderItems: {
        create: [
          {
            menuItemId: springRoll.id,
            quantity: 2,
            price: springRoll.price,
            subtotal: springRoll.price * 2
          }
        ]
      }
    }
  });

  console.log('Created orders');

  // Create Reviews (hanya untuk completed orders)
  await prisma.review.createMany({
    data: [
      {
        userId: customer1.id,
        menuItemId: nasiGoreng.id,
        rating: 5,
        comment: 'Excellent! Best nasi goreng in town!'
      },
      {
        userId: customer1.id,
        menuItemId: iceCream.id,
        rating: 4,
        comment: 'Delicious ice cream, would order again'
      },
      {
        userId: customer2.id,
        menuItemId: chickenSteak.id,
        rating: 5,
        comment: 'Perfect! The chicken was tender and juicy'
      },
      {
        userId: customer2.id,
        menuItemId: tiramisu.id,
        rating: 4,
        comment: 'Good tiramisu but a bit too sweet'
      },
      {
        userId: customer2.id,
        menuItemId: orange.id,
        rating: 5,
        comment: 'Very fresh orange juice!'
      }
    ]
  });

  console.log('Created reviews');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
