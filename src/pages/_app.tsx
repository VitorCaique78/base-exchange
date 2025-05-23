// src/pages/_app.tsx
import * as React from "react";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import theme from "@/theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@/mocks/browser").then(({ worker }) => {
        worker.start();
      });
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={3}>
      <CssBaseline />
      <Component {...pageProps} />
    </SnackbarProvider>
    </ThemeProvider>
  );
}
