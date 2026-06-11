"use client";

import type { TrackSchedule } from "@/lib/api";
import { TRACK_SCHEDULE_OPTIONS } from "@/features/projects/lib/track-schedules";

const INTERVAL_GROUPS = [
  { label: "Fast", options: ["30s", "1m", "5m"] as TrackSchedule[] },
  { label: "Standard", options: ["15m", "30m", "1h"] as TrackSchedule[] },
  { label: "Extended", options: ["1h30m", "3h", "6h", "12h", "24h"] as TrackSchedule[] },
];

const optionLabelByValue = Object.fromEntries(
  TRACK_SCHEDULE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<TrackSchedule, string>;

const shortLabel: Record<TrackSchedule, string> = {
  "30s": "30s",
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "1h": "1h",
  "1h30m": "1h 30m",
  "3h": "3h",
  "6h": "6h",
  "12h": "12h",
  "24h": "24h",
};

type SchedulePickerProps = {
  schedule: TrackSchedule;
  scheduleEnabled: boolean;
  onScheduleChange: (value: TrackSchedule) => void;
  onScheduleEnabledChange: (enabled: boolean) => void;
};

export function SchedulePicker({
  schedule,
  scheduleEnabled,
  onScheduleChange,
  onScheduleEnabledChange,
}: SchedulePickerProps) {
  function selectInterval(value: TrackSchedule) {
    onScheduleChange(value);
    if (!scheduleEnabled) {
      onScheduleEnabledChange(true);
    }
  }

  return (
    <div className="schedule-section md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Schedule</p>
          <p className="mt-0.5 text-xs text-muted">
            {scheduleEnabled
              ? `Automatic — ${optionLabelByValue[schedule]}`
              : "Manual — use Run button only"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={scheduleEnabled}
            aria-label="Enable automatic schedule"
            onClick={() => onScheduleEnabledChange(!scheduleEnabled)}
            className={`schedule-toggle ${scheduleEnabled ? "schedule-toggle-on" : ""}`}
          >
            <span className="schedule-toggle-knob" />
          </button>
          <span className="schedule-toggle-label">{scheduleEnabled ? "ON" : "OFF"}</span>
        </div>
      </div>

      <div className={`schedule-interval-panel mt-4 ${scheduleEnabled ? "" : "schedule-interval-panel-off"}`}>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Interval</p>
        <div className="mt-3 space-y-3">
          {INTERVAL_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="schedule-group-label">{group.label}</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {group.options.map((value) => {
                  const active = schedule === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectInterval(value)}
                      className={`schedule-chip ${active ? "schedule-chip-active" : ""}`}
                      aria-pressed={active}
                    >
                      {shortLabel[value]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!scheduleEnabled ? (
          <p className="mt-3 text-xs text-muted">
            Turn schedule <span className="font-medium text-[var(--foreground)]">ON</span> or pick an
            interval to enable automatic tracking.
          </p>
        ) : null}
      </div>
    </div>
  );
}
