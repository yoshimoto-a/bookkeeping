"use client";

import { Trash2 } from "lucide-react";

type Props = {
  index: number;
  removable: boolean;
  onRemove: () => void;
};

export const TransactionRowHeader = ({ index, removable, onRemove }: Props) => {
  if (!removable) {
    return (
      <div className="mb-3 text-xs font-medium text-zinc-400">{index + 1}行目</div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-3 top-3 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
        title="この行を削除"
      >
        <Trash2 size={16} />
      </button>

      <div className="mb-3 text-xs font-medium text-zinc-400">{index + 1}行目</div>
    </>
  );
};
