"use client";

import { useMemo } from "react";
import { FormError } from "@/app/_components/FormError";
import { useFormContext } from "react-hook-form";
import type { PresetFormData } from "@/app/_types/preset";
import type { AccountWithHierarchy } from "@/app/settings/queries/getAllAccountsWithMeta";
import { AppAutocomplete } from "@/app/_components/AppAutocomplete";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants/accountTypes";

type Props = {
  accounts: AccountWithHierarchy[];
  name: "fixedDebitAccountId" | "fixedCreditAccountId";
  label: string;
};

type AccountOption = {
  value: string;
  label: string;
  group?: string;
  isSubAccount?: boolean;
  parentName?: string;
};

export const FixedAccountWithSubAccountField = ({ accounts, name, label }: Props) => {
  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<PresetFormData>();
  
  const currentValue = watch(name);

  // 現在選択されている科目の情報を計算
  const { selectedAccount, selectedParent, showSubAccountSelect } = useMemo(() => {
    if (!currentValue) {
      return { selectedAccount: null, selectedParent: null, showSubAccountSelect: false };
    }

    const account = accounts.find((a) => a.id === currentValue);
    if (!account) {
      return { selectedAccount: null, selectedParent: null, showSubAccountSelect: false };
    }

    if (account.parentId) {
      // 補助科目が選択されている場合
      const parent = accounts.find((a) => a.id === account.parentId);
      return {
        selectedAccount: account,
        selectedParent: parent || null,
        showSubAccountSelect: true,
      };
    } else {
      // 親科目が選択されている場合
      return {
        selectedAccount: account,
        selectedParent: account,
        showSubAccountSelect: account.children.length > 0,
      };
    }
  }, [currentValue, accounts]);

  // 親科目のオプション
  const parentOptions: AccountOption[] = useMemo(() => 
    accounts
      .filter((a) => a.parentId === null)
      .map((a) => ({
        value: a.id,
        label: a.name,
        group: ACCOUNT_TYPE_LABELS[a.type],
      })),
    [accounts]
  );

  // 選択された親科目の補助科目のオプション
  const subAccountOptions: AccountOption[] = useMemo(() => {
    if (!selectedParent) return [];
    
    return accounts
      .filter((a) => a.parentId === selectedParent.id)
      .map((a) => ({
        value: a.id,
        label: a.name,
        isSubAccount: true,
        parentName: selectedParent.name,
      }));
  }, [selectedParent, accounts]);

  const handleParentChange = (parentId: string | null) => {
    if (parentId) {
      const parentAccount = accounts.find((a) => a.id === parentId);
      if (parentAccount && parentAccount.children.length > 0) {
        // 親科目に補助科目がある場合は値をクリア（補助科目を選択させるため）
        setValue(name, null);
      } else {
        // 親科目に補助科目がない場合は親科目を直接設定
        setValue(name, parentId);
      }
    } else {
      setValue(name, null);
    }
  };

  const handleSubAccountChange = (subAccountId: string | null) => {
    setValue(name, subAccountId);
  };

  return (
    <div className="space-y-3">
      {/* 親科目選択 */}
      <div>
        <AppAutocomplete
          label={label}
          value={selectedParent?.id || null}
          options={parentOptions}
          groupBy={(o) => o.group ?? ""}
          onChange={handleParentChange}
        />
      </div>

      {/* 補助科目選択 */}
      {showSubAccountSelect && subAccountOptions.length > 0 && (
        <div className="ml-4 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700">
          <AppAutocomplete
            label={`${selectedParent?.name} の補助科目`}
            value={selectedAccount?.parentId ? selectedAccount.id : null}
            options={subAccountOptions}
            onChange={handleSubAccountChange}
          />
        </div>
      )}

      <FormError message={errors[name]?.message} />
    </div>
  );
};
