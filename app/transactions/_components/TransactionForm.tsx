"use client";

import { useForm, useFieldArray, useWatch, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MenuItem } from "@mui/material";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
  transactionFormSchema,
  type TransactionFormValues,
  type TransactionItemValues,
  type PresetForForm,
} from "@/app/_types/transaction";
import type { AccountWithMeta } from "@/app/_types/settings";
import type { PartnerWithMeta } from "@/app/_types/partner";
import { createTransactions } from "@/app/transactions/actions/createTransaction";
import { AppSelect } from "@/app/_components/AppSelect";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { SecondaryButton } from "@/app/_components/SecondaryButton";
import { TransactionRowCard } from "./TransactionRowCard";

import "dayjs/locale/ja";

type Props = {
  presets: PresetForForm[];
  accounts: AccountWithMeta[];
  partners: PartnerWithMeta[];
};

const emptyItem: TransactionItemValues = {
  txDate: "",
  amount: 0,
  description: "",
  partnerId: null,
  variableAccountId: null,
};

export const TransactionForm = ({ presets, accounts, partners }: Props) => {
  const methods = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: { presetId: "", items: [emptyItem] },
  });

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const selectedPresetId = useWatch({ control, name: "presetId" });
  const selectedPreset = selectedPresetId ? presets.find((p) => p.id === selectedPresetId) : null;

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      const result = await createTransactions(data);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`${data.items.length}件の仕訳を登録しました`);
      reset({ presetId: selectedPresetId, items: [emptyItem] });
    } catch {
      toast.error("登録に失敗しました。時間をおいて再度お試しください");
    }
  };

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-between">
            <div className="max-w-sm">
              <Controller
                name="presetId"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    label="テンプレート"
                    value={field.value}
                    onChange={field.onChange}
                    errorText={errors.presetId?.message}
                  >
                    <MenuItem value="">選択してください</MenuItem>
                    {presets.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </AppSelect>
                )}
              />
            </div>

            {/* 両側固定の場合の科目表示 */}
            {selectedPreset?.kind === "TWO_SIDE_FIXED" && (
              <div className="max-w-md rounded-md bg-blue-50 p-3 text-sm dark:bg-blue-950/30">
                <div className="mb-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                  この仕訳の内訳
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1 text-xs font-medium text-zinc-500">借方</div>
                    <div className="text-zinc-900 dark:text-zinc-100">
                      {selectedPreset.fixedDebitAccount?.name || "未設定"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-medium text-zinc-500">貸方</div>
                    <div className="text-zinc-900 dark:text-zinc-100">
                      {selectedPreset.fixedCreditAccount?.name || "未設定"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>          {fields.map((field, index) => (
            <TransactionRowCard
              key={field.id}
              index={index}
              selectedPreset={selectedPreset ?? null}
              accounts={accounts}
              partners={partners}
              removable={fields.length > 1}
              onRemove={() => remove(index)}
            />
          ))}

        <div className="flex items-center gap-3 pt-2">
          <PrimaryButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "登録中..." : `${fields.length}件を登録`}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            onClick={() => append(emptyItem)}
          >
            <Plus size={16} className="mr-1 inline" />
            行を追加
          </SecondaryButton>
        </div>
      </form>
    </LocalizationProvider>
    </FormProvider>
  );
};
