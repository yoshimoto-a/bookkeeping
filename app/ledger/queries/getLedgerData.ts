import { prisma } from "@/lib/prisma";
import type { AccountType } from "@prisma/client";

export type LedgerEntry = {
  id: string;
  entryDate: string;
  description: string | null;
  partnerId: string | null;
  partnerName: string | null;
  debit: number;
  credit: number;
  balance: number;
};

export type LedgerAccount = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId: string | null;
  entries: LedgerEntry[];
  openingBalance: number;
  closingBalance: number;
};

export const getLedgerData = async (
  userId: string,
  accountId?: string,
  startDate?: string,
  endDate?: string
): Promise<LedgerAccount[]> => {
  // 対象科目を取得
  let targetAccountIds: string[] = [];
  
  if (accountId) {
    // 特定科目が指定された場合
    const selectedAccount = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        children: true,
      },
    });
    
    if (selectedAccount) {
      // 選択された科目とその補助科目のIDを収集
      targetAccountIds = [selectedAccount.id, ...selectedAccount.children.map(child => child.id)];
    }
  }

  // 対象科目を取得（指定されていれば特定科目とその補助科目、なければ全科目）
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      ...(accountId ? { id: { in: targetAccountIds } } : {}),
    },
    select: {
      id: true,
      code: true,
      name: true,
      type: true,
      parentId: true,
    },
    orderBy: [{ type: "asc" }, { code: "asc" }],
  });

  // 各科目の明細を取得
  const ledgerAccounts: LedgerAccount[] = await Promise.all(
    accounts.map(async (account) => {
      // 期間前の残高を計算（期首残高）
      const openingBalanceData = await prisma.journalLine.aggregate({
        _sum: {
          debit: true,
          credit: true,
        },
        where: {
          accountId: account.id,
          entry: {
            userId,
            ...(startDate ? { entryDate: { lt: new Date(startDate) } } : {}),
          },
        },
      });

      const openingBalance = (openingBalanceData._sum.debit || 0) - (openingBalanceData._sum.credit || 0);

      // 期間内の明細を取得
      const journalLines = await prisma.journalLine.findMany({
        where: {
          accountId: account.id,
          entry: {
            userId,
            ...(startDate && endDate
              ? {
                  entryDate: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                  },
                }
              : {}),
          },
        },
        select: {
          id: true,
          debit: true,
          credit: true,
          entry: {
            select: {
              entryDate: true,
              description: true,
              partnerId: true,
              partner: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          entry: {
            entryDate: "asc",
          },
        },
      });

      // 残高を累積計算
      let runningBalance = openingBalance;
      const entries: LedgerEntry[] = journalLines.map((line) => {
        const debit = line.debit;
        const credit = line.credit;
        runningBalance += debit - credit;

        return {
          id: line.id,
          entryDate: line.entry.entryDate.toISOString().split("T")[0],
          description: line.entry.description,
          partnerId: line.entry.partnerId,
          partnerName: line.entry.partner?.name || null,
          debit,
          credit,
          balance: runningBalance,
        };
      });

      return {
        id: account.id,
        code: account.code,
        name: account.name,
        type: account.type,
        parentId: account.parentId,
        entries,
        openingBalance,
        closingBalance: runningBalance,
      };
    })
  );

  return ledgerAccounts.filter((account) => account.entries.length > 0 || account.openingBalance !== 0);
};
