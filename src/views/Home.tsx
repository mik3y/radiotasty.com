import { Box, Grid, Paper } from "@mui/material";

import GradientButton from "../components/GradientButton";
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

              <GradientButton href="https://mailchi.mp/a0216ed0e271/newsletter-signup">
                Be the tastiest: Join our mailing list
              </GradientButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomeView;
