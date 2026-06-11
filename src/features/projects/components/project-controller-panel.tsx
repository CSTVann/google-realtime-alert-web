"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import {
  createTrack,
  deleteTrack,
  listTrackRuns,
  listTracks,
  runTrack,
  updateTrack,
  type Project,
  type Track,
  type TrackRun,
  type TrackSchedule,
} from "@/lib/api";
import {
  scheduleLabel,
} from "@/features/projects/lib/track-schedules";
import { SchedulePicker } from "@/features/projects/components/schedule-picker";

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

export function ProjectControllerPanel({ project }: { project: Project }) {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [runs, setRuns] = useState<TrackRun[]>([]);
  const [tab, setTab] = useState<"keywords" | "history">("keywords");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  const [keyword, setKeyword] = useState("");
  const [schedule, setSchedule] = useState<TrackSchedule>("1h");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [trackFrom, setTrackFrom] = useState(toLocalInput(new Date().toISOString()));
  const [trackUntil, setTrackUntil] = useState("");

  const loadData = useCallback(async () => {
    const [trackData, runData] = await Promise.all([
      listTracks(project.id),
      listTrackRuns(project.id),
    ]);
    setTracks(trackData);
    setRuns(runData);
  }, [project.id]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    void loadData().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load project"),
    );
  }, [isLoading, user, router, loadData]);

  async function handleAddTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setMessage(null);
    try {
      await createTrack(project.id, {
        keyword: keyword.trim(),
        schedule,
        schedule_enabled: scheduleEnabled,
        track_from: new Date(trackFrom).toISOString(),
        track_until: trackUntil ? new Date(trackUntil).toISOString() : null,
      });
      setKeyword("");
      setScheduleEnabled(false);
      setMessage(scheduleEnabled ? "Keyword added with automatic schedule." : "Keyword added.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add keyword");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRun(trackId: string) {
    setIsBusy(true);
    setError(null);
    setMessage(null);
    try {
      const result = await runTrack(trackId);
      setMessage(result.message);
      await Promise.all([loadData(), refreshUser()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Track failed");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDelete(trackId: string) {
    if (!window.confirm("Remove this keyword track?")) return;
    setIsBusy(true);
    try {
      await deleteTrack(trackId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleToggleSchedule(track: Track) {
    setIsBusy(true);
    try {
      await updateTrack(track.id, { schedule_enabled: !track.schedule_enabled });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleToggle(track: Track) {
    setIsBusy(true);
    try {
      await updateTrack(track.id, { is_active: !track.is_active });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsBusy(false);
    }
  }

  function startEdit(track: Track) {
    setEditingTrack(track);
    setKeyword(track.keyword);
    setSchedule(track.schedule);
    setScheduleEnabled(track.schedule_enabled);
    setTrackFrom(toLocalInput(track.track_from));
    setTrackUntil(track.track_until ? toLocalInput(track.track_until) : "");
    setError(null);
    setMessage(null);
  }

  function cancelEdit() {
    setEditingTrack(null);
    setKeyword("");
    setSchedule("1h");
    setScheduleEnabled(false);
    setTrackFrom(toLocalInput(new Date().toISOString()));
    setTrackUntil("");
  }

  async function handleUpdateTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTrack) return;
    setIsBusy(true);
    setError(null);
    setMessage(null);
    try {
      await updateTrack(editingTrack.id, {
        keyword: keyword.trim(),
        schedule,
        schedule_enabled: scheduleEnabled,
        track_from: new Date(trackFrom).toISOString(),
        track_until: trackUntil ? new Date(trackUntil).toISOString() : null,
      });
      setMessage("Keyword updated.");
      cancelEdit();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="panel p-6 sm:p-8">
        <Link href="/projects" className="text-sm text-muted hover:text-[var(--foreground)]">
          ← Back to projects
        </Link>
        <h1 className="mt-4 page-title">{project.name}</h1>
        {project.description ? <p className="mt-2 page-description">{project.description}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`badge ${project.telegram_connected ? "badge-success" : ""}`}>
            {project.telegram_connected ? "Telegram connected" : "Telegram not verified"}
          </span>
          <span className="badge">{tracks.length} keywords</span>
          <span className="badge">1 credit / run</span>
        </div>
      </section>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("keywords")}
          className={tab === "keywords" ? "btn-primary px-4 py-2" : "btn-secondary px-4 py-2"}
        >
          Keywords
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          className={tab === "history" ? "btn-primary px-4 py-2" : "btn-secondary px-4 py-2"}
        >
          Track history
        </button>
      </div>

      {error ? <p className="alert alert-error">{error}</p> : null}
      {message ? <p className="alert alert-success">{message}</p> : null}

      {tab === "keywords" ? (
        <>
          <section className="panel p-6">
            <h2 className="text-lg font-semibold">{editingTrack ? "Edit keyword" : "Add keyword"}</h2>
            <p className="mt-1 text-sm text-muted">
              Pick manual or automatic tracking, then set your keyword and date window.
            </p>
            <form
              className="mt-4 grid gap-4 md:grid-cols-2"
              onSubmit={editingTrack ? handleUpdateTrack : handleAddTrack}
            >
              <label className="block space-y-1.5 md:col-span-2">
                <span className="text-sm font-medium">Keyword</span>
                <input required value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-field" />
              </label>

              <SchedulePicker
                schedule={schedule}
                scheduleEnabled={scheduleEnabled}
                onScheduleChange={setSchedule}
                onScheduleEnabledChange={setScheduleEnabled}
              />

              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Track from</span>
                <input type="datetime-local" required value={trackFrom} onChange={(e) => setTrackFrom(e.target.value)} className="input-field" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Track until (optional)</span>
                <input type="datetime-local" value={trackUntil} onChange={(e) => setTrackUntil(e.target.value)} className="input-field" />
              </label>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={isBusy} className="btn-primary px-4 py-2.5">
                  {editingTrack ? "Save changes" : "Add keyword"}
                </button>
                {editingTrack ? (
                  <button type="button" onClick={cancelEdit} className="btn-secondary px-4 py-2.5">
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="panel p-6">
            <h2 className="text-lg font-semibold">Active keywords</h2>
            <div className="data-table-wrap mt-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Keyword</th>
                    <th>Schedule</th>
                    <th>Mode</th>
                    <th>From</th>
                    <th>Until</th>
                    <th>Last run</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track) => (
                    <tr key={track.id}>
                      <td className="font-medium">{track.keyword}</td>
                      <td className="text-muted">{scheduleLabel(track.schedule)}</td>
                      <td>
                        <span className={`badge ${track.schedule_enabled ? "badge-success" : ""}`}>
                          {track.schedule_enabled ? "Auto" : "Manual"}
                        </span>
                      </td>
                      <td className="text-muted">{formatDate(track.track_from)}</td>
                      <td className="text-muted">
                        {track.track_until ? formatDate(track.track_until) : "Present"}
                      </td>
                      <td className="text-muted">
                        {track.last_tracked_at ? formatDate(track.last_tracked_at) : "Never"}
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button type="button" disabled={isBusy} onClick={() => startEdit(track)} className="btn-secondary px-2 py-1 text-xs">
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => void handleToggleSchedule(track)}
                            className={`px-2 py-1 text-xs ${track.schedule_enabled ? "btn-primary" : "btn-secondary"}`}
                          >
                            Schedule
                          </button>
                          <button type="button" disabled={isBusy} onClick={() => void handleRun(track.id)} className="btn-secondary px-2 py-1 text-xs">
                            Run
                          </button>
                          <button type="button" disabled={isBusy} onClick={() => void handleToggle(track)} className="btn-secondary px-2 py-1 text-xs">
                            {track.is_active ? "Pause" : "Resume"}
                          </button>
                          <button type="button" disabled={isBusy} onClick={() => void handleDelete(track.id)} className="btn-ghost px-2 py-1 text-xs text-[var(--danger)]">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tracks.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted">No keywords yet.</p>
              ) : null}
            </div>
          </section>
        </>
      ) : (
        <section className="panel p-6">
          <h2 className="text-lg font-semibold">Tracking history</h2>
          <div className="mt-4 space-y-3">
            {runs.map((run) => (
              <div key={run.id} className="panel-strong p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{run.keyword}</p>
                  <p className="text-xs text-muted">{formatDate(run.created_at)}</p>
                </div>
                <p className="mt-2 text-sm text-muted">
                  {run.articles_found} results · {run.credits_used} credit(s)
                </p>
                {run.message ? <p className="mt-1 text-sm">{run.message}</p> : null}
              </div>
            ))}
            {runs.length === 0 ? (
              <p className="text-sm text-muted">No tracking runs yet. Run a keyword to see history here.</p>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}
