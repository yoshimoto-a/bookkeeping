type Props = {
  type: "submit" | "button";
  disabled?: boolean;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"button">, "className">;

export const SecondaryButton = ({ type, disabled, children, ...rest }: Props) => (
  <button
    type={type}
    disabled={disabled}
    {...rest}
    className="rounded border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
  >
    {children}
  </button>
);
