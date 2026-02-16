"use client";

import { FormError } from "@/app/_components/FormError";
import { TextInput } from "@/app/_components/TextInput";
import { useFormContext } from "react-hook-form";
import type { PresetFormData } from "@/app/_types/preset";

export const PresetNameField = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<PresetFormData>();

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">名前</label>
      <TextInput {...register("name")} />
      <FormError message={errors.name?.message} />
    </div>
  );
};
