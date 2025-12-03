import { Button, type ButtonProps, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export interface GradientButtonProps {
  children: ReactNode;
  href?: string;
  to?: string;
}

const GradientButton = ({ children, href, to }: GradientButtonProps) => {
  const buttonProps: ButtonProps = {
    variant: "contained",
    sx: {
      px: 4,
      py: 1.5,
      fontSize: "1.1rem",
      background: "linear-gradient(45deg, #ff006e 30%, #8338ec 90%)",
      "&:hover": {
        background: "linear-gradient(45deg, #c70039 30%, #5e1a9c 90%)",
      },
    },
    endIcon: (
      <Typography
        component="span"
        sx={{
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": { transform: "translateX(0)" },
            "50%": { transform: "translateX(4px)" },
            "100%": { transform: "translateX(0)" },
          },
        }}
      >
        →
      </Typography>
    ),
  };

  if (to) {
    return (
      <Button component={Link} to={to} {...buttonProps}>
        {children}
      </Button>
    );
  }

  return (
    <Button
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
