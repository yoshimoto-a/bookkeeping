"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";
import { partnerFormSchema, normalizePartnerData, type PartnerFormData } from "@/app/_types/partner";

export const createPartner = async (data: PartnerFormData): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = partnerFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const normalized = normalizePartnerData(parsed.data);

  await prisma.partner.create({
    data: {
      userId: user.id,
      ...normalized,
    },
  });

  revalidatePath("/settings", "layout");
  return { success: true };
};
