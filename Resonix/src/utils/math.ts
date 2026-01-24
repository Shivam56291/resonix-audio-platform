export interface MapRangeOptions {
  inputValue: number;
  outputMin: number;
  outputMax: number;
  inputMax: number;
  inputMin: number;
}

export function mapRange({
  inputValue,
  outputMin,
  outputMax,
  inputMax,
  inputMin,
}: MapRangeOptions) {
  // Guard: invalid range
  if (inputMax === inputMin) return outputMin;

  const ratio = (inputValue - inputMin) / (inputMax - inputMin);

  // Clamp between 0–1
  const clamped = Math.min(1, Math.max(0, ratio));

  return clamped * (outputMax - outputMin) + outputMin;
}
