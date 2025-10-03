import { createTheme } from "@mui/material/styles";

export const vaporwaveTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff006e",
      light: "#ff5a9e",
      dark: "#c70039",
    },
    secondary: {
      main: "#8338ec",
      light: "#a061ff",
      dark: "#5e1a9c",
    },
    background: {
      default: "transparent",
      paper: "rgba(0, 0, 0, 0.2)",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.9)",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: '"Oxanium Variable", system-ui, sans-serif',
    h1: {
      fontFamily: '"Oxanium Variable", system-ui, sans-serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Oxanium Variable", system-ui, sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Oxanium Variable", system-ui, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Oxanium Variable", system-ui, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Oxanium Variable", system-ui, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Oxanium Variable", system-ui, sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Oxanium Variable", system-ui, sans-serif',
    },
    body2: {
      fontFamily: '"Oxanium Variable", system-ui, sans-serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Oxanium Variable", system-ui, sans-serif',
          backgroundColor: "#2b1165",
          background: `linear-gradient(
            180deg,
            #2b1165 0%,
            rgba(26, 58, 130, 1) 37%,
            rgba(171, 36, 177, 1) 69%,
            #f54171 100%
          )`,
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          position: "relative",
          color: "#ffffff",
        },
        "*": {
          boxSizing: "border-box",
        },
        html: {
          height: "100%",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "1200px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontFamily: '"Oxanium Variable", system-ui, sans-serif',
        },
        contained: {
          background: "linear-gradient(45deg, #ff006e 30%, #8338ec 90%)",
          border: 0,
          color: "white",
          "&:hover": {
            background: "linear-gradient(45deg, #c70039 30%, #5e1a9c 90%)",
          },
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.2)",
          color: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.4)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
  },
});
