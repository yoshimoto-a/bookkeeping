type Props = {
  type: "submit" | "button";
  disabled?: boolean;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"button">, "className">;

export const PrimaryButton = ({ type, disabled, children, ...rest }: Props) => (
  <button
    type={type}
    disabled={disabled}
    {...rest}
    className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
  >
    {children}
  </button>
);
