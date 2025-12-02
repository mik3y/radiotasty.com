import { faInstagram, faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
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
} from "../lib/radiocult";

const DJsView = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = new RadioCultClient({
      apiKey: RADIOCULT_API_PUBLISHABLE_KEY,
      stationId: RADIOCULT_STATION_ID,
    });

    client
      .getArtists()
      .then((artists) => {
        setArtists(artists);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHeader />
      <Box sx={{ mt: 4, maxWidth: 1200, mx: "auto", px: 2 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 600,
            textAlign: "center",
            background: "linear-gradient(45deg, #ff006e 30%, #8338ec 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          The DJs of Radio Tasty
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#ff006e" }} />
          </Box>
        )}

        {error && (
          <Typography
            sx={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}
          >
            Failed to load DJs: {error}
          </Typography>
        )}

        {!loading && !error && (
          <Grid container spacing={3} justifyContent="center">
            {artists.map((artist) => (
              <Grid key={artist.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(10px)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(255, 0, 110, 0.3)",
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    to="/djs/$slug"
                    params={{ slug: artist.slug || artist.id }}
                    sx={{ height: "100%" }}
                  >
                    {artist.logo && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={artist.logo["512x512"]}
                        alt={artist.name}
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          color: "#fff",
                          mb: getTipTapPlainText(artist.description) ? 1 : 0,
                        }}
                      >
                        {artist.name}
                      </Typography>
                      {getTipTapPlainText(artist.description) && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 1,
                          }}
                        >
                          {getTipTapPlainText(artist.description)}
                        </Typography>
                      )}
                      {(artist.socials.instagramHandle ||
                        artist.socials.soundcloud) && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                            mt: 1,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {artist.socials.instagramHandle && (
                            <IconButton
                              component="a"
                              href={`https://instagram.com/${artist.socials.instagramHandle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                "&:hover": { color: "#E1306C" },
                              }}
                            >
                              <FontAwesomeIcon icon={faInstagram} />
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
                              size="small"
                              sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                "&:hover": { color: "#FF5500" },
                              }}
                            >
                              <FontAwesomeIcon icon={faSoundcloud} />
                            </IconButton>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            component={Link}
            to="/djs/join"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "1.1rem",
              textDecoration: "none",
              transition: "color 0.2s",
              fontWeight: 600,
              "&:hover": {
                color: "#ff006e",
              },
            }}
          >
            Got what it takes? Become the next Radio Tasty DJ &raquo;
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default DJsView;
