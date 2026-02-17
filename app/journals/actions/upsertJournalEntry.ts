"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";
import {
  journalEntryFormSchema,
  type JournalEntryFormValues,
} from "@/app/_types/journal";

export const upsertJournalEntry = async (
  journalEntryId: string | null,
  data: JournalEntryFormValues
): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = journalEntryFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { entryDate, debitAccountId, creditAccountId, amount, description } =
    parsed.data;

  const entryDateValue = new Date(entryDate);

  if (journalEntryId) {
    const existing = await prisma.journalEntry.findFirst({
      where: { id: journalEntryId, userId: user.id },
    });
    if (!existing) return { error: "仕訳が見つかりません" };

    await prisma.$transaction(async (tx) => {
      await tx.journalEntry.update({
        where: { id: journalEntryId },
        data: {
          entryDate: entryDateValue,
          description: description ?? null,
        },
      });

      await tx.journalLine.deleteMany({
        where: { journalEntryId },
      });

      await tx.journalLine.createMany({
        data: [
          {
            journalEntryId,
            accountId: debitAccountId,
            debit: amount,
            credit: 0,
          },
          {
            journalEntryId,
            accountId: creditAccountId,
            debit: 0,
            credit: amount,
          },
        ],
      });
    });
  } else {
    await prisma.$transaction(async (tx) => {
      const journalEntry = await tx.journalEntry.create({
        data: {
          userId: user.id,
          entryDate: entryDateValue,
          description: description ?? null,
          origin: "TRANSFER",
        },
      });

      await tx.journalLine.createMany({
        data: [
          {
            journalEntryId: journalEntry.id,
            accountId: debitAccountId,
            debit: amount,
            credit: 0,
          },
          {
            journalEntryId: journalEntry.id,
            accountId: creditAccountId,
            debit: 0,
            credit: amount,
          },
        ],
      });
    });
  }

  revalidatePath("/journals");
  revalidatePath("/transfers/new");
  return { success: true };
};
