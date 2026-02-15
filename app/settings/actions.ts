"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  accountFormSchema,
  type AccountFormData,
  type ActionResult,
} from "@/app/_types/settings";

export const createAccount = async (data: AccountFormData): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = accountFormSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.account.findUnique({
    where: { userId_code: { userId: user.id, code: parsed.data.code } },
  });
  if (existing) {
    return { error: "この科目コードは既に使用されています" };
  }

  if (parsed.data.parentId) {
    const parent = await prisma.account.findFirst({
      where: { id: parsed.data.parentId, userId: user.id },
    });
    if (!parent) {
      return { error: "親科目が見つかりません" };
    }
    if (parent.parentId) {
      return { error: "補助科目の下にさらに補助科目は作成できません" };
    }
  }

  await prisma.account.create({
    data: {
      userId: user.id,
      parentId: parsed.data.parentId,
      code: parsed.data.code,
      name: parsed.data.name,
      type: parsed.data.parentId
        ? (await prisma.account.findUniqueOrThrow({ where: { id: parsed.data.parentId } })).type
        : parsed.data.type,
    },
  });

  revalidatePath("/settings");
  return { success: true };
};

export const updateAccount = async (
  id: string,
  data: AccountFormData
): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = accountFormSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const account = await prisma.account.findFirst({
    where: { id, userId: user.id },
    include: { children: { select: { id: true } } },
  });
  if (!account) {
    return { error: "勘定科目が見つかりません" };
  }

  if (account.isOwnerAccount) {
    if (parsed.data.code !== account.code || parsed.data.type !== account.type) {
      return { error: "オーナー勘定の科目コード・分類は変更できません" };
    }
  }

  if (account.children.length > 0 && parsed.data.type !== account.type) {
    return { error: "補助科目を持つ科目の分類は変更できません" };
  }

  const duplicate = await prisma.account.findFirst({
    where: {
      userId: user.id,
      code: parsed.data.code,
      id: { not: id },
    },
  });
  if (duplicate) {
    return { error: "この科目コードは既に使用されています" };
  }

  await prisma.account.update({
    where: { id },
    data: {
      code: parsed.data.code,
      name: parsed.data.name,
      type: parsed.data.type,
    },
  });

  revalidatePath("/settings");
  return { success: true };
};

export const deleteAccount = async (id: string): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();

  const account = await prisma.account.findFirst({
    where: { id, userId: user.id },
    include: { children: { select: { id: true } } },
  });
  if (!account) {
    return { error: "勘定科目が見つかりません" };
  }

  if (account.isOwnerAccount) {
    return { error: "オーナー勘定は削除できません" };
  }

  if (account.children.length > 0) {
    return { error: "補助科目を持つ科目は削除できません。先に補助科目を削除してください" };
  }

  const usedInJournal = await prisma.journalLine.findFirst({
    where: { accountId: id },
  });

  if (usedInJournal) {
    return { error: "この勘定科目は使用中のため削除できません" };
  }

  await prisma.account.delete({ where: { id } });

  revalidatePath("/settings");
  return { success: true };
};
