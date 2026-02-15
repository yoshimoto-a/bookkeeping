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
    groupBy={groupBy ? groupBy : (o) => o.group ?? ""}
    getOptionLabel={(o) => o.label}
    value={options.find((o) => o.value === value) ?? null}
    onChange={(_, opt) => onChange(opt ? opt.value : null)}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        size="small"
        sx={{
          "& .MuiInputBase-input": { color: "#fff" },
          "& .MuiSvgIcon-root": { color: "#fff" },
          "& .MuiFormLabel-root": { color: "#fff" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
        }}
      />
    )}
    slotProps={{
      paper: {
        sx: {
          bgcolor: "rgba(24,24,27,0.95)",
          color: "#fff",
          // グループ見出し・リストの背景を統一
          "& .MuiAutocomplete-groupLabel": {
            color: "#fff",
            bgcolor: "transparent",
            px: 2,
            py: 0.75,
            fontSize: 12,
          },
          "& .MuiAutocomplete-groupUl": {
            bgcolor: "transparent",
            m: 0,
            p: 0,
          },
          "& .MuiAutocomplete-option": {
            color: "#fff",
            "&.Mui-focused": { bgcolor: "rgba(63,63,70,0.6)" },
            "&.Mui-selected": { bgcolor: "rgba(63,63,70,0.8)", color: "#fff" },
          },
        },
      },
      listbox: {
        sx: {
          bgcolor: "rgba(24,24,27,0.95)",
          color: "#fff",
        },
      },
    }}
    disablePortal
    fullWidth
  />
);
