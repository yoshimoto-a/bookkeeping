"use client";

import { InputHTMLAttributes, Ref } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  ref?: Ref<HTMLInputElement>;
};

export const LabeledCheckbox = ({ label, className, ref, ...props }: Props) => (
  <label className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      ref={ref}
      className={`rounded border-zinc-300 dark:border-zinc-600 ${className ?? ""}`}
      {...props}
    />
    {label}
  </label>
);
