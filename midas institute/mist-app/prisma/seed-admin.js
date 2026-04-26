const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "superadmin@midas.com";
  const password = "SuperSecurePassword123"; // Change this
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'SUPER_ADMIN',
      permissions: ["courses", "videos", "reviews", "billing", "users", "trainers", "placements", "employees"]
    },
    create: {
      email,
      name: "Super Admin",
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      permissions: ["courses", "videos", "reviews", "billing", "users", "trainers", "placements", "employees"]
    },
  });

  console.log("Super Admin created/updated:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
