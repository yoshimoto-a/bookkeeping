"use client";

import { FormError } from "@/app/_components/FormError";
import { SelectInput } from "@/app/_components/SelectInput";
import { PRESET_KIND_LABELS } from "@/lib/constants/presetKinds";
import { useFormContext, useWatch } from "react-hook-form";
import type { PresetFormData } from "@/app/_types/preset";

export const PresetKindField = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PresetFormData>();
  const kindValue = useWatch({ control, name: "kind" });

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">種別</label>
      <SelectInput {...register("kind")}>
        {Object.entries(PRESET_KIND_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectInput>
      <p className="mt-1 text-xs text-zinc-500">
        {kindValue === "ONE_SIDE_FIXED"
          ? "片側の科目を固定し、もう片側を入力時に選択します"
          : "借方・貸方の両方を固定します"}
      </p>
      <FormError message={errors.kind?.message} />
    </div>
  );
};
