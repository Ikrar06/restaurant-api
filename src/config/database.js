// Import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Buat instance Prisma
const prisma = new PrismaClient();

module.exports = prisma;
