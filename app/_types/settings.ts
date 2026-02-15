import { z } from "zod";
import type { AccountType, TaxMethod, BusinessTaxStatus } from "@prisma/client";

export const accountFormSchema = z.object({
  code: z
    .string()
    .min(1, "科目コードを入力してください")
    .max(30, "科目コードは30文字以内で入力してください"),
  name: z
    .string()
    .min(1, "科目名を入力してください")
    .max(50, "科目名は50文字以内で入力してください"),
  type: z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"], {
    message: "勘定科目の分類を選択してください",
  }),
  parentId: z.string().nullable(),
});

export type AccountFormData = z.infer<typeof accountFormSchema>;

export const policyFormSchema = z.object({
  taxMethod: z.enum(["TAX_INCLUSIVE", "TAX_EXCLUSIVE"]),
  businessTaxStatus: z.enum(["EXEMPT", "TAXABLE"]),
});

export type PolicyFormData = z.infer<typeof policyFormSchema>;

export type AccountWithMeta = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId: string | null;
  isOwnerAccount: boolean;
  isReferenced: boolean;
  children: { id: string; code: string; name: string }[];
};

export type PolicyData = {
  id: string;
  fiscalYear: number;
  taxMethod: TaxMethod;
  businessTaxStatus: BusinessTaxStatus;
} | null;

export type ActionResult = { success: true } | { error: string };
