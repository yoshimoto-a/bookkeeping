"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { accountFormSchema, type AccountFormData, type ActionResult } from "@/app/_types/settings";

export const createAccount = async (data: AccountFormData): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = accountFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { code, name, type, parentId } = parsed.data;

  const existing = await prisma.account.findUnique({
    where: { userId_code: { userId: user.id, code } },
  });
  if (existing) return { success: false, error: "この科目コードは既に使用されています" };

  if (parentId) {
    const parent = await prisma.account.findFirst({ where: { id: parentId, userId: user.id } });
    if (!parent) return { success: false, error: "親科目が見つかりません" };
    if (parent.parentId) return { success: false, error: "補助科目の下にさらに補助科目は作成できません" };
  }

  await prisma.account.create({
    data: {
      userId: user.id,
      parentId,
      code,
      name,
      type: parentId
        ? (await prisma.account.findUniqueOrThrow({ where: { id: parentId } })).type
        : type,
    },
  });

  revalidatePath("/settings", "layout");
  return { success: true };
};
