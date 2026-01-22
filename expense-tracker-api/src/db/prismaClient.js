require('dotenv').config();

console.log('DATABASE_URL raw:', process.env.DATABASE_URL);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter })

module.exports = prisma;