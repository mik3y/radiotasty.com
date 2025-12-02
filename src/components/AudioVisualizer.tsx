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

// Convert frequency (Hz) to FFT bin index
const freqToBin = (
  freq: number,
  fftSize: number,
  sampleRate: number,
): number => {
  return Math.round((freq * fftSize) / sampleRate);
};

// Creates logarithmically-spaced frequency band boundaries
// Maps to useful musical range (~60Hz to ~14kHz)
const getLogFrequencyBands = (
  barCount: number,
  fftSize: number,
  sampleRate: number,
) => {
  const bands: Array<{ start: number; end: number }> = [];
  const minFreq = 60; // Low bass
  const maxFreq = 14000; // Upper treble
  const logMin = Math.log(minFreq);
  const logMax = Math.log(maxFreq);
  const logRange = logMax - logMin;

  for (let i = 0; i < barCount; i++) {
    const startFreq = Math.exp(logMin + (i / barCount) * logRange);
    const endFreq = Math.exp(logMin + ((i + 1) / barCount) * logRange);

    bands.push({
      start: freqToBin(startFreq, fftSize, sampleRate),
      end: freqToBin(endFreq, fftSize, sampleRate),
    });
  }

  return bands;
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

    let bands: Array<{ start: number; end: number }> | null = null;

    const draw = () => {
      const analyser = getAnalyser();

      if (!analyser) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      // Initialize bands on first frame
      if (!bands) {
        const sampleRate = getSampleRate(analyser);
        const fftSize = analyser.fftSize;
        bands = getLogFrequencyBands(barCount, fftSize, sampleRate);
      }

      const width = canvas.width;
      const canvasHeight = canvas.height;
      const barWidth = width / barCount;
      const gap = 2;

      ctx.clearRect(0, 0, width, canvasHeight);

      for (let i = 0; i < barCount; i++) {
        const band = bands[i];
        const value = getBandValue(dataArray, band.start, band.end);
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
