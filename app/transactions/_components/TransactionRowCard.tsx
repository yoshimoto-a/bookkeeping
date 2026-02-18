"use client";

import { Controller, type Control, type UseFormReturn } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MenuItem, TextField } from "@mui/material";
import { Trash2 } from "lucide-react";
import dayjs, { type Dayjs } from "dayjs";
import type { TransactionFormValues, PresetForForm } from "@/app/_types/transaction";
import type { AccountWithMeta } from "@/app/_types/settings";
import type { PartnerWithMeta } from "@/app/_types/partner";
import { AppSelect } from "@/app/_components/AppSelect";
import { AppAutocomplete } from "@/app/_components/AppAutocomplete";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants/accountTypes";

type Props = {
  index: number;
  control: Control<TransactionFormValues>;
  methods: UseFormReturn<TransactionFormValues>;
  selectedPreset: PresetForForm | null;
  accounts: AccountWithMeta[];
  partners: PartnerWithMeta[];
  removable: boolean;
  onRemove: () => void;
};

export const TransactionRowCard = ({
  index,
  control,
  methods,
  selectedPreset,
  accounts,
  partners,
  removable,
  onRemove,
}: Props) => {
  const { register, formState: { errors } } = methods;
  const itemErrors = errors.items?.[index];

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: a.name,
    group: ACCOUNT_TYPE_LABELS[a.type],
  }));

  const amountField = register(`items.${index}.amount`, { valueAsNumber: true });
  const descriptionField = register(`items.${index}.description`);

  return (
    <div className="relative rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-3 top-3 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
          title="この行を削除"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div className="mb-3 text-xs font-medium text-zinc-400">{index + 1}行目</div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name={`items.${index}.txDate`}
          control={control}
          render={({ field }) => (
            <DatePicker
              label="取引日"
              value={field.value ? dayjs(field.value) : null}
              onChange={(val: Dayjs | null) => {
                field.onChange(val ? val.format("YYYY-MM-DD") : "");
              }}
              format="YYYY/MM/DD"
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true,
                  error: !!itemErrors?.txDate,
                  helperText: itemErrors?.txDate?.message,
                },
              }}
            />
          )}
        />

        <TextField
          label="金額"
          type="number"
          size="small"
          fullWidth
          error={!!itemErrors?.amount}
          helperText={itemErrors?.amount?.message}
          {...amountField}
        />

        <TextField
          label="摘要"
          size="small"
          fullWidth
          placeholder="任意"
          error={!!itemErrors?.description}
          helperText={itemErrors?.description?.message}
          {...descriptionField}
        />

        {selectedPreset?.requiresVariableAccount && (
          <Controller
            name={`items.${index}.variableAccountId`}
            control={control}
            render={({ field }) => (
              <AppAutocomplete
                label="可変口座"
                value={field.value ?? null}
                options={accountOptions}
                groupBy={(o) => o.group ?? ""}
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
              />
            )}
          />
        )}

        {selectedPreset?.requiresPartner && (
          <Controller
            name={`items.${index}.partnerId`}
            control={control}
            render={({ field }) => (
              <AppSelect
                label="取引先"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
                errorText={itemErrors?.partnerId?.message}
              >
                <MenuItem value="">選択してください</MenuItem>
                {partners.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </AppSelect>
            )}
          />
        )}
      </div>
    </div>
  );
};
