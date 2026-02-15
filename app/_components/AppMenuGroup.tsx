"use client";

import { ListSubheader, MenuItem } from "@mui/material";

type Item = { value: string; label: string };

type Props = {
  groupLabel: string;
  items: Item[];
};

export const AppMenuGroup = ({ groupLabel, items }: Props) => (
  <>
    <ListSubheader
      disableSticky
      sx={{
        // ダークテーマでも白帯にならないよう背景をメニューの Paper に合わせる
        bgcolor: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.secondary,
        fontSize: 12,
        lineHeight: 1.2,
        py: 0.75,
        px: 2,
      }}
    >
      {groupLabel}
    </ListSubheader>
    {items.map(({ value, label }) => (
      <MenuItem
        key={value}
        value={value}
        sx={{
          color: (theme) => theme.palette.text.primary,
          // 選択時も背景・文字色がテーマに追従
          "&.Mui-selected": {
            bgcolor: (theme) => theme.palette.action.selected,
            color: (theme) => theme.palette.text.primary,
          },
        }}
      >
        {label}
      </MenuItem>
    ))}
  </>
);
