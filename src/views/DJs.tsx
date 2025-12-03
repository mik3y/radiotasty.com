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

import GradientButton from "../components/GradientButton";
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

const FEATURE_RECURRING_DJS = false;
const RECURRING_DJ_SLUGS = new Set([
  "herbie-monncuso",
  "wakebot",
  "he-panky",
  "justin-general",
  "technicolourbeats",
  "brother-kris",
  "k-town",
  "newguybrian",
  "cobo",
]);
const HIDDEN_TAG = "HIDDEN FROM DJS PAGE";

const isRecurringDJ = (artist: Artist): boolean => {
  const slug = artist.slug || artist.id;
  return RECURRING_DJ_SLUGS.has(slug);
};

interface DJCardProps {
  artist: Artist;
  isLarge?: boolean;
}

const DJCard = ({ artist, isLarge = false }: DJCardProps) => (
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
          height={isLarge ? 250 : 200}
          image={artist.logo["512x512"]}
          alt={artist.name}
          sx={{ objectFit: "cover" }}
        />
      )}
      <CardContent sx={{ textAlign: "center" }}>
        <Typography
          variant={isLarge ? "h5" : "h6"}
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
            {getTipTapPlainText(artist.description)?.split("\n")[0]}
          </Typography>
        )}
        {(artist.socials.instagramHandle || artist.socials.soundcloud) && (
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
);

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
        // Shuffle using Fisher-Yates algorithm
        for (let i = artists.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [artists[i], artists[j]] = [artists[j], artists[i]];
        }
        setArtists(artists);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const visibleArtists = artists.filter(
    (artist) => !artist.tags.includes(HIDDEN_TAG),
  );
  const recurringDJs = visibleArtists.filter(isRecurringDJ);
  const ensembleDJs = visibleArtists.filter((artist) => !isRecurringDJ(artist));

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
          Our DJs
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

        {!loading &&
          !error &&
          (FEATURE_RECURRING_DJS ? (
            <>
              {recurringDJs.length > 0 && (
                <Grid container spacing={3} justifyContent="center">
                  {recurringDJs.map((artist) => (
                    <Grid key={artist.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <DJCard artist={artist} isLarge />
                    </Grid>
                  ))}
                </Grid>
              )}

              {ensembleDJs.length > 0 && (
                <>
                  {FEATURE_RECURRING_DJS && (
                    <Typography
                      variant="h5"
                      sx={{
                        mt: 6,
                        mb: 3,
                        textAlign: "center",
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 500,
                      }}
                    >
                      Ensemble Players
                    </Typography>
                  )}
                  <Grid container spacing={3} justifyContent="center">
                    {ensembleDJs.map((artist) => (
                      <Grid
                        key={artist.id}
                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                      >
                        <DJCard artist={artist} />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </>
          ) : (
            <>
              {FEATURE_RECURRING_DJS && (
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 500,
                  }}
                >
                  Ensemble Players
                </Typography>
              )}
              <Grid container spacing={3} justifyContent="center">
                {[...recurringDJs, ...ensembleDJs].map((artist) => (
                  <Grid key={artist.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <DJCard artist={artist} />
                  </Grid>
                ))}
              </Grid>
            </>
          ))}

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <GradientButton to="/djs/join">
            Want to join us? Become the next Radio Tasty DJ
          </GradientButton>
        </Box>
      </Box>
    </>
  );
};

export default DJsView;
