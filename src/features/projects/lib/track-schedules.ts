export type TrackSchedule =
  | "30s"
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "1h30m"
  | "3h"
  | "6h"
  | "12h"
  | "24h";

export const TRACK_SCHEDULE_OPTIONS: { value: TrackSchedule; label: string }[] = [
  { value: "30s", label: "Every 30 seconds" },
  { value: "1m", label: "Every 1 minute" },
  { value: "5m", label: "Every 5 minutes" },
  { value: "15m", label: "Every 15 minutes" },
  { value: "30m", label: "Every 30 minutes" },
  { value: "1h", label: "Every 1 hour" },
  { value: "1h30m", label: "Every 1 hour 30 minutes" },
  { value: "3h", label: "Every 3 hours" },
  { value: "6h", label: "Every 6 hours" },
  { value: "12h", label: "Every 12 hours" },
  { value: "24h", label: "Every 24 hours" },
];

export function scheduleLabel(value: string) {
  return TRACK_SCHEDULE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
