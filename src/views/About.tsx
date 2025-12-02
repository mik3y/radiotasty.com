import { Box, Grid, Paper, Typography } from "@mui/material";

import PageHeader from "../components/PageHeader";

const AboutView = () => {
  return (
    <>
      <PageHeader />
      <Box sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              }}
              elevation={0}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  background:
                    "linear-gradient(45deg, #ff006e 30%, #8338ec 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                About Radio Tasty
              </Typography>
              <Typography
                variant="h6"
                paragraph
                sx={{
                  mb: 2,
                  lineHeight: 1.6,
                  color: "rgba(255, 255, 255, 0.9)",
                }}
              >
                Welcome to Radio Tasty - your source for the tastiest tunes!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                This is a placeholder about page. More content coming soon...
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AboutView;
