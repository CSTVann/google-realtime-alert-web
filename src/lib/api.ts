import { API_V1_URL } from "@/lib/config";
import type { AdminUser, AuthResponse, AuthUser, UserRole, UserStatus } from "@/lib/auth";
import { getAccessToken, saveAuthSession } from "@/lib/auth";

type ApiError = {
  detail?: string | { msg: string }[];
};

async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAccessToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_V1_URL}${path}`, {
    ...init,
    headers,
  });
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError;
    if (typeof data.detail === "string") {
      return data.detail;
    }
    if (Array.isArray(data.detail) && data.detail.length > 0) {
      return data.detail[0]?.msg ?? "Request failed";
    }
  } catch {
    // ignore JSON parse errors
  }
  return "Request failed";
}

export async function registerUser(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as AuthResponse;
  saveAuthSession(data);
  return data;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const data = (await response.json()) as AuthResponse;
  saveAuthSession(data);
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  if (!getAccessToken()) {
    throw new Error("Not authenticated");
  }

  const response = await apiFetch("/auth/me");

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AuthUser>;
}

export async function listUsers(): Promise<AdminUser[]> {
  const response = await apiFetch("/auth/users");

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AdminUser[]>;
}

export async function getUser(userId: string): Promise<AdminUser> {
  const response = await apiFetch(`/auth/users/${userId}`);

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AdminUser>;
}

export async function createUser(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}): Promise<AdminUser> {
  const response = await apiFetch("/auth/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AdminUser>;
}

export async function updateUser(
  userId: string,
  payload: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    password?: string;
  },
): Promise<AdminUser> {
  const response = await apiFetch(`/auth/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AdminUser>;
}

export async function deleteUser(userId: string): Promise<void> {
  const response = await apiFetch(`/auth/users/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}

export type Plan = {
  id: string;
  name: string;
  price_usd: number;
  credits: number;
  max_projects: number | null;
  credit_expiry_days: number;
  is_popular: boolean;
  description: string;
};

export type Wallet = {
  credits_balance: number;
  credits_expires_at: string | null;
  active_plan_id: string | null;
  active_plan_name: string | null;
  project_count: number;
  max_projects: number | null;
};

export type CreditTransaction = {
  id: string;
  amount: number;
  reason: string;
  description: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  telegram_chat_id: string | null;
  telegram_bot_token: string | null;
  is_active: boolean;
  track_count: number;
  telegram_connected: boolean;
  created_at: string;
  updated_at: string;
};

export type TrackRun = {
  id: string;
  track_id: string;
  project_id: string;
  keyword: string;
  credits_used: number;
  articles_found: number;
  message: string | null;
  created_at: string;
};

export type TrackSchedule = "hourly" | "daily" | "weekly";

export type Track = {
  id: string;
  project_id: string;
  keyword: string;
  schedule: TrackSchedule;
  track_from: string;
  track_until: string | null;
  is_active: boolean;
  last_tracked_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchPlans(): Promise<Plan[]> {
  const response = await apiFetch("/billing/plans");
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Plan[]>;
}

export async function fetchWallet(): Promise<Wallet> {
  const response = await apiFetch("/billing/wallet");
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Wallet>;
}

export async function fetchTransactions(): Promise<CreditTransaction[]> {
  const response = await apiFetch("/billing/transactions");
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<CreditTransaction[]>;
}

export async function checkoutPlan(planId: string) {
  const response = await apiFetch("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan_id: planId }),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<{
    status: string;
    message: string;
    plan_id: string;
    credits_added: number;
    credits_balance: number;
  }>;
}

export async function listProjects(): Promise<Project[]> {
  const response = await apiFetch("/projects");
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Project[]>;
}

export async function getProject(projectId: string): Promise<Project> {
  const response = await apiFetch(`/projects/${projectId}`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Project>;
}

export async function createProject(payload: {
  name: string;
  description?: string;
  telegram_chat_id?: string;
  telegram_bot_token?: string;
}) {
  const response = await apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Project>;
}

export async function updateProject(
  projectId: string,
  payload: Partial<{
    name: string;
    description: string | null;
    telegram_chat_id: string | null;
    telegram_bot_token: string | null;
    is_active: boolean;
  }>,
) {
  const response = await apiFetch(`/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Project>;
}

export async function listTracks(projectId: string): Promise<Track[]> {
  const response = await apiFetch(`/projects/${projectId}/tracks`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Track[]>;
}

export async function deleteTrack(trackId: string): Promise<void> {
  const response = await apiFetch(`/projects/tracks/${trackId}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await parseError(response));
}

export async function updateTrack(
  trackId: string,
  payload: Partial<{
    keyword: string;
    schedule: TrackSchedule;
    track_from: string;
    track_until: string | null;
    is_active: boolean;
  }>,
) {
  const response = await apiFetch(`/projects/tracks/${trackId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Track>;
}

export async function listTrackRuns(projectId: string): Promise<TrackRun[]> {
  const response = await apiFetch(`/projects/${projectId}/runs`);
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<TrackRun[]>;
}

export async function createTrack(
  projectId: string,
  payload: {
    keyword: string;
    schedule: TrackSchedule;
    track_from: string;
    track_until?: string | null;
  },
) {
  const response = await apiFetch(`/projects/${projectId}/tracks`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<Track>;
}

export async function runTrack(trackId: string) {
  const response = await apiFetch(`/projects/tracks/${trackId}/run`, {
    method: "POST",
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<{
    track_id: string;
    keyword: string;
    credits_used: number;
    articles_found: number;
    telegram_sent: boolean;
    message: string;
  }>;
}
