import { z } from "zod";

export const journalEntryFormSchema = z.object({
  entryDate: z.string().min(1, "日付を入力してください"),
  debitAccountId: z.string().min(1, "借方科目を選択してください"),
  creditAccountId: z.string().min(1, "貸方科目を選択してください"),
  amount: z
    .number({ message: "金額を入力してください" })
    .int("整数で入力してください")
    .positive("1以上の金額を入力してください"),
  description: z
    .string()
    .max(200, "摘要は200文字以内で入力してください")
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v.trim() : undefined)),
});

export type JournalEntryFormValues = z.input<typeof journalEntryFormSchema>;
export type JournalEntryFormData = z.infer<typeof journalEntryFormSchema>;
