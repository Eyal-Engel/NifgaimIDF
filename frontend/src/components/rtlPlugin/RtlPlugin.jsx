import { CacheProvider, ThemeProvider } from "@emotion/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import createCache from "@emotion/cache";
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme } from "@mui/material";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export default function RtlPlugin({ children, style }) {
  const theme = (outerTheme) =>
    createTheme({
      direction: "rtl",
      palette: {
        mode: outerTheme.palette.mode,
        primary: { main: outerTheme.palette.primary.main },
      },
    });

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  return (
    <div>
      <CacheProvider value={cacheRtl}>
        <div
          dir="rtl"
          style={style}
          //   style={{ margin: "auto", width: "80%", marginTop: "15px" }}
        >
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {children}
            </LocalizationProvider>
          </ThemeProvider>
        </div>
      </CacheProvider>
    </div>
  );
}
