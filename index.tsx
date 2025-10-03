import { createRoot } from "react-dom/client";

import App from "./src/App";
import "@fontsource-variable/oxanium";

const mountNode = document.getElementById("app");
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(mountNode!);
root.render(<App />);
