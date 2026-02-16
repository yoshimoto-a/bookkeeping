"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";

export const deletePartner = async (id: string): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();

  const partner = await prisma.partner.findFirst({ where: { id, userId: user.id } });
  if (!partner) return { error: "取引先が見つかりません" };

  const usedInJournal = await prisma.journalEntry.findFirst({ where: { partnerId: id } });
  if (usedInJournal) return { error: "この取引先は仕訳データで使用中のため削除できません" };

  await prisma.partner.delete({ where: { id } });

  revalidatePath("/settings", "layout");
  return { success: true };
};
