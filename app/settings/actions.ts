"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  accountFormSchema,
  taxStatusFormSchema,
  type AccountFormData,
  type TaxStatusFormData,
  type ActionResult,
} from "@/app/_types/settings";
import { presetFormSchema, type PresetFormData } from "@/app/_types/preset";

export const createAccount = async (data: AccountFormData): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = accountFormSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { code, name, type, parentId } = parsed.data;

  const existing = await prisma.account.findUnique({
    where: { userId_code: { userId: user.id, code } },
  });
  if (existing) return { error: "この科目コードは既に使用されています" };

  if (parentId) {
    const parent = await prisma.account.findFirst({ where: { id: parentId, userId: user.id } });
    if (!parent) return { error: "親科目が見つかりません" };
    if (parent.parentId) return { error: "補助科目の下にさらに補助科目は作成できません" };
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

  revalidatePath("/settings");
  return { success: true };
};

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
    if (code !== account.code || type !== account.type) {
      return { error: "オーナー勘定の科目コード・分類は変更できません" };
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

  revalidatePath("/settings");
  return { success: true };
};

export const deleteAccount = async (id: string): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();

  const account = await prisma.account.findFirst({
    where: { id, userId: user.id },
    include: { children: { select: { id: true } } },
  });
  if (!account) return { error: "勘定科目が見つかりません" };

  const { isOwnerAccount, children } = account;
  if (isOwnerAccount) return { error: "オーナー勘定は削除できません" };
  if (children.length > 0) {
    return { error: "補助科目を持つ科目は削除できません。先に補助科目を削除してください" };
  }

  const usedInJournal = await prisma.journalLine.findFirst({ where: { accountId: id } });
  if (usedInJournal) return { error: "この勘定科目は使用中のため削除できません" };

  await prisma.account.delete({ where: { id } });

  revalidatePath("/settings");
  return { success: true };
};

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

export const createPreset = async (data: PresetFormData): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = presetFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.preset.create({
    data: {
      userId: user.id,
      ...parsed.data,
    },
  });

  revalidatePath("/settings");
  return { success: true };
};

export const updatePreset = async (id: string, data: PresetFormData): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();
  const parsed = presetFormSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const preset = await prisma.preset.findFirst({ where: { id, userId: user.id } });
  if (!preset) return { error: "定型仕訳が見つかりません" };

  await prisma.preset.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/settings");
  return { success: true };
};

export const deletePreset = async (id: string): Promise<ActionResult> => {
  const user = await getAuthenticatedUser();

  const preset = await prisma.preset.findFirst({ where: { id, userId: user.id } });
  if (!preset) return { error: "定型仕訳が見つかりません" };

  const usedInTransaction = await prisma.transaction.findFirst({ where: { presetId: id } });
  if (usedInTransaction) return { error: "この定型仕訳は使用中のため削除できません" };

  await prisma.preset.delete({ where: { id } });

  revalidatePath("/settings");
  return { success: true };
};
