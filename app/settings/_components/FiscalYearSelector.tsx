"use client";

import { useRouter } from "next/navigation";
import { TextField, MenuItem } from "@mui/material";

type Props = {
  years: number[];
  fiscalYear: number;
};

const FiscalYearSelectorInner = ({ years, fiscalYear }: Props) => {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`/settings/tax?fiscalYear=${e.target.value}`);
  };

  return (
    <TextField
      select
      label="年度"
      size="small"
      value={String(fiscalYear)}
      onChange={handleChange}
      sx={{
        minWidth: 140,
        color: '#fff',
        '& .MuiInputLabel-root': { color: '#fff' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
        '& .MuiOutlinedInput-input': { color: '#fff' },
        '& .MuiSelect-icon': { color: '#fff' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
      }}
    >
      {years.map((year) => (
        <MenuItem key={year} value={String(year)}>
          {year}年
        </MenuItem>
      ))}
    </TextField>
  );
};

export default FiscalYearSelectorInner;
