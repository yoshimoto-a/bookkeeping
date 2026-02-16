"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";
import { presetFormSchema, type PresetFormValues } from "@/app/_types/preset";

export const updatePreset = async (id: string, data: PresetFormValues): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = presetFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const preset = await prisma.preset.findFirst({ where: { id, userId: user.id } });
  if (!preset) return { error: "定型仕訳が見つかりません" };

  const { __fixedSide: _, ...presetData } = parsed.data;
  await prisma.preset.update({
    where: { id },
    data: presetData,
  });

  revalidatePath("/settings");
  return { success: true };
};
