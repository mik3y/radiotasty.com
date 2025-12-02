import { faInstagram, faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Link, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import {
  RADIOCULT_API_PUBLISHABLE_KEY,
  RADIOCULT_STATION_ID,
} from "../lib/constants";
import {
  type Artist,
  getTipTapPlainText,
  RadioCultClient,
  type ScheduleItem,
} from "../lib/radiocult";
import { djDetailRoute } from "../routes";

const formatShowDateTime = (start: string, end: string): string => {
  const startTime = dayjs(start);
  const endTime = dayjs(end);
  return `${startTime.format("ddd, MMM D, YYYY")} • ${startTime.format("h:mm A")} - ${endTime.format("h:mm A")}`;
};

const DJDetailView = () => {
  const { slug } = useParams({ from: djDetailRoute.id });
  const [artist, setArtist] = useState<Artist | null>(null);
  const [upcomingShows, setUpcomingShows] = useState<ScheduleItem[]>([]);
  const [pastShows, setPastShows] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const client = new RadioCultClient({
      apiKey: RADIOCULT_API_PUBLISHABLE_KEY,
      stationId: RADIOCULT_STATION_ID,
    });

    const fetchData = async () => {
      try {
        const fetchedArtist = await client.getArtistBySlug(slug);
        setArtist(fetchedArtist);

        const now = new Date();
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const threeMonthsFromNow = new Date(now);
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

        const schedules = await client.getArtistSchedule(
          fetchedArtist.id,
          oneMonthAgo,
          threeMonthsFromNow,
        );

        const upcoming: ScheduleItem[] = [];
        const past: ScheduleItem[] = [];

        for (const show of schedules) {
          if (new Date(show.start) > now) {
            upcoming.push(show);
          } else {
            past.push(show);
          }
        }

        // Sort upcoming ascending (soonest first)
        upcoming.sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        );
        // Sort past descending (most recent first)
        past.sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
        );

        setUpcomingShows(upcoming);
        setPastShows(past);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load DJ");
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <>
        <PageHeader />
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#ff006e" }} />
        </Box>
      </>
    );
  }

  if (error || !artist) {
    return (
      <>
        <PageHeader />
        <Box sx={{ mt: 4, maxWidth: 800, mx: "auto", px: 2 }}>
          <Typography
            sx={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}
          >
            {error || "DJ not found"}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader />
      <Box sx={{ mt: 4, maxWidth: 800, mx: "auto", px: 2 }}>
        <Breadcrumbs
          separator="›"
          sx={{
            mb: 3,
            "& .MuiBreadcrumbs-separator": {
              color: "rgba(255, 255, 255, 0.4)",
              mx: 1,
            },
          }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.2s",
              "&:hover": {
                color: "#ff006e",
              },
            }}
          >
            Home
          </Typography>
          <Typography
            component={Link}
            to="/djs"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 0.2s",
              "&:hover": {
                color: "#ff006e",
              },
            }}
          >
            DJs
          </Typography>
          <Typography
            sx={{
              background: "linear-gradient(45deg, #ff006e 30%, #8338ec 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            {artist.name}
          </Typography>
        </Breadcrumbs>

        <Paper
          sx={{
            p: 4,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            textAlign: "center",
          }}
          elevation={0}
        >
          {artist.logo && (
            <Box
              component="img"
              src={artist.logo["512x512"]}
              alt={artist.name}
              sx={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                objectFit: "cover",
                mb: 3,
                border: "3px solid rgba(255, 0, 110, 0.5)",
              }}
            />
          )}

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              background: "linear-gradient(45deg, #ff006e 30%, #8338ec 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {artist.name}
          </Typography>

          {getTipTapPlainText(artist.description) && (
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 2,
                fontSize: "1.1rem",
              }}
            >
              {getTipTapPlainText(artist.description)}
            </Typography>
          )}

          {(artist.socials.instagramHandle || artist.socials.soundcloud) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              {artist.socials.instagramHandle && (
                <IconButton
                  component="a"
                  href={`https://instagram.com/${artist.socials.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    "&:hover": { color: "#E1306C" },
                  }}
                >
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </IconButton>
              )}
              {artist.socials.soundcloud && (
                <IconButton
                  component="a"
                  href={
                    artist.socials.soundcloud.startsWith("http")
                      ? artist.socials.soundcloud
                      : `https://soundcloud.com/${artist.socials.soundcloud}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    "&:hover": { color: "#FF5500" },
                  }}
                >
                  <FontAwesomeIcon icon={faSoundcloud} size="lg" />
                </IconButton>
              )}
            </Box>
          )}

          {artist.genres.length > 0 && (
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
            >
              {artist.genres.join(" • ")}
            </Typography>
          )}
        </Paper>

        {upcomingShows.length > 0 && (
          <Paper
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
            elevation={0}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              Upcoming Shows
            </Typography>
            <List disablePadding>
              {upcomingShows.map((show, index) => (
                <Box key={show.id}>
                  {index > 0 && (
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                  )}
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={show.title}
                      secondary={formatShowDateTime(show.start, show.end)}
                      primaryTypographyProps={{
                        sx: { color: "#fff", fontWeight: 500 },
                      }}
                      secondaryTypographyProps={{
                        sx: { color: "rgba(255,255,255,0.6)" },
                      }}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        )}

        {pastShows.length > 0 && (
          <Paper
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
            elevation={0}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Past Shows
            </Typography>
            <List disablePadding>
              {pastShows.map((show, index) => (
                <Box key={show.id}>
                  {index > 0 && (
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                  )}
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={show.title}
                      secondary={formatShowDateTime(show.start, show.end)}
                      primaryTypographyProps={{
                        sx: { color: "rgba(255,255,255,0.7)" },
                      }}
                      secondaryTypographyProps={{
                        sx: { color: "rgba(255,255,255,0.5)" },
                      }}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        )}

        {upcomingShows.length === 0 && pastShows.length === 0 && (
          <Paper
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              textAlign: "center",
            }}
            elevation={0}
          >
            <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
              No scheduled shows
            </Typography>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default DJDetailView;
