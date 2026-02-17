"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/app/_types/transaction";

export const createTransactions = async (
  data: TransactionFormValues
): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = transactionFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { presetId, items } = parsed.data;

  const preset = await prisma.preset.findFirst({
    where: { id: presetId, userId: user.id },
  });
  if (!preset) return { error: "テンプレートが見つかりません" };

  for (const [i, item] of items.entries()) {
    if (preset.requiresVariableAccount && !item.variableAccountId) {
      return { error: `${i + 1}行目: 可変口座を選択してください` };
    }
    if (preset.requiresPartner && !item.partnerId) {
      return { error: `${i + 1}行目: 取引先を選択してください` };
    }
  }

  const resolveAccountIds = (variableAccountId: string | null | undefined) => {
    if (preset.kind === "TWO_SIDE_FIXED") {
      if (!preset.fixedDebitAccountId || !preset.fixedCreditAccountId) return null;
      return { debitAccountId: preset.fixedDebitAccountId, creditAccountId: preset.fixedCreditAccountId };
    }
    const debitAccountId = preset.fixedDebitAccountId ?? variableAccountId;
    const creditAccountId = preset.fixedCreditAccountId ?? variableAccountId;
    if (!debitAccountId || !creditAccountId) return null;
    return { debitAccountId, creditAccountId };
  };

  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const resolved = resolveAccountIds(item.variableAccountId);
      if (!resolved) throw new Error("テンプレートの科目設定が不正です");

      const entryDate = new Date(item.txDate);

      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          presetId,
          txDate: entryDate,
          amount: item.amount,
          description: item.description ?? null,
          partnerId: item.partnerId,
          variableAccountId: item.variableAccountId,
        },
      });

      const journalEntry = await tx.journalEntry.create({
        data: {
          userId: user.id,
          entryDate,
          description: item.description ?? null,
          origin: "PRESET",
          partnerId: item.partnerId,
          transactionId: transaction.id,
        },
      });

      await tx.journalLine.createMany({
        data: [
          {
            journalEntryId: journalEntry.id,
            accountId: resolved.debitAccountId,
            debit: item.amount,
            credit: 0,
          },
          {
            journalEntryId: journalEntry.id,
            accountId: resolved.creditAccountId,
            debit: 0,
            credit: item.amount,
          },
        ],
      });
    }
  });

  revalidatePath("/transactions/new");
  return { success: true };
};
