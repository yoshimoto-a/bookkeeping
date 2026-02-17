"use client";

import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
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
  amount: undefined as unknown as number,
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
  const selectedPreset = presets.find((p) => p.id === selectedPresetId);

  const onSubmit = async (data: TransactionFormValues) => {
    const result = await createTransactions(data).catch(() => ({
      error: "登録に失敗しました。時間をおいて再度お試しください",
    }));
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(`${data.items.length}件の仕訳を登録しました`);
    reset({ presetId: selectedPresetId, items: [emptyItem] });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {fields.map((field, index) => (
          <TransactionRowCard
            key={field.id}
            index={index}
            control={control}
            methods={methods}
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
  );
};
