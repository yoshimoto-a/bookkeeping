import { prisma } from "@/lib/prisma";
import type { PresetWithAccounts } from "@/app/_types/preset";

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
