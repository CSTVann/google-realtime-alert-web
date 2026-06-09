"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import {
  createProject,
  createTrack,
  listProjects,
  listTracks,
  runTrack,
  type Project,
  type Track,
  type TrackSchedule,
} from "@/lib/api";

function toLocalInputValue(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function ProjectsPanel() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");

  const [keyword, setKeyword] = useState("");
  const [schedule, setSchedule] = useState<TrackSchedule>("daily");
  const [trackFrom, setTrackFrom] = useState(toLocalInputValue());
  const [trackUntil, setTrackUntil] = useState("");

  const loadProjects = useCallback(async () => {
    const data = await listProjects();
    setProjects(data);
    if (!selectedId && data.length > 0) {
      setSelectedId(data[0].id);
    }
  }, [selectedId]);

  const loadTracks = useCallback(async (projectId: string) => {
    const data = await listTracks(projectId);
    setTracks(data);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    void loadProjects().catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load projects"),
    );
  }, [isLoading, user, router, loadProjects]);

  useEffect(() => {
    if (!selectedId) return;
    void loadTracks(selectedId).catch((err) =>
      setError(err instanceof Error ? err.message : "Failed to load tracks"),
    );
  }, [selectedId, loadTracks]);

  const selectedProject = projects.find((project) => project.id === selectedId) ?? null;

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setMessage(null);

    try {
      const project = await createProject({
        name: projectName,
        description: projectDescription || undefined,
        telegram_chat_id: telegramChatId || undefined,
        telegram_bot_token: telegramBotToken || undefined,
      });
      setProjects((current) => [project, ...current]);
      setSelectedId(project.id);
      setProjectName("");
      setProjectDescription("");
      setMessage("Project created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleCreateTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;

    setIsBusy(true);
    setError(null);
    setMessage(null);

    try {
      const track = await createTrack(selectedId, {
        keyword,
        schedule,
        track_from: new Date(trackFrom).toISOString(),
        track_until: trackUntil ? new Date(trackUntil).toISOString() : null,
      });
      setTracks((current) => [track, ...current]);
      setKeyword("");
      setMessage(`Track created for "${track.keyword}".`);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create track");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRunTrack(trackId: string) {
    setIsBusy(true);
    setError(null);
    setMessage(null);

    try {
      const result = await runTrack(trackId);
      setMessage(result.message);
      if (selectedId) {
        await loadTracks(selectedId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Track run failed");
    } finally {
      setIsBusy(false);
    }
  }

  if (isLoading) {
    return (
      <div className="panel rounded-[2rem] p-8">
        <div className="h-8 w-56 animate-pulse rounded-full bg-[var(--border)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-muted">
          Projects
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Keyword tracking ops</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">
          Create a project, connect Telegram, add keywords, set a schedule and date window. Each
          manual or scheduled track uses 1 credit per keyword.{" "}
          <Link href="/pricing" className="underline underline-offset-4">
            Buy credits
          </Link>
        </p>
        <p className="mt-3 font-mono text-sm text-muted">
          Balance: {user?.credits_balance ?? 0} credits
        </p>
      </section>

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

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="panel rounded-[2rem] p-6">
          <h2 className="text-lg font-semibold">Your projects</h2>
          <div className="mt-4 space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedId(project.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedId === project.id
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "border-[var(--border)] bg-[var(--surface-strong)]"
                }`}
              >
                <p className="font-medium">{project.name}</p>
                <p className="mt-1 text-xs opacity-80">{project.track_count} tracks</p>
              </button>
            ))}
            {projects.length === 0 ? (
              <p className="text-sm text-muted">No projects yet. Create your first one.</p>
            ) : null}
          </div>
        </aside>

        <div className="space-y-6">
          <section className="panel rounded-[2rem] p-6">
            <h2 className="text-lg font-semibold">Create project</h2>
            <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleCreateProject}>
              <label className="block space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Project name</span>
                <input
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="input-field"
                  placeholder="Brand mentions monitor"
                />
              </label>
              <label className="block space-y-2 sm:col-span-2">
                <span className="text-sm font-medium">Description</span>
                <input
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="input-field"
                  placeholder="Track competitor news and product launches"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Telegram chat ID</span>
                <input
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="input-field"
                  placeholder="-1001234567890"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Telegram bot token</span>
                <input
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  className="input-field"
                  placeholder="123456:ABC..."
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="btn-primary px-5 py-3 text-sm disabled:opacity-60"
                >
                  Create project
                </button>
              </div>
            </form>
          </section>

          {selectedProject ? (
            <>
              <section className="panel rounded-[2rem] p-6">
                <h2 className="text-lg font-semibold">Add track to {selectedProject.name}</h2>
                <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleCreateTrack}>
                  <label className="block space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium">Keyword</span>
                    <input
                      required
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="input-field"
                      placeholder="openai new model"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">Schedule</span>
                    <select
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value as TrackSchedule)}
                      className="input-field"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">Track from</span>
                    <input
                      type="datetime-local"
                      required
                      value={trackFrom}
                      onChange={(e) => setTrackFrom(e.target.value)}
                      className="input-field"
                    />
                  </label>
                  <label className="block space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium">Track until (optional)</span>
                    <input
                      type="datetime-local"
                      value={trackUntil}
                      onChange={(e) => setTrackUntil(e.target.value)}
                      className="input-field"
                    />
                  </label>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isBusy}
                      className="btn-primary px-5 py-3 text-sm disabled:opacity-60"
                    >
                      Add track
                    </button>
                  </div>
                </form>
              </section>

              <section className="panel rounded-[2rem] p-6">
                <h2 className="text-lg font-semibold">Tracks</h2>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)]">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[var(--surface-strong)] font-mono text-xs uppercase tracking-[0.2em] text-muted">
                      <tr>
                        <th className="px-4 py-3">Keyword</th>
                        <th className="px-4 py-3">Schedule</th>
                        <th className="px-4 py-3">Last track</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tracks.map((track) => (
                        <tr key={track.id} className="border-t border-[var(--border)]">
                          <td className="px-4 py-3 font-medium">{track.keyword}</td>
                          <td className="px-4 py-3 capitalize text-muted">{track.schedule}</td>
                          <td className="px-4 py-3 text-muted">
                            {track.last_tracked_at
                              ? new Date(track.last_tracked_at).toLocaleString()
                              : "Never"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => void handleRunTrack(track.id)}
                              className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-60"
                            >
                              Run now (1 credit)
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tracks.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-muted">No tracks yet for this project.</p>
                  ) : null}
                </div>
              </section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
