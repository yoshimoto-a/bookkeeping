"use client";

import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { muiDarkTheme } from "@/lib/muiTheme";

type Props = {
  children: React.ReactNode;
};

export const MuiProvider = ({ children }: Props) => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={muiDarkTheme}>
      {children}
    </ThemeProvider>
  </AppRouterCacheProvider>
);
