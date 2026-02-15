"use client";

import { useFormContext, Controller } from "react-hook-form";
import type { PresetFormData } from "@/app/_types/preset";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";

export const PresetSideField = () => {
  const { control } = useFormContext<PresetFormData>();
  return (
    <FormControl>
      <FormLabel sx={{ color: '#fff' }}>固定する側</FormLabel>
      <Controller
        name="__fixedSide"
        control={control}
        defaultValue="debit"
        render={({ field }) => (
          <RadioGroup
            row
            {...field}
            sx={{
              '& .MuiFormControlLabel-label': { color: '#fff' },
            }}
          >
            <FormControlLabel value="debit" control={<Radio />} label="借方" />
            <FormControlLabel value="credit" control={<Radio />} label="貸方" />
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};
