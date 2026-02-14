"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  type: "email" | "password" | "text";
  placeholder: string;
  disabled: boolean;
} & Omit<React.ComponentProps<"input">, "className">;

export const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ type, placeholder, disabled, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-400"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
