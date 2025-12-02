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
  art?: string;
  elapsed?: number;
  duration?: number;
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
  getAnalyser: () => AnalyserNode | null;
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

interface AzuracastNowPlayingResponse {
  now_playing?: {
    song?: {
      title?: string;
      artist?: string;
      album?: string;
      art?: string;
    };
    elapsed?: number;
    duration?: number;
  };
}

interface AzuracastWebSocketMessage {
  connect?: {
    time?: number;
    subs?: Record<
      string,
      {
        publications?: Array<{
          data: { np: AzuracastNowPlayingResponse };
        }>;
      }
    >;
  };
  pub?: {
    data: {
      np: AzuracastNowPlayingResponse;
    };
  };
}

const AZURACAST_POLL_INTERVAL_MS = 15000;
const AZURACAST_WS_RECONNECT_DELAY_MS = 5000;

const extractMetadataFromNowPlaying = (
  data: AzuracastNowPlayingResponse,
): StreamMetadata | null => {
  const song = data.now_playing?.song;
  if (!song) return null;

  return {
    title: song.title,
    artist: song.artist,
    album: song.album,
    art: song.art,
    elapsed: data.now_playing?.elapsed,
    duration: data.now_playing?.duration,
  };
};

const createAzuracastFetcher = (
  metadataUrl: string,
  onMetadata: (metadata: StreamMetadata) => void,
): MetadataFetcher => {
  let socket: WebSocket | null = null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let abortController: AbortController | null = null;
  let reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let useWebSocket = true;
  let isRunning = false;

  // Derive WebSocket URL and station name from metadata URL
  // metadataUrl format: https://listen.radiotasty.com/api/nowplaying/radio_tasty
  const getWebSocketConfig = () => {
    try {
      const url = new URL(metadataUrl);
      const pathParts = url.pathname.split("/");
      const stationName = pathParts[pathParts.length - 1];
      const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${url.host}/api/live/nowplaying/websocket`;
      return { wsUrl, stationName };
    } catch {
      return null;
    }
  };

  const fetchMetadata = async () => {
    abortController = new AbortController();

    try {
      const response = await fetch(metadataUrl, {
        signal: abortController.signal,
      });

      if (!response.ok) {
        return;
      }

      const data: AzuracastNowPlayingResponse = await response.json();
      const metadata = extractMetadataFromNowPlaying(data);
      if (metadata) {
        onMetadata(metadata);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
    }
  };

  const startPolling = () => {
    if (intervalId !== null) return;
    fetchMetadata();
    intervalId = setInterval(fetchMetadata, AZURACAST_POLL_INTERVAL_MS);
  };

  const stopPolling = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };

  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const message: AzuracastWebSocketMessage = JSON.parse(event.data);

      // Handle initial connection with cached data
      if (message.connect?.subs) {
        for (const subName in message.connect.subs) {
          const sub = message.connect.subs[subName];
          if (sub.publications && sub.publications.length > 0) {
            const lastPublication =
              sub.publications[sub.publications.length - 1];
            const metadata = extractMetadataFromNowPlaying(
              lastPublication.data.np,
            );
            if (metadata) {
              onMetadata(metadata);
            }
          }
        }
      }

      // Handle live updates
      if (message.pub?.data?.np) {
        const metadata = extractMetadataFromNowPlaying(message.pub.data.np);
        if (metadata) {
          onMetadata(metadata);
        }
      }
    } catch {
      // Ignore parse errors (e.g., empty ping messages)
    }
  };

  const connectWebSocket = () => {
    const config = getWebSocketConfig();
    if (!config) {
      useWebSocket = false;
      startPolling();
      return;
    }

    try {
      socket = new WebSocket(config.wsUrl);

      socket.onopen = () => {
        // Subscribe to station updates
        socket?.send(
          JSON.stringify({
            subs: {
              [`station:${config.stationName}`]: { recover: true },
            },
          }),
        );
      };

      socket.onmessage = handleWebSocketMessage;

      socket.onerror = () => {
        // WebSocket failed, fall back to polling
        useWebSocket = false;
        socket?.close();
        socket = null;
        startPolling();
      };

      socket.onclose = () => {
        socket = null;
        if (isRunning && useWebSocket) {
          // Attempt to reconnect after a delay
          reconnectTimeoutId = setTimeout(() => {
            if (isRunning) {
              connectWebSocket();
            }
          }, AZURACAST_WS_RECONNECT_DELAY_MS);
        }
      };
    } catch {
      // WebSocket construction failed, fall back to polling
      useWebSocket = false;
      startPolling();
    }
  };

  return {
    start: () => {
      if (isRunning) return;
      isRunning = true;

      if (useWebSocket) {
        connectWebSocket();
      } else {
        startPolling();
      }
    },
    stop: () => {
      isRunning = false;

      if (reconnectTimeoutId !== null) {
        clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = null;
      }

      if (socket) {
        socket.close();
        socket = null;
      }

      stopPolling();
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
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
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
        sourceRef.current = null;
      }
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

        // Initialize audio context and analyser on first play
        if (!audioContextRef.current) {
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.92;

          const source = audioContext.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(audioContext.destination);

          audioContextRef.current = audioContext;
          analyserRef.current = analyser;
          sourceRef.current = source;
        }

        // Resume audio context if suspended
        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume();
        }

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

      getAnalyser: () => analyserRef.current,
    }),
    [updateState],
  );

  // No visible UI
  return null;
});
