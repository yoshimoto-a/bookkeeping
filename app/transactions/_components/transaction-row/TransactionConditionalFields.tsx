"use client";

import { Controller, useFormContext } from "react-hook-form";
import { MenuItem } from "@mui/material";
import type { TransactionFormValues, PresetForForm } from "@/app/_types/transaction";
import type { AccountWithMeta } from "@/app/_types/settings";
import type { PartnerWithMeta } from "@/app/_types/partner";
import { AppSelect } from "@/app/_components/AppSelect";
import { AppAutocomplete } from "@/app/_components/AppAutocomplete";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants/accountTypes";

type Props = {
  index: number;
  selectedPreset: PresetForForm;
  accounts: AccountWithMeta[];
  partners: PartnerWithMeta[];
};

export const TransactionConditionalFields = ({
  index,
  selectedPreset,
  accounts,
  partners,
}: Props) => {
  const { control, formState: { errors } } = useFormContext<TransactionFormValues>();
  const itemErrors = errors.items?.[index];

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: a.name,
    group: ACCOUNT_TYPE_LABELS[a.type],
  }));

  return (
    <>
      {selectedPreset.requiresVariableAccount && (
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

      {selectedPreset.requiresPartner && (
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
    </>
  );
};
