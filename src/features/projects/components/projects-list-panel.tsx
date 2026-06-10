"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import { PageHeader } from "@/features/ui/page-header";
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

  const canCreate = maxProjects === null || projects.length < maxProjects;

  return (
    <div className="page-stack">
      <section className="panel p-6 sm:p-8">
        <PageHeader
          label="Projects"
          title="Your tracking projects"
          description={`${projects.length}${maxProjects !== null ? ` / ${maxProjects}` : ""} projects used`}
          action={
            canCreate ? (
              <Link href="/projects/new" className="btn-primary px-4 py-2.5">
                New project
              </Link>
            ) : (
              <Link href="/pricing" className="btn-secondary px-4 py-2.5">
                Upgrade plan
              </Link>
            )
          }
        />

        {error ? <p className="alert alert-error mt-6">{error}</p> : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="card-interactive block p-5"
            >
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted">
                {project.description || "No description"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge">{project.track_count} keywords</span>
                <span className={`badge ${project.telegram_connected ? "badge-success" : ""}`}>
                  {project.telegram_connected ? "Telegram linked" : "Telegram pending"}
                </span>
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
