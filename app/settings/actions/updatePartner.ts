"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import type { ActionResult } from "@/app/_types/settings";
import { partnerFormSchema, normalizePartnerData, type PartnerFormData } from "@/app/_types/partner";

export const updatePartner = async (id: string, data: PartnerFormData): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = partnerFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const partner = await prisma.partner.findFirst({ where: { id, userId: user.id } });
  if (!partner) return { error: "取引先が見つかりません" };

  const normalized = normalizePartnerData(parsed.data);

  await prisma.partner.update({
    where: { id },
    data: normalized,
  });

  revalidatePath("/settings", "layout");
  return { success: true };
};
