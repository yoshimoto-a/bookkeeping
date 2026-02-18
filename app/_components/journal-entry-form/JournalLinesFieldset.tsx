"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";
import type { JournalEntryFormValues } from "@/app/_types/journal";
import type { AccountWithMeta } from "@/app/_types/settings";
import { JournalLineRow } from "./JournalLineRow";
import type { AccountOption } from "./types";

type Props = {
  side: "debitLines" | "creditLines";
  label: string;
  accountOptions: AccountOption[];
  accounts: AccountWithMeta[];
};

export const JournalLinesFieldset = ({
  side,
  label,
  accountOptions,
  accounts,
}: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<JournalEntryFormValues>();

  const { fields, append, remove } = useFieldArray({ control, name: side });

  const sideErrors = errors[side];

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">{label}</legend>
      {fields.map((field, index) => (
        <JournalLineRow
          key={field.id}
          side={side}
          index={index}
          accountOptions={accountOptions}
          accounts={accounts}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        />
      ))}
      {sideErrors?.message && (
        <p className="text-xs text-red-500">{sideErrors.message}</p>
      )}
      {sideErrors?.root?.message && (
        <p className="text-xs text-red-500">{sideErrors.root.message}</p>
      )}
      <button
        type="button"
        onClick={() => append({ accountId: "", amount: 0 })}
        className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
      >
        <Plus size={14} />
        {label}行を追加
      </button>
    </fieldset>
  );
};
