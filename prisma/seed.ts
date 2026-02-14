import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { ACCOUNT_TEMPLATES } from "../lib/constants/accountTemplates";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
/**
 * システムマスタのみ投入
 * - 何回実行しても結果が変わらない（idempotent）
 * - ユーザーデータに影響を与えない
 */
const seedTaxRates = async () => {
  const master = [
    { name: '標準10%', rateBps: 1000 },
    { name: '軽減8%', rateBps: 800 },
    { name: '非課税', rateBps: 0 },
  ];

  for (const row of master) {
    await prisma.taxRate.upsert({
      where: { name: row.name },
      update: row,
      create: row,
    });
  }
}

const seedAccountsForUsers = async () => {
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) {
    console.log('No users found. Skip account seeding.');
    return;
  }

  for (const user of users) {
    for (const t of ACCOUNT_TEMPLATES) {
      await prisma.account.upsert({
        where: { userId_code: { userId: user.id, code: t.code } },
        update: { name: t.name, type: t.type },
        create: { userId: user.id, ...t },
      });
    }
  }
}

const main = async () => {
  await seedTaxRates();
  await seedAccountsForUsers();
}

main()
  .then(async () => {
    console.log('System seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
