"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import type { LedgerAccount } from "../queries/getLedgerData";
import type { AccountWithMeta } from "@/app/_types/settings";
import { AppAutocomplete } from "@/app/_components/AppAutocomplete";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { SecondaryButton } from "@/app/_components/SecondaryButton";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants/accountTypes";
import { LedgerTable } from "./LedgerTable";

import "dayjs/locale/ja";

type Props = {
  ledgerData: LedgerAccount[];
  accounts: AccountWithMeta[];
  currentFilters: {
    accountId: string | null;
    startDate: string | null;
    endDate: string | null;
  };
};

type FilterFormData = {
  accountId: string | null;
  startDate: string | null;
  endDate: string | null;
};

export const LedgerView = ({ ledgerData, accounts, currentFilters }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { control, handleSubmit, reset } = useForm<FilterFormData>({
    defaultValues: {
      accountId: currentFilters.accountId,
      startDate: currentFilters.startDate,
      endDate: currentFilters.endDate,
    },
  });

  // 選択された科目IDを現在のフィルターから取得
  const selectedAccountId = currentFilters.accountId;

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: a.name,
    group: ACCOUNT_TYPE_LABELS[a.type],
    parentId: a.parentId,
  }));

  const onSubmit = (data: FilterFormData) => {
    const params = new URLSearchParams(searchParams);
    
    if (data.accountId) {
      params.set("accountId", data.accountId);
    } else {
      params.delete("accountId");
    }
    
    if (data.startDate) {
      params.set("startDate", data.startDate);
    } else {
      params.delete("startDate");
    }
    
    if (data.endDate) {
      params.set("endDate", data.endDate);
    } else {
      params.delete("endDate");
    }

    router.push(`/ledger?${params.toString()}`);
  };

  const clearFilters = () => {
    reset({
      accountId: null,
      startDate: null,
      endDate: null,
    });
    router.push("/ledger");
  };

  // 選択された科目のデータのみをフィルタリング
  const displayedLedgerData = selectedAccountId 
    ? ledgerData.filter(account => account.id === selectedAccountId)
    : [];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <div className="space-y-6">
        {/* フィルター */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-4 font-medium">表示条件</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Controller
                name="accountId"
                control={control}
                render={({ field }) => (
                  <AppAutocomplete
                    label="表示する科目"
                    value={field.value}
                    options={accountOptions}
                    groupBy={(o) => o.group ?? ""}
                    showSubAccounts={false}
                    onChange={(val) => {
                      field.onChange(val);
                    }}
                  />
                )}
              />
              
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="開始日"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(val: Dayjs | null) => {
                      field.onChange(val ? val.format("YYYY-MM-DD") : null);
                    }}
                    format="YYYY/MM/DD"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
              
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="終了日"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(val: Dayjs | null) => {
                      field.onChange(val ? val.format("YYYY-MM-DD") : null);
                    }}
                    format="YYYY/MM/DD"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                      },
                    }}
                  />
                )}
              />
            </div>
            
            <div className="flex gap-2">
              <PrimaryButton type="submit">表示</PrimaryButton>
              <SecondaryButton type="button" onClick={clearFilters}>
                クリア
              </SecondaryButton>
            </div>
          </form>
        </div>

        {/* 選択された科目の説明 */}
        {selectedAccountId && (
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {accountOptions.find(opt => opt.value === selectedAccountId)?.label} の総勘定元帳
            </p>
          </div>
        )}

        {/* 総勘定元帳テーブル */}
        <LedgerTable ledgerData={displayedLedgerData} />
      </div>
    </LocalizationProvider>
  );
};
