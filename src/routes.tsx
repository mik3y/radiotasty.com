import { Box, Container, Paper } from "@mui/material";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import StreamPlayer from "./components/StreamPlayer";
import AboutView from "./views/About";
import HomeView from "./views/Home";
import ScheduleView from "./views/Schedule";

const RootLayout = () => {
  return (
    <>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          borderRadius: 0,
        }}
      >
        <StreamPlayer fullWidth titlePrefix="" />
      </Paper>
      <Box sx={{ minHeight: "100vh", pt: 8, pb: 8 }}>
        <Container
          maxWidth={false}
          sx={{ py: 0, position: "relative", zIndex: 1 }}
        >
          <Outlet />
        </Container>
      </Box>
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

export const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule",
  component: ScheduleView,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  scheduleRoute,
]);

export const router = createRouter({ routeTree });
