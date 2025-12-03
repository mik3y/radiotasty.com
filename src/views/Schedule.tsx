import { Box, Grid, Paper, Typography } from "@mui/material";

import PageHeader from "../components/PageHeader";

const ScheduleView = () => {
  return (
    <>
      <PageHeader />
      <Box sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              sx={{
                p: 4,
                textAlign: "left",
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
                Schedule
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <iframe
                  title="Radio Tasty schedule"
                  src="https://app.radiocult.fm/embed/schedule/radio-tasty-72035172/show-list?theme=dusk&primaryColor=%23579DFF&corners=rounded"
                  width="100%"
                  height="500px"
                  scrolling="no"
                  frameBorder="0"
                  seamless
                  allowTransparency
                  style={{
                    backgroundColor: "transparent",
                    borderRadius: "0.75rem",
                  }}
                ></iframe>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ScheduleView;
