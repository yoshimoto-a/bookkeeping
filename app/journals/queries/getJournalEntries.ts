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
    orderBy: { entryDate: "desc" },
    select: {
      id: true,
      entryDate: true,
      description: true,
      lines: {
        select: {
          accountId: true,
          debit: true,
          credit: true,
          account: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return entries.map((e) => {
    const debitLine = e.lines.find((l) => l.debit > 0);
    const creditLine = e.lines.find((l) => l.credit > 0);

    return {
      id: e.id,
      txDate: e.entryDate,
      debitAccountId: debitLine?.accountId ?? "",
      debitAccountName: debitLine?.account.name ?? "—",
      debitAmount: debitLine?.debit ?? 0,
      creditAccountId: creditLine?.accountId ?? "",
      creditAccountName: creditLine?.account.name ?? "—",
      creditAmount: creditLine?.credit ?? 0,
      description: e.description,
    };
  });
};
