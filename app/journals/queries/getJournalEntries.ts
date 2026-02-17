import { prisma } from "@/lib/prisma";
import type { JournalRow } from "@/app/_types/transaction";

export const getJournalEntries = async (
  userId: string,
  year: number,
  month: number
): Promise<JournalRow[]> => {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 1);

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId,
      entryDate: { gte: from, lt: to },
    },
    orderBy: { entryDate: "asc" },
    select: {
      id: true,
      entryDate: true,
      description: true,
      lines: {
        select: {
          accountId: true,
          debit: true,
          credit: true,
          account: {
            select: {
              name: true,
              parentId: true,
              parent: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return entries.map((e) => ({
    id: e.id,
    txDate: e.entryDate,
    lines: e.lines.map((l) => ({
      accountId: l.accountId,
      accountName: l.account.name,
      parentAccountId: l.account.parentId,
      parentAccountName: l.account.parent?.name ?? null,
      debit: l.debit,
      credit: l.credit,
    })),
    description: e.description,
  }));
};
