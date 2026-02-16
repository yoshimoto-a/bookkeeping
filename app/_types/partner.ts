import { z } from "zod";

export const partnerFormSchema = z.object({
  name: z
    .string()
    .min(1, "取引先名を入力してください")
    .max(50, "取引先名は50文字以内で入力してください"),
  code: z
    .string()
    .max(30, "コードは30文字以内で入力してください")
    .optional(),
  defaultReceiptAccountId: z.string().optional(),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;

const toNullIfEmpty = (v: string | undefined): string | null =>
  v && v.trim() !== "" ? v : null;

export const normalizePartnerData = (data: PartnerFormData) => ({
  name: data.name,
  code: toNullIfEmpty(data.code),
  defaultReceiptAccountId: toNullIfEmpty(data.defaultReceiptAccountId),
});

export type PartnerWithMeta = {
  id: string;
  name: string;
  code: string | null;
  defaultReceiptAccountName: string | null;
  defaultReceiptAccountId: string | null;
  isReferenced: boolean;
};
