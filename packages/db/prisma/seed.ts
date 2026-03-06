import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.info("🌱 Starting database seed...");

  // Seed menu categories
  const categories: Prisma.MenuCategoryCreateInput[] = [
    { name: "Burgers", description: "Juicy burgers and sandwiches", sortOrder: 1 },
    { name: "Pizzas", description: "Stone-baked pizzas", sortOrder: 2 },
    { name: "Salads", description: "Fresh and healthy salads", sortOrder: 3 },
    { name: "Drinks", description: "Cold and hot beverages", sortOrder: 4 },
    { name: "Desserts", description: "Sweet treats", sortOrder: 5 },
  ];

  for (const category of categories) {
    await prisma.menuCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.info("✅ Seeded menu categories");

  // Seed admin user
  const adminPassword = await hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@cloudkitchen.io" },
    update: {},
    create: {
      email: "admin@cloudkitchen.io",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.info("✅ Seeded admin user (admin@cloudkitchen.io / admin123)");
  console.info("🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
