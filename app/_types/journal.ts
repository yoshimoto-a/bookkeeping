import { z } from "zod";

const journalLineSchema = z.object({
  accountId: z.string().min(1, "科目を選択してください"),
  subAccountId: z.string().optional(),
  amount: z
    .number({ message: "金額を入力してください" })
    .int("整数で入力してください")
    .positive("1以上の金額を入力してください"),
});

const sumAmounts = (lines: { amount: number }[]) =>
  lines.reduce((acc, l) => acc + l.amount, 0);

export const journalEntryFormSchema = z
  .object({
    entryDate: z.string().min(1, "日付を入力してください"),
    debitLines: z
      .array(journalLineSchema)
      .min(1, "借方を1行以上入力してください"),
    creditLines: z
      .array(journalLineSchema)
      .min(1, "貸方を1行以上入力してください"),
    description: z
      .string()
      .max(200, "摘要は200文字以内で入力してください")
      .optional()
      .transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
  })
  .refine((d) => sumAmounts(d.debitLines) === sumAmounts(d.creditLines), {
    message: "借方合計と貸方合計が一致しません",
    path: ["creditLines"],
  });

export type JournalEntryFormValues = z.input<typeof journalEntryFormSchema>;
export type JournalEntryFormData = z.infer<typeof journalEntryFormSchema>;
