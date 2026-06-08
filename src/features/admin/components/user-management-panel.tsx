"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import { listUsers, updateUser } from "@/lib/api";
import type { AuthUser, UserRole } from "@/lib/auth";
import { isAdmin } from "@/lib/auth";

type EditFormState = {
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  password: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toEditForm(user: AuthUser): EditFormState {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    password: "",
  };
}

export function UserManagementPanel() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<EditFormState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await listUsers();
      setUsers(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!isAdmin(user)) {
      router.replace("/account");
      return;
    }

    void loadUsers();
  }, [authLoading, user, router, loadUsers]);

  function openEditor(target: AuthUser) {
    setSelectedUser(target);
    setForm(toEditForm(target));
    setError(null);
    setSuccess(null);
  }

  function closeEditor() {
    setSelectedUser(null);
    setForm(null);
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser || !form) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload: {
      first_name: string;
      last_name: string;
      email: string;
      role: UserRole;
      password?: string;
    } = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      role: form.role,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      const updated = await updateUser(selectedUser.id, payload);
      setUsers((current) =>
        current.map((entry) => (entry.id === updated.id ? updated : entry)),
      );
      setSelectedUser(updated);
      setForm(toEditForm(updated));
      setSuccess("User updated successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Update failed");
    } finally {
      setIsSaving(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-950/10 backdrop-blur">
        <div className="h-8 w-56 animate-pulse rounded-full bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-950/10 backdrop-blur">
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            Admin
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            User accounts
          </h1>
          <p className="text-sm text-slate-600">
            View and edit every registered account.
          </p>
        </div>

        {error && !selectedUser ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {entry.first_name} {entry.last_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{entry.email}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{entry.role}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(entry.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openEditor(entry)}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-950 hover:text-white"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && form ? (
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-950/10 backdrop-blur">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Edit user
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                {selectedUser.first_name} {selectedUser.last_name}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-950 hover:text-white"
            >
              Close
            </button>
          </div>

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">First name</span>
              <input
                required
                value={form.first_name}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, first_name: event.target.value } : current,
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Last name</span>
              <input
                required
                value={form.last_name}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, last_name: event.target.value } : current,
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

            <label className="block space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, email: event.target.value } : current,
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((current) =>
                    current
                      ? { ...current, role: event.target.value as UserRole }
                      : current,
                  )
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">New password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, password: event.target.value } : current,
                  )
                }
                placeholder="Leave blank to keep current password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950"
              />
            </label>

            {error ? (
              <p className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="sm:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
