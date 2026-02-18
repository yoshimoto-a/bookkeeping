"use client";

import { useWatch, useFormContext, Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { Trash2 } from "lucide-react";
import type { JournalEntryFormValues } from "@/app/_types/journal";
import type { AccountWithMeta } from "@/app/_types/settings";
import { AppAutocomplete } from "@/app/_components/AppAutocomplete";
import type { AccountOption } from "./types";

type Props = {
  side: "debitLines" | "creditLines";
  index: number;
  accountOptions: AccountOption[];
  accounts: AccountWithMeta[];
  canRemove: boolean;
  onRemove: () => void;
};

export const JournalLineRow = ({
  side,
  index,
  accountOptions,
  accounts,
  canRemove,
  onRemove,
}: Props) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<JournalEntryFormValues>();

  const accountId = useWatch({ control, name: `${side}.${index}.accountId` });
  const selectedAccount = accounts.find((a) => a.id === accountId);
  const children = selectedAccount?.children ?? [];
  const subAccountOptions = children.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const sideErrors = errors[side];

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <Controller
          name={`${side}.${index}.accountId`}
          control={control}
          render={({ field: f }) => (
            <AppAutocomplete
              label="科目"
              value={f.value || null}
              options={accountOptions}
              groupBy={(o) => o.group ?? ""}
              onChange={(val) => {
                f.onChange(val ?? "");
                setValue(`${side}.${index}.subAccountId`, undefined);
              }}
            />
          )}
        />
      </div>
      {children.length > 0 && (
        <div className="flex-1">
          <Controller
            name={`${side}.${index}.subAccountId`}
            control={control}
            render={({ field: f }) => (
              <AppAutocomplete
                label="補助科目"
                value={f.value || null}
                options={subAccountOptions}
                onChange={(val) => f.onChange(val ?? "")}
              />
            )}
          />
        </div>
      )}
      <div className="w-36">
        <TextField
          label="金額"
          type="number"
          size="small"
          fullWidth
          error={!!sideErrors?.[index]?.amount}
          helperText={sideErrors?.[index]?.amount?.message}
          {...register(`${side}.${index}.amount`, {
            valueAsNumber: true,
          })}
        />
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
          title="行を削除"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};
