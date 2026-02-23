"use client";

import { Autocomplete, TextField } from "@mui/material";

type Option = { value: string; label: string; group?: string; parentId?: string | null };

type Props = {
  label?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  options: Option[];
  groupBy?: (option: Option) => string;
  showSubAccounts?: boolean; // 補助科目も表示するか（デフォルト: true）
  indentSubAccounts?: boolean; // 補助科目にインデントを付けるか（デフォルト: false）
};

export const AppAutocomplete = ({ 
  label, 
  value, 
  onChange, 
  options, 
  groupBy, 
  showSubAccounts = true,
  indentSubAccounts = false
}: Props) => {
  // showSubAccountsがfalseの場合は親科目のみをフィルタ
  const filteredOptions = showSubAccounts 
    ? options 
    : options.filter(option => !option.parentId);

  // 補助科目にインデントを付ける場合は、ラベルを変更
  const processedOptions = indentSubAccounts 
    ? filteredOptions.map(option => ({
        ...option,
        label: option.parentId ? `　　${option.label}` : option.label
      }))
    : filteredOptions;

  return (
    <Autocomplete
      options={processedOptions}
      groupBy={groupBy}
      getOptionLabel={(o) => o.label}
      value={processedOptions.find((o) => o.value === value) ?? null}
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
};
