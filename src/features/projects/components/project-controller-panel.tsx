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
  const [schedule, setSchedule] = useState<TrackSchedule>("daily");
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
        track_from: new Date(trackFrom).toISOString(),
        track_until: trackUntil ? new Date(trackUntil).toISOString() : null,
      });
      setKeyword("");
      setMessage("Keyword added.");
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
    setTrackFrom(toLocalInput(track.track_from));
    setTrackUntil(track.track_until ? toLocalInput(track.track_until) : "");
    setError(null);
    setMessage(null);
  }

  function cancelEdit() {
    setEditingTrack(null);
    setKeyword("");
    setSchedule("daily");
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
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-8">
        <Link href="/projects" className="text-sm text-muted hover:text-[var(--foreground)]">
          ← Back to projects
        </Link>
        <h1 className="mt-4 text-3xl font-semibold">{project.name}</h1>
        <p className="mt-2 text-sm text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs text-muted">
          <span>{project.telegram_connected ? "Telegram connected" : "Telegram not verified"}</span>
          <span>•</span>
          <span>{tracks.length} keywords</span>
          <span>•</span>
          <span>1 credit per keyword per run</span>
        </div>
      </section>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("keywords")}
          className={tab === "keywords" ? "btn-primary px-4 py-2 text-sm" : "btn-secondary px-4 py-2 text-sm"}
        >
          Keywords
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          className={tab === "history" ? "btn-primary px-4 py-2 text-sm" : "btn-secondary px-4 py-2 text-sm"}
        >
          Track history
        </button>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {message}
        </p>
      ) : null}

      {tab === "keywords" ? (
        <>
          <section className="panel rounded-[2rem] p-6">
            <h2 className="text-lg font-semibold">{editingTrack ? "Edit keyword" : "Add keyword"}</h2>
            <p className="mt-1 text-sm text-muted">
              Set a date window per keyword — e.g. track from Jan 1 until present, or until a specific end date.
            </p>
            <form
              className="mt-4 grid gap-4 md:grid-cols-2"
              onSubmit={editingTrack ? handleUpdateTrack : handleAddTrack}
            >
              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-medium">Keyword</span>
                <input required value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input-field" />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Schedule</span>
                <select value={schedule} onChange={(e) => setSchedule(e.target.value as TrackSchedule)} className="input-field">
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Track from</span>
                <input type="datetime-local" required value={trackFrom} onChange={(e) => setTrackFrom(e.target.value)} className="input-field" />
              </label>
              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm font-medium">Track until (optional)</span>
                <input type="datetime-local" value={trackUntil} onChange={(e) => setTrackUntil(e.target.value)} className="input-field" />
              </label>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button type="submit" disabled={isBusy} className="btn-primary px-5 py-3 text-sm disabled:opacity-60">
                  {editingTrack ? "Save changes" : "Add keyword"}
                </button>
                {editingTrack ? (
                  <button type="button" onClick={cancelEdit} className="btn-secondary px-5 py-3 text-sm">
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="panel rounded-[2rem] p-6">
            <h2 className="text-lg font-semibold">Active keywords</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--surface-strong)] font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Keyword</th>
                    <th className="px-4 py-3">Schedule</th>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">Until</th>
                    <th className="px-4 py-3">Last run</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map((track) => (
                    <tr key={track.id} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3 font-medium">{track.keyword}</td>
                      <td className="px-4 py-3 capitalize text-muted">{track.schedule}</td>
                      <td className="px-4 py-3 text-muted">{formatDate(track.track_from)}</td>
                      <td className="px-4 py-3 text-muted">
                        {track.track_until ? formatDate(track.track_until) : "Present"}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {track.last_tracked_at ? formatDate(track.last_tracked_at) : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" disabled={isBusy} onClick={() => startEdit(track)} className="btn-secondary px-2 py-1 text-xs">
                            Edit
                          </button>
                          <button type="button" disabled={isBusy} onClick={() => void handleRun(track.id)} className="btn-secondary px-2 py-1 text-xs">
                            Run (1 credit)
                          </button>
                          <button type="button" disabled={isBusy} onClick={() => void handleToggle(track)} className="btn-secondary px-2 py-1 text-xs">
                            {track.is_active ? "Pause" : "Resume"}
                          </button>
                          <button type="button" disabled={isBusy} onClick={() => void handleDelete(track.id)} className="text-xs text-red-500">
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
        <section className="panel rounded-[2rem] p-6">
          <h2 className="text-lg font-semibold">Tracking history</h2>
          <div className="mt-4 space-y-3">
            {runs.map((run) => (
              <div key={run.id} className="panel-strong rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{run.keyword}</p>
                  <p className="font-mono text-xs text-muted">{formatDate(run.created_at)}</p>
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
