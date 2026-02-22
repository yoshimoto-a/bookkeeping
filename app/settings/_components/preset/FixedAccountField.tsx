"use client";

import { FormError } from "@/app/_components/FormError";
import { useFormContext, Controller } from "react-hook-form";
import type { PresetFormData } from "@/app/_types/preset";
import type { AccountWithMeta } from "@/app/_types/settings";
import { AppAutocomplete } from "@/app/_components/AppAutocomplete";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants/accountTypes";

type Props = {
  accounts: AccountWithMeta[];
  name: "fixedDebitAccountId" | "fixedCreditAccountId";
  label: string;
};

export const FixedAccountField = ({ accounts, name, label }: Props) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<PresetFormData>();

  const options = accounts.map((a) => {
    if (a.parentId) {
      // 補助科目の場合は親科目名も表示
      const parent = accounts.find(parent => parent.id === a.parentId);
      return {
        value: a.id,
        label: `${parent?.name} / ${a.name}`,
        group: ACCOUNT_TYPE_LABELS[a.type],
      };
    } else {
      // 親科目の場合
      return {
        value: a.id,
        label: a.name,
        group: ACCOUNT_TYPE_LABELS[a.type],
      };
    }
  });

  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <AppAutocomplete
            label={label}
            value={field.value}
            options={options}
            groupBy={(o) => o.group ?? ""}
            onChange={(val) => {
              field.onChange(val);
              field.onBlur();
            }}
          />
        )}
      />
      <FormError message={errors[name]?.message} />
    </div>
  );
};
