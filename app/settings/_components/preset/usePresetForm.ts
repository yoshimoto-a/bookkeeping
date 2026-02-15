"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { presetFormSchema, type PresetFormValues, type PresetWithAccounts } from "@/app/_types/preset";

export const usePresetForm = (preset: PresetWithAccounts | null) => {
  const defaultValues: PresetFormValues = preset
    ? {
        name: preset.name,
        kind: preset.kind,
        fixedDebitAccountId: preset.fixedDebitAccount?.id ?? null,
        fixedCreditAccountId: preset.fixedCreditAccount?.id ?? null,
        requiresPartner: preset.requiresPartner,
        __fixedSide: "debit",
      }
    : {
        name: "",
        kind: "ONE_SIDE_FIXED",
        fixedDebitAccountId: null,
        fixedCreditAccountId: null,
        requiresPartner: false,
        __fixedSide: "debit",
      };

  return useForm<PresetFormValues>({
    resolver: zodResolver(presetFormSchema),
    defaultValues,
  });
};
