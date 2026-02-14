type Props = {
  type: "submit" | "button";
  disabled: boolean;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"button">, "className">;

export const PrimaryButton = ({ type, disabled, children, ...rest }: Props) => (
  <button
    type={type}
    disabled={disabled}
    {...rest}
    className="flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 disabled:opacity-50"
  >
    {children}
  </button>
);
