"use client";

import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import type { TransactionFormValues } from "@/app/_types/transaction";

type Props = {
  index: number;
};

export const TransactionBasicFields = ({ index }: Props) => {
  const { control, register, formState: { errors } } = useFormContext<TransactionFormValues>();
  const itemErrors = errors.items?.[index];

  return (
    <>
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
        {...register(`items.${index}.amount`, { valueAsNumber: true })}
      />

      <TextField
        label="摘要"
        size="small"
        fullWidth
        placeholder="任意"
        error={!!itemErrors?.description}
        helperText={itemErrors?.description?.message}
        {...register(`items.${index}.description`)}
      />
    </>
  );
};
