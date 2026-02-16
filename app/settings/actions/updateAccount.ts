"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { accountFormSchema, type AccountFormData, type ActionResult } from "@/app/_types/settings";

export const updateAccount = async (id: string, data: AccountFormData): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = accountFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { code, name, type } = parsed.data;

  const account = await prisma.account.findFirst({
    where: { id, userId: user.id },
    include: { children: { select: { id: true } } },
  });
  if (!account) return { error: "勘定科目が見つかりません" };

  if (account.isOwnerAccount) {
    if (code !== account.code || name !== account.name || type !== account.type) {
      return { error: "デフォルト勘定の科目コード・科目名・分類は変更できません" };
    }
  }

  if (account.children.length > 0 && type !== account.type) {
    return { error: "補助科目を持つ科目の分類は変更できません" };
  }

  const duplicate = await prisma.account.findFirst({
    where: { userId: user.id, code, id: { not: id } },
  });
  if (duplicate) return { error: "この科目コードは既に使用されています" };

  await prisma.account.update({
    where: { id },
    data: { code, name, type },
  });

  revalidatePath("/settings", "layout");
  return { success: true };
};
