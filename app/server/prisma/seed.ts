import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("promise@123", 10);

  await prisma.user.upsert({
    where: {
      email: "vithlanidhruvisha17@gmail.com",
    },
    update: {},
    create: {
      name: "Dhruvisha",
      email: "vithlanidhruvisha17@gmail.com",
      password: hashedPassword,
      isActive: true,
      isOtpVerified: true,
    },
  });

  console.log("✅ Admin created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
