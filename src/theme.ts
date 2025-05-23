// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ccf729",
      contrastText: "#fff",
    },
    secondary: {
      main: "#fff",
    },
  },
});

export default theme;
