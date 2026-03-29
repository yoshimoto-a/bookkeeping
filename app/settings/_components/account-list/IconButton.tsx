import type { LucideIcon } from "lucide-react";

type Variant = "default" | "danger";

type Props = {
  icon: LucideIcon;
  size?: number;
  label: string;
  variant?: Variant;
  disabled?: boolean;
  onClick?: () => void;
};

const variantClasses = {
  default:
    "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
  danger:
    "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
};

export const IconButton = ({
  icon: Icon,
  size = 14,
  label,
  variant = "default",
  disabled,
  onClick,
}: Props) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded p-1 disabled:opacity-50 ${variantClasses[variant]}`}
    title={label}
  >
    <Icon size={size} />
  </button>
);
