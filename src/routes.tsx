import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import AboutView from "./views/About";
import HomeView from "./views/Home";

const RootLayout = () => {
  return (
    <>
      <div id="app">
        <Outlet />
      </div>
      <div className="overlay" />
      <div className="overlay glitch" />
      <TanStackRouterDevtools />
    </>
  );
};

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeView,
});

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutView,
});

export const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

export const router = createRouter({ routeTree });
