"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";

export const deleteAccount = async (id: string): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();

  const account = await prisma.account.findFirst({
    where: { id, userId: user.id },
    include: { children: { select: { id: true } } },
  });
  if (!account) return { error: "勘定科目が見つかりません" };

  const { isOwnerAccount, children } = account;
  if (isOwnerAccount) return { error: "オーナー勘定は削除できません" };
  if (children.length > 0) {
    return { error: "補助科目を持つ科目は削除できません。先に補助科目を削除してください" };
  }

  const usedInJournal = await prisma.journalLine.findFirst({ where: { accountId: id } });
  if (usedInJournal) return { error: "この勘定科目は使用中のため削除できません" };

  await prisma.account.delete({ where: { id } });

  revalidatePath("/settings", "layout");
  return { success: true };
};
