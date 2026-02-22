import { prisma } from "@/lib/prisma";
import type { AccountWithMeta } from "@/app/_types/settings";

export const getAccountsWithMeta = async (userId: string): Promise<AccountWithMeta[]> => {
  const [rawAccounts, referencedAccountIds] = await Promise.all([
    prisma.account.findMany({
      where: { userId },
      orderBy: [{ type: "asc" }, { code: "asc" }],
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
        isOwnerAccount: true,
        parentId: true,
        children: {
          select: { id: true, code: true, name: true },
          orderBy: { code: "asc" },
        },
      },
    }),
    prisma.journalLine
      .findMany({
        where: { entry: { userId } },
        select: { accountId: true },
        distinct: ["accountId"],
      })
      .then((lines) => new Set(lines.map((l) => l.accountId))),
  ]);

  return rawAccounts.map((a) => ({
    ...a,
    isReferenced: referencedAccountIds.has(a.id),
  }));
};
