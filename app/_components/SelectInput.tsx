type Props = {
  disabled?: boolean;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"select">, "className">;

export const SelectInput = ({ disabled, children, ...rest }: Props) => (
  <select
    disabled={disabled}
    {...rest}
    className="w-full rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-400 dark:disabled:bg-zinc-700"
  >
    {children}
  </select>
);
