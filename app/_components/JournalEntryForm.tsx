"use client";

import { useForm, FormProvider, Controller } from "react-hook-form";
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
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { upsertJournalEntry } from "@/app/journals/actions/upsertJournalEntry";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants/accountTypes";
import { JournalLinesFieldset } from "./journal-entry-form/JournalLinesFieldset";
import { JournalBalanceSummary } from "./journal-entry-form/JournalBalanceSummary";

import "dayjs/locale/ja";

type Props = {
  accounts: AccountWithMeta[];
  defaultValues: JournalEntryFormValues;
  journalEntryId?: string;
  onSuccess?: () => void;
};

export const JournalEntryForm = ({
  accounts,
  defaultValues,
  journalEntryId,
  onSuccess,
}: Props) => {
  const methods = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntryFormSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  const accountOptions = accounts.map((a) => {
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

  const onSubmit = async (data: JournalEntryFormValues) => {
    try {
      const result = await upsertJournalEntry(journalEntryId ?? null, data);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(journalEntryId ? "仕訳を更新しました" : "仕訳を登録しました");
      if (onSuccess) {
        onSuccess();
      } else {
        reset();
      }
    } catch {
      toast.error("保存に失敗しました。時間をおいて再度お試しください");
    }
  };

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* 借方 */}
          <JournalLinesFieldset
            side="debitLines"
            label="借方"
            accountOptions={accountOptions}
            accounts={accounts}
          />

          {/* 貸方 */}
          <JournalLinesFieldset
            side="creditLines"
            label="貸方"
            accountOptions={accountOptions}
            accounts={accounts}
          />

          {/* 貸借合計 */}
          <JournalBalanceSummary />

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
    </FormProvider>
  );
};
