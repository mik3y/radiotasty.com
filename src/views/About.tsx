import { Box, Grid, Paper, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";

import PageHeader from "../components/PageHeader";

interface FAQEntryProps {
  title: string;
  children: React.ReactNode;
}

const FAQEntry = ({ title, children }: FAQEntryProps) => {
  return (
    <>
      <Typography
        variant="h6"
        paragraph
        sx={{
          mb: 2,
          lineHeight: 1.6,
          color: "rgba(255, 255, 255, 0.9)",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "1.1rem",
          lineHeight: 1.6,
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        {children}
      </Typography>
    </>
  );
};

const AboutView = () => {
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
                About Radio Tasty
              </Typography>
              <FAQEntry title="Our Mission">
                <p>
                  The mission of Radio Tasty is to{" "}
                  <b>create musical discovery through human connection</b>, and
                  to <b>create human connection through musical discovery</b>.
                </p>
                <p>We freakin’ love music &amp; radio.</p>
              </FAQEntry>
              <FAQEntry title="Our History">
                <p>Radio Tasty was created, at long last, in early 2023.</p>
                <p>
                  We had a few live broadcasts here and there while our dream
                  (of cornering our friends &amp; harnessing their musical
                  passions) quietly came to life.
                </p>
                <p>
                  We mostly aired our back catalog of recorded DJ mixes from
                  Tasty DJs and parties, recordings which still fill our airtime
                  when no DJ is live. But our goal was always bigger: to play
                  music <i>live</i> here, for eachother. Be <i>radio</i>.
                </p>
                <p>
                  In early 2025, we started regular live programming, and added
                  many new DJs to the list. We are growing, and growing up,
                  fast!
                </p>
                <p>
                  Radio Tasty was born out of{" "}
                  <a href="https://tastysf.org">Tasty</a>, a San Francisco-based
                  music &amp; arts collective that got going in 2006. More than
                  a few (but by no means all) of our DJs come from Tasty, and we
                  continue to share a strong connection.
                </p>
              </FAQEntry>
              <FAQEntry title="Who is Radio Tasty?">
                <p>
                  <a href="https://soundcloud.com/wakebot">@wakebot</a> started
                  the station with{" "}
                  <a href="https://soundcloud.com/outofcontroller">
                    @outofcontroller
                  </a>
                  , and they continue to cosplay as Radio Station Managers.{" "}
                  <a href="https://soundcloud.com/alex01d">@Alexoid</a> created
                  our first station IDs and{" "}
                  <a href="https://soundcloud.com/newguybrian">@newguybrian</a>{" "}
                  was our first regular DJ.
                </p>
                <p>
                  <b>
                    <Link to="/djs">Our DJs</Link>
                  </b>{" "}
                  are the heart of Radio Tasty, and their taste and diversity
                  are what makes this worth anything&mdash;worth trying to be
                  anything&mdash;at all. They are music lovers to the core, and
                  they are here to share this love with you.
                </p>
                <p>
                  <b>Our listeners</b> share our love for music, and the joy of
                  non-algorithmic, human-curated radio. We 💜 you.
                </p>
              </FAQEntry>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AboutView;
