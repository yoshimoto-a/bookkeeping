import { z } from "zod";
import type { PresetKind } from "@prisma/client";

export const transactionItemSchema = z.object({
  txDate: z.string().min(1, "取引日を入力してください"),
  amount: z
    .number({ message: "金額を入力してください" })
    .int("整数で入力してください")
    .positive("1以上の金額を入力してください"),
  description: z
    .string()
    .max(200, "摘要は200文字以内で入力してください")
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  partnerId: z
    .string()
    .nullable()
    .transform((v) => (v && v.trim() !== "" ? v : null)),
  variableAccountId: z
    .string()
    .nullable()
    .transform((v) => (v && v.trim() !== "" ? v : null)),
});

export const transactionFormSchema = z.object({
  presetId: z.string().min(1, "テンプレートを選択してください"),
  items: z.array(transactionItemSchema).min(1),
});

export type TransactionItemValues = z.input<typeof transactionItemSchema>;
export type TransactionFormValues = z.input<typeof transactionFormSchema>;
export type TransactionFormData = z.infer<typeof transactionFormSchema>;

export type PresetForForm = {
  id: string;
  name: string;
  kind: PresetKind;
  fixedDebitAccount: { id: string; name: string } | null;
  fixedCreditAccount: { id: string; name: string } | null;
  requiresVariableAccount: boolean;
  requiresPartner: boolean;
};

export type JournalLine = {
  accountId: string;
  accountName: string;
  parentAccountId: string | null;
  parentAccountName: string | null;
  debit: number;
  credit: number;
};

export type JournalRow = {
  id: string;
  txDate: Date;
  lines: JournalLine[];
  description: string | null;
};
