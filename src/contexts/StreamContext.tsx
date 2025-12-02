import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  PlaybackStatus,
  StreamMetadata,
  StreamingStationPlayerState,
} from "../components/StreamingStationPlayer";

export type { PlaybackStatus, StreamMetadata };

export type StreamState = StreamingStationPlayerState;

export interface StreamChangeEvent {
  state: StreamState;
  previousState: StreamState;
}

export interface StreamContextValue {
  state: StreamState;
  start: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

export interface StreamProviderProps {
  children: ReactNode;
  streamUrl: string;
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
  streamUrl,
  onChange,
}: StreamProviderProps) => {
  const [state, setState] = useState<StreamState>(defaultState);

  const updateState = useCallback(
    (updates: Partial<StreamState>) => {
      setState((prev) => {
        const next = { ...prev, ...updates };
        if (onChange) {
          onChange({ state: next, previousState: prev });
        }
        return next;
      });
    },
    [onChange],
  );

  const start = useCallback(() => {
    // TODO: Implement actual playback
    updateState({ status: "loading" });
  }, [updateState]);

  const stop = useCallback(() => {
    // TODO: Implement actual stop
    updateState({ status: "stopped", metadata: {} });
  }, [updateState]);

  const setVolume = useCallback(
    (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      // TODO: Implement actual volume change
      updateState({ volume: clampedVolume });
    },
    [updateState],
  );

  // Reset state when stream URL changes
  useEffect(() => {
    setState(defaultState);
  }, [streamUrl]);

  const value: StreamContextValue = {
    state,
    start,
    stop,
    setVolume,
  };

  return (
    <StreamContext.Provider value={value}>{children}</StreamContext.Provider>
  );
};

export const useStream = (): StreamContextValue => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
};
