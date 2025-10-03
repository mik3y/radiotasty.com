import "./App.scss";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
