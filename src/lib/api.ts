import { API_V1_URL } from "@/lib/config";
import type { AuthResponse, AuthUser, UserRole } from "@/lib/auth";
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

export async function listUsers(): Promise<AuthUser[]> {
  const response = await apiFetch("/auth/users");

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AuthUser[]>;
}

export async function updateUser(
  userId: string,
  payload: {
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: UserRole;
    password?: string;
  },
): Promise<AuthUser> {
  const response = await apiFetch(`/auth/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<AuthUser>;
}
