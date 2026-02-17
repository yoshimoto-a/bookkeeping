"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";

export const deletePreset = async (id: string): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();

  const preset = await prisma.preset.findFirst({ where: { id, userId: user.id } });
  if (!preset) return { success: false, error: "定型仕訳が見つかりません" };

  const usedInTransaction = await prisma.transaction.findFirst({ where: { presetId: id } });
  if (usedInTransaction) return { success: false, error: "この定型仕訳は使用中のため削除できません" };

  await prisma.preset.delete({ where: { id } });

  revalidatePath("/settings", "layout");
  return { success: true };
};
