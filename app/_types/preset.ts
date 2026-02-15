import { z } from "zod";
import type { PresetKind } from "@prisma/client";

export const presetFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "名前を入力してください")
      .max(50, "名前は50文字以内で入力してください"),
    kind: z.enum(["ONE_SIDE_FIXED", "TWO_SIDE_FIXED"], {
      message: "種別を選択してください",
    }),
    fixedDebitAccountId: z
      .string()
      .nullable()
      .transform((v) => (v && v.trim() !== "" ? v : null)),
    fixedCreditAccountId: z
      .string()
      .nullable()
      .transform((v) => (v && v.trim() !== "" ? v : null)),
    requiresPartner: z.boolean(),
    __fixedSide: z.enum(["debit", "credit"]).default("debit"),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "ONE_SIDE_FIXED") {
      if (data.__fixedSide === "debit") {
        if (!data.fixedDebitAccountId) {
          ctx.addIssue({ code: "custom", path: ["fixedDebitAccountId"], message: "必須です" });
        }
      } else {
        if (!data.fixedCreditAccountId) {
          ctx.addIssue({ code: "custom", path: ["fixedCreditAccountId"], message: "必須です" });
        }
      }
    } else if (data.kind === "TWO_SIDE_FIXED") {
      if (!data.fixedDebitAccountId) {
        ctx.addIssue({ code: "custom", path: ["fixedDebitAccountId"], message: "必須です" });
      }
      if (!data.fixedCreditAccountId) {
        ctx.addIssue({ code: "custom", path: ["fixedCreditAccountId"], message: "必須です" });
      }
    }
  });

// 入力側（RHF）の型: defaultにより __fixedSide は未入力でも可
export type PresetFormValues = {
  name: string;
  kind: "ONE_SIDE_FIXED" | "TWO_SIDE_FIXED";
  fixedDebitAccountId: string | null;
  fixedCreditAccountId: string | null;
  requiresPartner: boolean;
  __fixedSide: "debit" | "credit";
};

// バリデーション後の型（出力）
export type PresetFormData = z.infer<typeof presetFormSchema>;

export type PresetWithAccounts = {
  id: string;
  name: string;
  kind: PresetKind;
  fixedDebitAccount: { id: string; name: string } | null;
  fixedCreditAccount: { id: string; name: string } | null;
  requiresPartner: boolean;
  isReferenced: boolean;
};
