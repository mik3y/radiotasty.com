import "./App.scss";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import { vaporwaveTheme } from "./theme/muiTheme";

const App = () => {
  return (
    <ThemeProvider theme={vaporwaveTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
