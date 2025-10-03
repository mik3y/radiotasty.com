import { Box, Container } from "@mui/material";
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
      <Box sx={{ minHeight: "100vh" }}>
        <Container
          maxWidth={false}
          sx={{ py: 0, position: "relative", zIndex: 1 }}
        >
          <Outlet />
        </Container>
      </Box>
      <div className="overlay" style={{ position: "fixed", zIndex: -1 }} />
      <div
        className="overlay glitch"
        style={{ position: "fixed", zIndex: -1 }}
      />
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
