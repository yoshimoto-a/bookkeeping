
import { prisma } from "@/lib/prisma";
import type { AccountWithMeta, FiscalYearSettingData } from "@/app/_types/settings";
import type { PresetWithAccounts } from "@/app/_types/preset";

export const getAccountsWithMeta = async (userId: string): Promise<AccountWithMeta[]> => {
  const [rawAccounts, referencedAccountIds] = await Promise.all([
    prisma.account.findMany({
      where: { userId, parentId: null },
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

export const getFiscalYearSetting = async (
  userId: string,
  fiscalYear: number
): Promise<FiscalYearSettingData> =>
  prisma.fiscalYearSetting.findUnique({
    where: { userId_fiscalYear: { userId, fiscalYear } },
  });

export const getFiscalYears = async (userId: string): Promise<number[]> => {
  const currentYear = new Date().getFullYear();
  const existingSettings = await prisma.fiscalYearSetting.findMany({
    where: { userId },
    select: { fiscalYear: true },
    orderBy: { fiscalYear: "desc" },
  });

  const yearSet = new Set([
    currentYear,
    ...existingSettings.map((s) => s.fiscalYear),
  ]);
  return [...yearSet].sort((a, b) => b - a);
};

export const getPresetsWithMeta = async (userId: string): Promise<PresetWithAccounts[]> => {
  const [rawPresets, referencedPresetIds] = await Promise.all([
    prisma.preset.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        kind: true,
        fixedDebitAccount: { select: { id: true, name: true } },
        fixedCreditAccount: { select: { id: true, name: true } },
        requiresVariableAccount: true,
        requiresPartner: true,
      },
    }),
    prisma.transaction
      .findMany({
        where: { userId },
        select: { presetId: true },
        distinct: ["presetId"],
      })
      .then((rows) => new Set(rows.map((r) => r.presetId))),
  ]);

  return rawPresets.map((p) => ({
    ...p,
    isReferenced: referencedPresetIds.has(p.id),
  }));
};
