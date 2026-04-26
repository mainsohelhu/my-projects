const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst();
    console.log("Connection test successful. Found user:", user ? user.email : "none");
  } catch (e) {
    console.error("Connection test failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
