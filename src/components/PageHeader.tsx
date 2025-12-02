import { Box, Button } from "@mui/material";
import { Link } from "@tanstack/react-router";

import logo from "../img/radio-tasty-logo.png";

const PageHeader = () => {
  return (
    <div
      style={{
        top: 0,
        zIndex: 1100,
        backgroundColor: "transparent",
        padding: "1rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 1200,
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", marginBottom: "1rem" }}>
        <Box
          component="img"
          src={logo}
          alt="Radio Tasty Logo"
          sx={{
            height: { xs: 80, sm: 120, md: 150 },
            width: "auto",
            cursor: "pointer",
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        />
      </Link>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          component={Link}
          to="/"
          color="inherit"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            "&.active": {
              color: "rgba(255, 255, 255, 1)",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            },
          }}
        >
          Home
        </Button>
        <Button
          component={Link}
          to="/about"
          color="inherit"
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              color: "rgba(255, 255, 255, 0.9)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            "&.active": {
              color: "rgba(255, 255, 255, 1)",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            },
          }}
        >
          About
        </Button>
      </Box>
    </div>
  );
};

export default PageHeader;
