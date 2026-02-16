"use client";

import { TextField } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  label?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  errorText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
};

export const AppSelect = ({ label, value, defaultValue, onChange, children, errorText, fullWidth = true, size = "small" }: Props) => (
  <TextField
    select
    size={size}
    label={label}
    value={value}
    defaultValue={defaultValue}
    onChange={onChange}
    error={!!errorText}
    helperText={errorText}
    fullWidth={fullWidth}
  >
    {children}
  </TextField>
);
