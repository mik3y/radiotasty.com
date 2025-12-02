import "./App.scss";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "@tanstack/react-router";

import { type StationConfig, StreamProvider } from "./contexts/StreamContext";
import { router } from "./routes";
import { vaporwaveTheme } from "./theme/muiTheme";

const RADIO_TASTY_STATION: StationConfig = {
  playbackUrl: "https://listen.radiotasty.com/listen/radio_tasty/radio-192.mp3",
  metadataUrl: "https://listen.radiotasty.com/api/nowplaying/radio_tasty",
  metadataProvider: "azuracast",
};

const App = () => {
  return (
    <ThemeProvider theme={vaporwaveTheme}>
      <CssBaseline />
      <StreamProvider stationConfig={RADIO_TASTY_STATION}>
        <RouterProvider router={router} />
      </StreamProvider>
    </ThemeProvider>
  );
};

export default App;
