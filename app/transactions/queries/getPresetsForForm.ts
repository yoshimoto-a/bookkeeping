import { prisma } from "@/lib/prisma";
import type { PresetForForm } from "@/app/_types/transaction";
import type { QueryResult } from "@/app/_types/settings";

export const getPresetsForForm = async (userId: string): Promise<QueryResult<PresetForForm[]>> => {
  try {
    const presets = await prisma.preset.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: {
        fixedDebitAccount: {
          select: { id: true, name: true }
        },
        fixedCreditAccount: {
          select: { id: true, name: true }
        }
      },
    });

    const mappedPresets = presets.map(preset => ({
      id: preset.id,
      name: preset.name,
      kind: preset.kind,
      fixedDebitAccount: preset.fixedDebitAccount,
      fixedCreditAccount: preset.fixedCreditAccount,
      requiresVariableAccount: preset.requiresVariableAccount,
      requiresPartner: preset.requiresPartner,
    }));

    return { success: true, data: mappedPresets };
  } catch (error) {
    console.error('Failed to fetch presets:', error);
    return { success: false, error: "プリセットの取得に失敗しました" };
  }
};
