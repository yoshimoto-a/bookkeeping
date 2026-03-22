import { Pencil, Trash2, Plus } from "lucide-react";
import { IconButton } from "./IconButton";

type ChildAccount = {
  id: string;
  code: string;
  name: string;
};

type Props = {
  child: ChildAccount;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export const AccountChildRow = ({ child, isDeleting, onEdit, onDelete }: Props) => (
  <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
    <td className="relative py-2 pl-10 pr-4 font-mono text-xs text-zinc-500">
      <span className="absolute left-6 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-700" />
      {child.code}
    </td>
    <td className="py-2 pl-10 pr-4 text-zinc-600 dark:text-zinc-400">
      <span className="mr-1 text-xs text-zinc-400">└</span>
      {child.name}
    </td>
    <td className="px-4 py-2 text-right">
      <div className="flex items-center justify-end gap-2">
        {/* 親行と同じ3ボタン幅を維持するためのプレースホルダー */}
        <button className="invisible flex items-center gap-1 rounded px-2 py-1 text-xs" aria-hidden>
          <Plus size={12} /> 補助科目
        </button>
        <IconButton icon={Pencil} label="編集" onClick={onEdit} />
        <IconButton
          icon={Trash2}
          label="削除"
          variant="danger"
          disabled={isDeleting}
          onClick={onDelete}
        />
      </div>
    </td>
  </tr>
);
