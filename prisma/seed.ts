import { PrismaClient, AccountType } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

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

type AccountTemplate = {
  code: string;
  name: string;
  type: AccountType;
  isOwnerAccount?: boolean;
};

const seedAccountsForUsers = async () => {
  const users = await prisma.user.findMany({ select: { id: true } });
  if (users.length === 0) {
    console.log('No users found. Skip account seeding.');
    return;
  }

  const templates: AccountTemplate[] = [
    // owner accounts
    { code: 'OWNER_WITHDRAWAL', name: '事業主貸', type: AccountType.ASSET, isOwnerAccount: true },
    { code: 'OWNER_ADVANCE', name: '事業主借', type: AccountType.LIABILITY, isOwnerAccount: true },
    { code: 'CAPITAL', name: '元入金', type: AccountType.EQUITY, isOwnerAccount: true },

    // assets
    { code: 'CASH', name: '現金', type: AccountType.ASSET },
    { code: 'BANK', name: '普通預金', type: AccountType.ASSET },
    { code: 'AR', name: '売掛金', type: AccountType.ASSET },
    { code: 'VAT_PREPAID', name: '仮払消費税', type: AccountType.ASSET },
    { code: 'TOOLS', name: '工具器具備品', type: AccountType.ASSET },
    { code: 'ACCUM_DEPR', name: '減価償却累計額', type: AccountType.ASSET },
    { code: 'BULK_ASSET', name: '一括償却資産', type: AccountType.ASSET },

    // liabilities
    { code: 'VAT_PAYABLE', name: '仮受消費税', type: AccountType.LIABILITY },

    // revenue
    { code: 'SALES', name: '売上', type: AccountType.REVENUE },
    { code: 'MISC_REV', name: '雑収入', type: AccountType.REVENUE },
    { code: 'SALES_DISCOUNT', name: '売上値引', type: AccountType.REVENUE },

    // expense
    { code: 'FEE', name: '支払手数料', type: AccountType.EXPENSE },
    { code: 'CONTRACT_COMM', name: '通信費', type: AccountType.EXPENSE },
    { code: 'DEPR_EXP', name: '減価償却費', type: AccountType.EXPENSE },
    { code: 'CONSUMABLES', name: '消耗品費', type: AccountType.EXPENSE },
  ];

  for (const user of users) {
    for (const t of templates) {
      await prisma.account.upsert({
        where: { userId_code: { userId: user.id, code: t.code } },
        update: { name: t.name, type: t.type },
        create: {
          userId: user.id,
          code: t.code,
          name: t.name,
          type: t.type,
          isOwnerAccount: t.isOwnerAccount ?? false,
        },
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
