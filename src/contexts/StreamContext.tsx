import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type MetadataProviderType,
  type PlaybackStatus,
  type StreamMetadata,
  StreamingStationPlayer,
  type StreamingStationPlayerHandle,
  type StreamingStationPlayerState,
} from "../components/StreamingStationPlayer";

// Poll more frequently when playing, less when idle
const METADATA_POLL_INTERVAL_ACTIVE_MS = 15000;
const METADATA_POLL_INTERVAL_IDLE_MS = 60000;

export type { PlaybackStatus, StreamMetadata, MetadataProviderType };

export type StreamState = StreamingStationPlayerState;

export interface StationConfig {
  playbackUrl: string;
  metadataUrl: string;
  metadataProvider: MetadataProviderType;
}

export interface StreamChangeEvent {
  state: StreamState;
  previousState: StreamState;
}

export interface StreamContextValue {
  state: StreamState;
  isActive: boolean;
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
  getAnalyser: () => AnalyserNode | null;
}

export interface StreamProviderProps {
  children: ReactNode;
  stationConfig: StationConfig;
  onChange?: (event: StreamChangeEvent) => void;
}

const defaultState: StreamState = {
  status: "stopped",
  volume: 1,
  metadata: {},
};

const StreamContext = createContext<StreamContextValue | null>(null);

export const StreamProvider = ({
  children,
  stationConfig,
  onChange,
}: StreamProviderProps) => {
  const [state, setState] = useState<StreamState>(defaultState);
  const [isActive, setIsActive] = useState(false);
  const playerRef = useRef<StreamingStationPlayerHandle>(null);
  const previousStateRef = useRef<StreamState>(defaultState);

  const handlePlayerChange = useCallback(
    (playerState: StreamingStationPlayerState) => {
      setState((currentState) => {
        // Merge player state but preserve elapsed/duration from context polling
        const mergedState: StreamState = {
          ...playerState,
          metadata: {
            ...playerState.metadata,
            elapsed: currentState.metadata.elapsed,
            duration: currentState.metadata.duration,
          },
        };
        const previousState = previousStateRef.current;
        previousStateRef.current = mergedState;
        onChange?.({ state: mergedState, previousState });
        return mergedState;
      });
    },
    [onChange],
  );

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    playerRef.current?.stop();
    setIsActive(false);
    const previousState = previousStateRef.current;
    // Preserve metadata and volume when stopping
    const newState: StreamState = {
      ...defaultState,
      volume: previousState.volume,
      metadata: previousState.metadata,
    };
    previousStateRef.current = newState;
    setState(newState);
    onChange?.({ state: newState, previousState });
  }, [onChange]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    playerRef.current?.setVolume(clampedVolume);
    setState((prev) => {
      const newState = { ...prev, volume: clampedVolume };
      previousStateRef.current = newState;
      return newState;
    });
  }, []);

  const getAnalyser = useCallback(() => {
    return playerRef.current?.getAnalyser() ?? null;
  }, []);

  // Start playback when activated
  useEffect(() => {
    if (isActive) {
      const frameId = requestAnimationFrame(() => {
        playerRef.current?.start();
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [isActive]);

  // Always fetch metadata, but at different intervals based on playback state
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(stationConfig.metadataUrl);
        if (!response.ok) return;

        const data = await response.json();
        const nowPlaying = data.now_playing;
        const song = nowPlaying?.song;

        if (song) {
          setState((prev) => ({
            ...prev,
            metadata: {
              title: song.title,
              artist: song.artist,
              album: song.album,
              art: song.art,
              elapsed: nowPlaying.elapsed,
              duration: nowPlaying.duration,
            },
          }));
        }
      } catch {
        // Ignore fetch errors for background polling
      }
    };

    // Fetch immediately
    fetchMetadata();

    // Set up polling interval based on active state
    const interval = isActive
      ? METADATA_POLL_INTERVAL_ACTIVE_MS
      : METADATA_POLL_INTERVAL_IDLE_MS;
    const intervalId = setInterval(fetchMetadata, interval);

    return () => clearInterval(intervalId);
  }, [stationConfig.metadataUrl, isActive]);

  // Tick elapsed time every second when playing
  useEffect(() => {
    if (!isActive) return;

    const tickInterval = setInterval(() => {
      setState((prev) => {
        if (prev.metadata.elapsed === undefined) return prev;

        const newState: StreamState = {
          ...prev,
          metadata: {
            ...prev.metadata,
            elapsed: prev.metadata.elapsed + 1,
          },
        };
        const previousState = previousStateRef.current;
        previousStateRef.current = newState;
        onChange?.({ state: newState, previousState });
        return newState;
      });
    }, 1000);

    return () => clearInterval(tickInterval);
  }, [isActive, onChange]);

  const value: StreamContextValue = {
    state,
    isActive,
    start,
    stop,
    setVolume,
    getAnalyser,
  };

  return (
    <StreamContext.Provider value={value}>
      {children}
      {isActive && (
        <StreamingStationPlayer
          ref={playerRef}
          playbackUrl={stationConfig.playbackUrl}
          metadataUrl={stationConfig.metadataUrl}
          metadataProvider={stationConfig.metadataProvider}
          onChange={handlePlayerChange}
        />
      )}
    </StreamContext.Provider>
  );
};

export const useStream = (): StreamContextValue => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
};
