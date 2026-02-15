"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { taxStatusFormSchema, type TaxStatusFormData, type FiscalYearSettingData } from "@/app/_types/settings";
import { upsertFiscalYearSetting } from "@/app/settings/actions";

type Props = {
  fiscalYear: number;
  setting: FiscalYearSettingData;
};

export const TaxStatusForm = ({ fiscalYear, setting }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TaxStatusFormData>({
    resolver: zodResolver(taxStatusFormSchema),
    defaultValues: {
      taxStatus: setting?.taxStatus ?? "EXEMPT",
    },
  });

  const onSubmit = async (data: TaxStatusFormData) => {
    const result = await upsertFiscalYearSetting(fiscalYear, data);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("課税区分を保存しました");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          消費税の課税区分（{fiscalYear}年度）
        </p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="EXEMPT" {...register("taxStatus")} />
            免税事業者
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="TAXABLE" {...register("taxStatus")} />
            課税事業者
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isSubmitting ? "保存中..." : "保存"}
      </button>
    </form>
  );
};
