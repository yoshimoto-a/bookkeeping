"use client";

import dynamic from "next/dynamic";

const FiscalYearSelector = dynamic(() => import("./FiscalYearSelector"), { ssr: false });

type Props = {
  years: number[];
};

export const SettingsHeader = ({ years }: Props) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold">設定</h1>
      <FiscalYearSelector years={years} />
    </div>
  );
};
