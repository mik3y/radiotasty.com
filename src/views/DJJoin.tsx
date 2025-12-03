import { Box, Paper, Typography } from "@mui/material";

import GradientButton from "../components/GradientButton";
import PageHeader from "../components/PageHeader";

const DJJoinView = () => {
  return (
    <>
      <PageHeader />
      <Box sx={{ mt: 4, maxWidth: 800, mx: "auto", px: 2 }}>
        <Paper
          sx={{
            p: 4,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            textAlign: "left",
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
              background: "linear-gradient(45deg, #ff006e 30%, #8338ec 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Become a Radio Tasty DJ
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <p>
              We're currently welcoming new DJs to the Radio Tasty family! If
              you love music and want to share it with others, we'd love to have
              you.
            </p>
            <p>
              <b>You do not need be a pro or have any experience!</b> All you
              have to be is a music lover; we'll get you up to speed on
              everything else. Here's how it works:
              <ul>
                <li>Fill out the brief survey below to kick things off.</li>
                <li>
                  Someone will get in touch with you, answer any questions, and
                  schedule a time for your first show.
                </li>
                <li>
                  After your show, we'll check back and see if you want to make
                  it recurring.
                </li>
              </ul>
            </p>
            <p>You can do it!</p>
            <p>
              We are happy to have new regular/recurring shows, and for those
              that can't commit to a schedule we're also happy to bring on
              "ensemble" DJs to do occasional one-off shows.
            </p>
            <p>Ready? Let's go!</p>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <GradientButton href="https://forms.gle/zNidKwNVo9F9otJg7">
                Apply Now
              </GradientButton>
            </Box>
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default DJJoinView;
