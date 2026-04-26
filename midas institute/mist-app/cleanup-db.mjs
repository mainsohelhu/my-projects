import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$runCommandRaw({
    delete: "Transaction",
    deletes: [
      { q: { enrollmentId: { $exists: false } }, limit: 0 },
      { q: { enrollmentId: null }, limit: 0 },
      { q: { enrollmentId: "" }, limit: 0 }
    ]
  });
  console.log("Cleanup Result:", result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
