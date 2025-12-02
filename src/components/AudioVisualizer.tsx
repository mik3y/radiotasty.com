import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

import { useStream } from "../contexts/StreamContext";

export interface AudioVisualizerProps {
  height?: number;
  barCount?: number;
}

const COLORS = [
  "#00ffff", // cyan
  "#00e5ff",
  "#00ccff",
  "#00b3ff",
  "#0099ff",
  "#0080ff",
  "#0066ff",
  "#4d4dff",
  "#6633ff",
  "#8000ff", // purple
  "#9933ff",
  "#b366ff",
  "#cc00ff", // magenta
  "#e600e6",
  "#ff00cc",
  "#ff0099", // pink
];

// Attempt to get sample rate, with fallback
const getSampleRate = (analyser: AnalyserNode): number => {
  return analyser.context.sampleRate || 44100;
};

// Creates logarithmically-spaced frequency band boundaries
// Maps to useful musical range (~60Hz to ~14kHz)
// Returns an array of bin indices that serve as boundaries between bands
// For N bars, returns N+1 boundaries where band i spans [boundaries[i], boundaries[i+1])
const getLogFrequencyBands = (
  barCount: number,
  fftSize: number,
  sampleRate: number,
): number[] => {
  const minFreq = 60; // Low bass
  const maxFreq = 14000; // Upper treble
  const logMin = Math.log(minFreq);
  const logMax = Math.log(maxFreq);
  const logRange = logMax - logMin;

  // Calculate N+1 boundary points
  const boundaries: number[] = [];
  for (let i = 0; i <= barCount; i++) {
    const freq = Math.exp(logMin + (i / barCount) * logRange);
    const bin = Math.round((freq * fftSize) / sampleRate);
    boundaries.push(bin);
  }

  // Ensure boundaries are monotonically increasing (each at least 1 more than previous)
  for (let i = 1; i < boundaries.length; i++) {
    if (boundaries[i] <= boundaries[i - 1]) {
      boundaries[i] = boundaries[i - 1] + 1;
    }
  }

  return boundaries;
};

// Gets the average value for a frequency band
const getBandValue = (
  dataArray: Uint8Array,
  start: number,
  end: number,
): number => {
  const clampedStart = Math.max(0, start);
  const clampedEnd = Math.min(dataArray.length - 1, end);

  if (clampedStart >= clampedEnd) {
    return dataArray[clampedStart] || 0;
  }

  let sum = 0;
  let count = 0;
  for (let i = clampedStart; i <= clampedEnd; i++) {
    sum += dataArray[i];
    count++;
  }
  return count > 0 ? sum / count : 0;
};

const AudioVisualizer = ({
  height = 40,
  barCount = 16,
}: AudioVisualizerProps) => {
  const { isActive, getAnalyser } = useStream();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let boundaries: number[] | null = null;

    const draw = () => {
      const analyser = getAnalyser();

      if (!analyser) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Initialize boundaries on first frame
      if (!boundaries) {
        const sampleRate = getSampleRate(analyser);
        const fftSize = analyser.fftSize;
        boundaries = getLogFrequencyBands(barCount, fftSize, sampleRate);
      }

      const width = canvas.width;
      const canvasHeight = canvas.height;
      const barWidth = width / barCount;
      const gap = 2;

      ctx.clearRect(0, 0, width, canvasHeight);

      for (let i = 0; i < barCount; i++) {
        const start = boundaries[i];
        const end = boundaries[i + 1] - 1; // Exclusive end, so subtract 1 for inclusive range
        const value = getBandValue(dataArray, start, end);
        const barHeight = (value / 255) * canvasHeight;

        const colorIndex = Math.floor((i / barCount) * COLORS.length);
        ctx.fillStyle = COLORS[colorIndex];

        const x = i * barWidth + gap / 2;
        const y = canvasHeight - barHeight;

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - gap, barHeight, 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, getAnalyser, barCount]);

  if (!isActive) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height,
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "rgba(0, 0, 0, 0.2)",
      }}
    >
      <canvas
        ref={canvasRef}
        width={320}
        height={height}
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default AudioVisualizer;
