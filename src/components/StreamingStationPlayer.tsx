import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type MetadataProviderType = "azuracast";

export type PlaybackStatus = "stopped" | "loading" | "playing" | "error";

export interface StreamMetadata {
  title?: string;
  artist?: string;
  album?: string;
}

export interface StreamingStationPlayerState {
  status: PlaybackStatus;
  volume: number;
  metadata: StreamMetadata;
  error?: string;
}

export interface StreamingStationPlayerHandle {
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

export interface StreamingStationPlayerProps {
  playbackUrl: string;
  metadataUrl: string;
  metadataProvider: MetadataProviderType;
  onChange?: (state: StreamingStationPlayerState) => void;
}

interface MetadataFetcher {
  start: () => void;
  stop: () => void;
}

const createAzuracastFetcher = (
  _metadataUrl: string,
  _onMetadata: (metadata: StreamMetadata) => void,
): MetadataFetcher => {
  // TODO: Implement Azuracast metadata fetching
  return {
    start: () => {
      // TODO: Start polling/SSE for metadata
    },
    stop: () => {
      // TODO: Stop polling/SSE
    },
  };
};

const createMetadataFetcher = (
  provider: MetadataProviderType,
  metadataUrl: string,
  onMetadata: (metadata: StreamMetadata) => void,
): MetadataFetcher => {
  switch (provider) {
    case "azuracast":
      return createAzuracastFetcher(metadataUrl, onMetadata);
    default:
      throw new Error(`Unknown metadata provider: ${provider}`);
  }
};

export const StreamingStationPlayer = forwardRef<
  StreamingStationPlayerHandle,
  StreamingStationPlayerProps
>(({ playbackUrl, metadataUrl, metadataProvider, onChange }, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const metadataFetcherRef = useRef<MetadataFetcher | null>(null);
  const stateRef = useRef<StreamingStationPlayerState>({
    status: "stopped",
    volume: 1,
    metadata: {},
  });

  const updateState = useCallback(
    (updates: Partial<StreamingStationPlayerState>) => {
      stateRef.current = { ...stateRef.current, ...updates };
      onChange?.(stateRef.current);
    },
    [onChange],
  );

  const handleMetadataUpdate = useCallback(
    (metadata: StreamMetadata) => {
      updateState({ metadata });
    },
    [updateState],
  );

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Handle playback URL changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playbackUrl;
    }
  }, [playbackUrl]);

  // Initialize metadata fetcher
  useEffect(() => {
    metadataFetcherRef.current = createMetadataFetcher(
      metadataProvider,
      metadataUrl,
      handleMetadataUpdate,
    );

    return () => {
      metadataFetcherRef.current?.stop();
      metadataFetcherRef.current = null;
    };
  }, [metadataUrl, metadataProvider, handleMetadataUpdate]);

  // Expose imperative handle
  useImperativeHandle(
    ref,
    () => ({
      start: () => {
        const audio = audioRef.current;
        if (!audio) return;

        updateState({ status: "loading" });

        // TODO: Implement actual playback
        audio
          .play()
          .then(() => {
            updateState({ status: "playing" });
            metadataFetcherRef.current?.start();
          })
          .catch((error) => {
            updateState({ status: "error", error: error.message });
          });
      },

      stop: () => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
        metadataFetcherRef.current?.stop();
        updateState({ status: "stopped", metadata: {} });
      },

      setVolume: (volume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        if (audioRef.current) {
          audioRef.current.volume = clampedVolume;
        }
        updateState({ volume: clampedVolume });
      },
    }),
    [updateState],
  );

  // No visible UI
  return null;
});
