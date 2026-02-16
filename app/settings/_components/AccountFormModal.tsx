"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";
import { accountFormSchema, type AccountFormData, type AccountWithMeta } from "@/app/_types/settings";
import { createAccount, updateAccount } from "@/app/settings/actions";
import { ACCOUNT_TYPE_LABELS } from "@/lib/constants/accountTypes";
import { TextInput } from "@/app/_components/TextInput";
import { SelectInput } from "@/app/_components/SelectInput";
import { FormError } from "@/app/_components/FormError";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { SecondaryButton } from "@/app/_components/SecondaryButton";

type Props = {
  account: AccountWithMeta | null;
  parentId: string | null;
  accounts: AccountWithMeta[];
  onClose: () => void;
};

export const AccountFormModal = ({ account, parentId, accounts, onClose }: Props) => {
  const isEdit = account !== null;
  const isSubAccount = parentId !== null;
  const parentAccount = isSubAccount ? accounts.find((a) => a.id === parentId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: account
      ? { code: account.code, name: account.name, type: account.type, parentId: account.parentId }
      : {
          code: "",
          name: "",
          type: parentAccount?.type ?? "EXPENSE",
          parentId,
        },
  });

  const onSubmit = async (data: AccountFormData) => {
    const result = isEdit
      ? await updateAccount(account.id, data)
      : await createAccount(data);

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success(
        isEdit
          ? "勘定科目を更新しました"
          : isSubAccount
            ? "補助科目を追加しました"
            : "勘定科目を追加しました"
      );
      onClose();
    }
  };

  const title = isEdit
    ? "勘定科目の編集"
    : isSubAccount
      ? `補助科目の追加（${parentAccount?.name}）`
      : "勘定科目の追加";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>

        {isEdit && account.isReferenced && (
          <div className="mb-4 flex gap-2 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            <p>
              この科目は仕訳データで使用されています。変更すると過去のデータにも反映されます。必要に応じて新しい科目の作成もご検討ください。
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("parentId")} />

          <div>
            <label className="mb-1 block text-sm font-medium">科目コード</label>
            <TextInput
              {...register("code")}
              disabled={isEdit && account.isOwnerAccount}
            />
            <FormError message={errors.code?.message} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">科目名</label>
            <TextInput
              {...register("name")}
              disabled={isEdit && account.isOwnerAccount}
            />
            <FormError message={errors.name?.message} />
          </div>

          {!isSubAccount && (
            <div>
              <label className="mb-1 block text-sm font-medium">分類</label>
              <SelectInput
                {...register("type")}
                disabled={isEdit && (account.isOwnerAccount || account.children.length > 0)}
              >
                {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
              <FormError message={errors.type?.message} />
            </div>
          )}

          {isSubAccount && (
            <div>
              <label className="mb-1 block text-sm font-medium">分類</label>
              <p className="px-3 py-2 text-sm text-zinc-500">
                {ACCOUNT_TYPE_LABELS[parentAccount?.type ?? "EXPENSE"]}（親科目から継承）
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={onClose}>
              キャンセル
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
