import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import PageHeader from "../components/PageHeader";
import StreamPlayer from "../components/StreamPlayer";
import "./Home.scss";

const HomeView = () => {
  return (
    <>
      <PageHeader />
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  width: "100%",
                  maxWidth: 600,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                }}
                elevation={0}
              >
                <StreamPlayer />
              </Paper>

              <Button
                variant="contained"
                href="https://mailchi.mp/a0216ed0e271/newsletter-signup"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  background:
                    "linear-gradient(45deg, #ff006e 30%, #8338ec 90%)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #c70039 30%, #5e1a9c 90%)",
                  },
                }}
                endIcon={
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
                }
              >
                Be the tastiest: Join our mailing list
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomeView;
