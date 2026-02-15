"use client";

import { FormError } from "@/app/_components/FormError";
import { useFormContext } from "react-hook-form";
import type { PresetFormData } from "@/app/_types/preset";
import { LabeledCheckbox } from "@/app/_components/LabeledCheckbox";

export const PresetOptionsField = () => {
  const { register, formState: { errors } } = useFormContext<PresetFormData>();

  return (
    <div className="space-y-2">
      <LabeledCheckbox label="取引先の入力を必要とする" {...register("requiresPartner")} />
      <FormError message={errors.requiresPartner?.message} />
    </div>
  );
};
