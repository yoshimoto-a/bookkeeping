"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { taxStatusFormSchema, type TaxStatusFormData, type ActionResult } from "@/app/_types/settings";

export const upsertFiscalYearSetting = async (
  fiscalYear: number,
  data: TaxStatusFormData
): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = taxStatusFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { taxStatus } = parsed.data;

  await prisma.fiscalYearSetting.upsert({
    where: { userId_fiscalYear: { userId: user.id, fiscalYear } },
    create: { userId: user.id, fiscalYear, taxStatus },
    update: { taxStatus },
  });

  revalidatePath("/settings");
  return { success: true };
};
