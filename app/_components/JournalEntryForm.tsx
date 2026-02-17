"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import toast from "react-hot-toast";
import {
  journalEntryFormSchema,
  type JournalEntryFormValues,
} from "@/app/_types/journal";
import type { AccountWithMeta } from "@/app/_types/settings";
import { AppAutocomplete } from "@/app/_components/AppAutocomplete";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { upsertJournalEntry } from "@/app/journals/actions/upsertJournalEntry";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants/accountTypes";

import "dayjs/locale/ja";

type Props = {
  accounts: AccountWithMeta[];
  defaultValues?: JournalEntryFormValues;
  journalEntryId?: string;
  onSuccess?: () => void;
};

export const JournalEntryForm = ({
  accounts,
  defaultValues,
  journalEntryId,
  onSuccess,
}: Props) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntryFormSchema),
    defaultValues: defaultValues ?? {
      entryDate: "",
      debitAccountId: "",
      creditAccountId: "",
      amount: undefined as unknown as number,
      description: "",
    },
  });

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: a.name,
    group: ACCOUNT_TYPE_LABELS[a.type],
  }));

  const amountField = register("amount", { valueAsNumber: true });

  const onSubmit = async (data: JournalEntryFormValues) => {
    const result = await upsertJournalEntry(
      journalEntryId ?? null,
      data
    ).catch(() => ({
      error: "保存に失敗しました。時間をおいて再度お試しください",
    }));
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success(journalEntryId ? "仕訳を更新しました" : "仕訳を登録しました");
    if (onSuccess) {
      onSuccess();
    } else {
      reset();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="entryDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="日付"
                value={field.value ? dayjs(field.value) : null}
                onChange={(val: Dayjs | null) => {
                  field.onChange(val ? val.format("YYYY-MM-DD") : "");
                }}
                format="YYYY/MM/DD"
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!errors.entryDate,
                    helperText: errors.entryDate?.message,
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
            error={!!errors.amount}
            helperText={errors.amount?.message}
            {...amountField}
          />

          <Controller
            name="debitAccountId"
            control={control}
            render={({ field }) => (
              <AppAutocomplete
                label="借方科目"
                value={field.value || null}
                options={accountOptions}
                groupBy={(o) => o.group ?? ""}
                onChange={(val) => {
                  field.onChange(val ?? "");
                }}
              />
            )}
          />

          <Controller
            name="creditAccountId"
            control={control}
            render={({ field }) => (
              <AppAutocomplete
                label="貸方科目"
                value={field.value || null}
                options={accountOptions}
                groupBy={(o) => o.group ?? ""}
                onChange={(val) => {
                  field.onChange(val ?? "");
                }}
              />
            )}
          />
        </div>

        <TextField
          label="摘要"
          size="small"
          fullWidth
          placeholder="任意（200文字以内）"
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register("description")}
        />

        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "保存中..."
            : journalEntryId
              ? "更新"
              : "登録"}
        </PrimaryButton>
      </form>
    </LocalizationProvider>
  );
};
