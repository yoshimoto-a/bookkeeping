"use client";

import { Autocomplete, TextField } from "@mui/material";

type Option = { value: string; label: string; group?: string };

type Props = {
  label?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  options: Option[];
  groupBy?: (option: Option) => string;
};

export const AppAutocomplete = ({ label, value, onChange, options, groupBy }: Props) => (
  <Autocomplete
    options={options}
    groupBy={groupBy}
    getOptionLabel={(o) => o.label}
    value={options.find((o) => o.value === value) ?? null}
    onChange={(_, opt) => onChange(opt?.value || null)}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        size="small"
      />
    )}
    disablePortal
    fullWidth
  />
);
