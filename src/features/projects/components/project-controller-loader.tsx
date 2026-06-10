"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ProjectControllerPanel } from "@/features/projects/components/project-controller-panel";
import { getProject, type Project } from "@/lib/api";

export function ProjectControllerLoader({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getProject(projectId)
      .then(setProject)
      .catch((err) => {
        if (err instanceof Error && err.message === "Not authenticated") {
          router.replace("/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load");
      });
  }, [projectId, router]);

  if (error) {
    return (
      <div className="panel p-8">
        <p className="alert alert-error">{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="panel p-8">
        <div className="skeleton h-8 w-48" />
      </div>
    );
  }

  return <ProjectControllerPanel project={project} />;
}
