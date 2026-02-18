import { prisma } from "@/lib/prisma";
import type { PresetForForm } from "@/app/_types/transaction";

export const getPresetsForForm = async (userId: string): Promise<PresetForForm[]> =>
  prisma.preset.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      kind: true,
      fixedDebitAccountId: true,
      fixedCreditAccountId: true,
      requiresVariableAccount: true,
      requiresPartner: true,
    },
  });
