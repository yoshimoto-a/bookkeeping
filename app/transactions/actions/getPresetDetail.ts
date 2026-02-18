"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { QueryResult } from "@/app/_types/settings";
import type { PresetForForm } from "@/app/_types/transaction";

export const getPresetDetail = async (presetId: string): Promise<QueryResult<PresetForForm>> => {
  try {
    const user = await getAuthenticatedUser();
    
    const preset = await prisma.preset.findFirst({
      where: { id: presetId, userId: user.id },
      include: {
        fixedDebitAccount: {
          select: { id: true, name: true }
        },
        fixedCreditAccount: {
          select: { id: true, name: true }
        }
      }
    });

    if (!preset) {
      return { success: false, error: "プリセットが見つかりません" };
    }

    return {
      success: true,
      data: {
        id: preset.id,
        name: preset.name,
        kind: preset.kind,
        fixedDebitAccount: preset.fixedDebitAccount,
        fixedCreditAccount: preset.fixedCreditAccount,
        requiresVariableAccount: preset.requiresVariableAccount,
        requiresPartner: preset.requiresPartner,
      }
    };
  } catch {
    return { success: false, error: "プリセット情報の取得に失敗しました" };
  }
};
