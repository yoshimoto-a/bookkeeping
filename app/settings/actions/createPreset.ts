"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";
import { presetFormSchema, type PresetFormValues } from "@/app/_types/preset";

export const createPreset = async (data: PresetFormValues): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = presetFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { __fixedSide: _, ...presetData } = parsed.data;
  await prisma.preset.create({
    data: {
      userId: user.id,
      ...presetData,
    },
  });

  revalidatePath("/settings", "layout");
  return { success: true };
};
