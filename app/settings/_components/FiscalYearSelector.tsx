"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TextField, MenuItem } from "@mui/material";

type Props = {
  years: number[];
};

const FiscalYearSelectorInner = ({ years }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // SSR時は何も描画しない（MUIのクライアント専用UIのため）
  if (typeof window === "undefined") return null;

  const currentYear = searchParams.get("fiscalYear") ?? String(new Date().getFullYear());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fiscalYear", e.target.value);
    router.push(`/settings?${params.toString()}`);
  };

  return (
    <TextField
      select
      label="年度"
      size="small"
      value={currentYear}
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
