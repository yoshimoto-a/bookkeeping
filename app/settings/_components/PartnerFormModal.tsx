"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";
import { partnerFormSchema, type PartnerFormData } from "@/app/_types/partner";
import { createPartner, updatePartner } from "@/app/settings/actions";
import { TextInput } from "@/app/_components/TextInput";
import { SelectInput } from "@/app/_components/SelectInput";
import { FormError } from "@/app/_components/FormError";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { SecondaryButton } from "@/app/_components/SecondaryButton";

type BankAccount = { id: string; code: string; name: string };

type Props = {
  partnerId: string | null;
  defaultValues: PartnerFormData;
  isReferenced: boolean;
  bankAccounts: BankAccount[];
  onClose: () => void;
};

export const PartnerFormModal = ({ partnerId, defaultValues, isReferenced, bankAccounts, onClose }: Props) => {
  const isEdit = !!partnerId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: PartnerFormData) => {
    const result = isEdit
      ? await updatePartner(partnerId, data)
      : await createPartner(data);

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success(isEdit ? "取引先を更新しました" : "取引先を追加しました");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold">
          {isEdit ? "取引先の編集" : "取引先の追加"}
        </h2>

        {isReferenced && (
          <div className="mb-4 flex gap-2 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            <p>この取引先は仕訳データで使用されています。変更すると過去のデータにも反映されます。</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">取引先名</label>
            <TextInput {...register("name")} />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">コード（任意）</label>
            <TextInput {...register("code")} />
            <FormError message={errors.code?.message} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">デフォルト入金口座（任意）</label>
            <SelectInput {...register("defaultReceiptAccountId")}>
              <option value="">選択しない</option>
              {bankAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </SelectInput>
            <FormError message={errors.defaultReceiptAccountId?.message} />
          </div>

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
