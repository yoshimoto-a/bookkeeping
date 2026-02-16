"use client";

import { FormProvider, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";
import type { PresetFormValues, PresetWithAccounts } from "@/app/_types/preset";
import type { AccountWithMeta } from "@/app/_types/settings";
import { createPreset, updatePreset } from "@/app/settings/actions";
import { PrimaryButton } from "@/app/_components/PrimaryButton";
import { SecondaryButton } from "@/app/_components/SecondaryButton";
import { PresetNameField } from "./preset/PresetNameField";
import { PresetKindField } from "./preset/PresetKindField";
import { FixedAccountField } from "./preset/FixedAccountField";
import { PresetOptionsField } from "./preset/PresetOptionsField";
import { PresetSideField } from "./preset/PresetSideField";
import { usePresetForm } from "./preset/usePresetForm";

type Props = {
  preset: PresetWithAccounts | null;
  accounts: AccountWithMeta[];
  onClose: () => void;
};

export const PresetFormModal = ({ preset, accounts, onClose }: Props) => {
  const isEdit = preset !== null;

  const methods = usePresetForm(preset);

  const { control, formState } = methods;
  const { isSubmitting } = formState;

  const kindValue = useWatch({ control, name: "kind" });
  const fixedSide = useWatch({ control, name: "__fixedSide" });

  const onSubmit = async (data: PresetFormValues) => {
    const result = isEdit ? await updatePreset(preset!.id, data) : await createPreset(data);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success(isEdit ? "定型仕訳を更新しました" : "定型仕訳を追加しました");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div aria-hidden={false} className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold">{isEdit ? "定型仕訳の編集" : "定型仕訳の追加"}</h2>

        {isEdit && preset.isReferenced && (
          <div className="mb-4 flex gap-2 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
            <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            <p>この定型仕訳は取引データで使用されています。変更すると今後の入力に影響します。</p>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <PresetNameField />
            <PresetKindField />

            {kindValue === "ONE_SIDE_FIXED" ? (
              <>
                <PresetSideField />
                {fixedSide === "debit" ? (
                  <FixedAccountField accounts={accounts} name="fixedDebitAccountId" label="固定借方科目" />
                ) : (
                  <FixedAccountField accounts={accounts} name="fixedCreditAccountId" label="固定貸方科目" />
                )}
              </>
            ) : (
              <>
                <FixedAccountField accounts={accounts} name="fixedDebitAccountId" label="固定借方科目" />
                <FixedAccountField accounts={accounts} name="fixedCreditAccountId" label="固定貸方科目" />
              </>
            )}

            <PresetOptionsField />

            <div className="flex justify-end gap-2 pt-2">
              <SecondaryButton type="button" onClick={onClose}>キャンセル</SecondaryButton>
              <PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? "保存中..." : "保存"}</PrimaryButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
