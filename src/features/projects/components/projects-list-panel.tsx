"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import { fetchWallet, listProjects, type Project } from "@/lib/api";

export function ProjectsListPanel() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [maxProjects, setMaxProjects] = useState<number | null>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    void Promise.all([listProjects(), fetchWallet()])
      .then(([projectData, wallet]) => {
        setProjects(projectData);
        setMaxProjects(wallet.max_projects);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load projects"));
  }, [isLoading, user, router]);

  const canCreate =
    maxProjects === null || projects.length < maxProjects;

  return (
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted">Projects</p>
            <h1 className="mt-2 text-3xl font-semibold">Your tracking projects</h1>
            <p className="mt-2 text-sm text-muted">
              {projects.length}
              {maxProjects !== null ? ` / ${maxProjects}` : ""} projects used
            </p>
          </div>
          {canCreate ? (
            <Link href="/projects/new" className="btn-primary px-5 py-3 text-sm">
              New project
            </Link>
          ) : (
            <Link href="/pricing" className="btn-secondary px-5 py-3 text-sm">
              Upgrade plan
            </Link>
          )}
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="panel-strong rounded-2xl p-5 transition hover:border-[var(--accent)]"
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted">
                {project.description || "No description"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono text-muted">
                <span>{project.track_count} keywords</span>
                <span>•</span>
                <span>{project.telegram_connected ? "Telegram linked" : "Telegram pending"}</span>
              </div>
            </Link>
          ))}
          {projects.length === 0 ? (
            <p className="text-sm text-muted md:col-span-2">
              No projects yet. Create your first project to start tracking keywords.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
