"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { policyFormSchema, type PolicyFormData, type PolicyData } from "@/app/_types/settings";
import { upsertAccountingPolicy } from "@/app/settings/actions";

type Props = {
  fiscalYear: number;
  policy: PolicyData;
};

export const PolicyForm = ({ fiscalYear, policy }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<PolicyFormData>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      taxMethod: policy?.taxMethod ?? "TAX_INCLUSIVE",
      businessTaxStatus: policy?.businessTaxStatus ?? "EXEMPT",
    },
  });

  const onSubmit = async (data: PolicyFormData) => {
    const result = await upsertAccountingPolicy(fiscalYear, data);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("会計ポリシーを保存しました");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">消費税の経理方式</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="TAX_INCLUSIVE" {...register("taxMethod")} />
            税込経理
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="TAX_EXCLUSIVE" {...register("taxMethod")} />
            税抜経理
          </label>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">消費税の課税区分</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="EXEMPT" {...register("businessTaxStatus")} />
            免税事業者
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="TAXABLE" {...register("businessTaxStatus")} />
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
