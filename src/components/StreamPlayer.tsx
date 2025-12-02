import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, IconButton, Slider, Stack, Typography } from "@mui/material";
import { useStream } from "../contexts/StreamContext";
import AudioVisualizer from "./AudioVisualizer";

export interface StreamPlayerProps {
  fullWidth?: boolean;
  titlePrefix?: string;
}

const StreamPlayer = ({
  fullWidth = false,
  titlePrefix = "Now Playing",
}: StreamPlayerProps) => {
  const { state, isActive, start, stop, setVolume } = useStream();
  const isLoading = state.status === "loading";

  const handlePlayStop = () => {
    if (isActive) {
      stop();
    } else {
      start();
    }
  };

  const handleVolumeChange = (_event: Event, value: number | number[]) => {
    setVolume((value as number) / 100);
  };

  const { title, artist, art, elapsed, duration } = state.metadata;

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timeDisplay =
    elapsed !== undefined && elapsed > 0
      ? duration && duration > 0
        ? `${formatTime(elapsed)} / ${formatTime(duration)}`
        : formatTime(elapsed)
      : null;

  const playButton = (
    <IconButton
      onClick={handlePlayStop}
      disabled={isLoading}
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "&:hover": {
          bgcolor: "primary.dark",
        },
        "&:disabled": {
          bgcolor: "action.disabledBackground",
        },
      }}
    >
      {isActive ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
  );

  const volumeControls = (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        width: fullWidth ? { xs: 100, sm: 150 } : "100%",
        mt: fullWidth ? 0 : 2,
        flexShrink: 0,
      }}
    >
      <VolumeDownIcon fontSize="small" color="action" />
      <Slider
        value={state.volume * 100}
        onChange={handleVolumeChange}
        aria-label="Volume"
        size="small"
        sx={{ flex: 1 }}
      />
      <VolumeUpIcon fontSize="small" color="action" />
    </Stack>
  );

  const metadataContent = (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {title && titlePrefix && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "block",
          }}
        >
          {titlePrefix}
        </Typography>
      )}
      {title && (
        <Typography
          variant={fullWidth ? "body2" : "body1"}
          sx={{
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
      )}
      {(artist || timeDisplay) && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {artist}
          {artist && timeDisplay && " · "}
          {timeDisplay}
        </Typography>
      )}
      {!title && !artist && (
        <Typography variant="body2" color="text.secondary">
          {isLoading ? "Loading..." : "Ready to play"}
        </Typography>
      )}
    </Box>
  );

  if (fullWidth) {
    return (
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2 }}
        alignItems="center"
        sx={{
          width: "100%",
          px: { xs: 1, sm: 2 },
          py: 1,
        }}
      >
        {playButton}

        {art && (
          <Box
            component="img"
            src={art}
            alt="Album art"
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: 1,
              objectFit: "cover",
              display: { xs: "none", sm: "block" },
            }}
          />
        )}

        {metadataContent}

        <Box sx={{ display: { xs: "none", sm: "flex" } }}>{volumeControls}</Box>

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: { md: 80, lg: 120 },
            flexShrink: 0,
          }}
        >
          <AudioVisualizer height={32} barCount={8} />
        </Box>
      </Stack>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        {art && (
          <Box
            component="img"
            src={art}
            alt="Album art"
            sx={{
              width: 64,
              height: 64,
              borderRadius: 1,
              objectFit: "cover",
            }}
          />
        )}

        {metadataContent}

        {playButton}
      </Stack>

      {volumeControls}

      <Box sx={{ mt: 2 }}>
        <AudioVisualizer height={32} />
      </Box>
    </Box>
  );
};

export default StreamPlayer;
