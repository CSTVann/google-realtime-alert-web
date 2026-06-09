"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/auth-provider";
import { createUser, deleteUser, listUsers, updateUser } from "@/lib/api";
import type { AdminUser, UserRole, UserStatus } from "@/lib/auth";
import { isAdmin } from "@/lib/auth";

type EditFormState = {
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password: string;
};

type CreateFormState = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
};

const emptyCreateForm: CreateFormState = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "user",
  status: "active",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function truncateHash(hash: string) {
  if (hash.length <= 20) return hash;
  return `${hash.slice(0, 16)}…`;
}

function toEditForm(user: AdminUser): EditFormState {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    status: user.status,
    password: "",
  };
}

function statusBadgeClass(status: UserStatus) {
  return status === "active"
    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
    : "bg-red-500/15 text-red-600 dark:text-red-400";
}

export function UserManagementPanel() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<EditFormState | null>(null);
  const [createForm, setCreateForm] = useState<CreateFormState>(emptyCreateForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

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
    if (authLoading) return;
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

  function openEditor(target: AdminUser) {
    setSelectedUser(target);
    setForm(toEditForm(target));
    setShowCreate(false);
    setError(null);
    setSuccess(null);
  }

  function closeEditor() {
    setSelectedUser(null);
    setForm(null);
    setError(null);
    setSuccess(null);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const created = await createUser({
        first_name: createForm.first_name.trim(),
        last_name: createForm.last_name.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        role: createForm.role,
        status: createForm.status,
      });
      setUsers((current) => [created, ...current]);
      setCreateForm(emptyCreateForm);
      setShowCreate(false);
      setSuccess(`User ${created.email} created.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Create failed");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser || !form) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload: {
      first_name: string;
      last_name: string;
      email: string;
      role: UserRole;
      status: UserStatus;
      password?: string;
    } = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      const updated = await updateUser(selectedUser.id, payload);
      setUsers((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
      setSelectedUser(updated);
      setForm(toEditForm(updated));
      setSuccess("User updated successfully.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Update failed");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(target: AdminUser) {
    if (!window.confirm(`Delete ${target.email}? This cannot be undone.`)) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteUser(target.id);
      setUsers((current) => current.filter((entry) => entry.id !== target.id));
      if (selectedUser?.id === target.id) {
        closeEditor();
      }
      setSuccess(`User ${target.email} deleted.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Delete failed");
    } finally {
      setIsSaving(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="panel rounded-[2rem] p-8">
        <div className="h-8 w-56 animate-pulse rounded-full bg-[var(--border)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="panel rounded-[2rem] p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-muted">
              Admin
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">User CRUD</h1>
            <p className="text-sm text-muted">
              Create, read, update, and delete users. Set status to Active or Banned.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowCreate((value) => !value);
              closeEditor();
            }}
            className="btn-primary px-5 py-3 text-sm"
          >
            {showCreate ? "Close create" : "Create user"}
          </button>
        </div>

        {error && !selectedUser && !showCreate ? (
          <p className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {success}
          </p>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--surface-strong)] font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Password</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((entry) => (
                <tr key={entry.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-medium">
                    {entry.first_name} {entry.last_name}
                  </td>
                  <td className="px-4 py-3 text-muted">{entry.email}</td>
                  <td className="px-4 py-3 capitalize text-muted">{entry.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadgeClass(entry.status)}`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{entry.credits_balance}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted" title={entry.password_hash}>
                    {truncateHash(entry.password_hash)}
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(entry.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditor(entry)}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={isSaving || entry.id === user?.id}
                        onClick={() => void handleDelete(entry)}
                        className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showCreate ? (
        <section className="panel rounded-[2rem] p-8">
          <h2 className="text-xl font-semibold">Create user</h2>
          <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleCreate}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">First name</span>
              <input
                required
                value={createForm.first_name}
                onChange={(e) => setCreateForm((c) => ({ ...c, first_name: e.target.value }))}
                className="input-field"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Last name</span>
              <input
                required
                value={createForm.last_name}
                onChange={(e) => setCreateForm((c) => ({ ...c, last_name: e.target.value }))}
                className="input-field"
              />
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="text-sm font-medium">Email</span>
              <input
                required
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((c) => ({ ...c, email: e.target.value }))}
                className="input-field"
              />
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="text-sm font-medium">Password</span>
              <input
                required
                type="password"
                minLength={8}
                value={createForm.password}
                onChange={(e) => setCreateForm((c) => ({ ...c, password: e.target.value }))}
                className="input-field"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Role</span>
              <select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm((c) => ({ ...c, role: e.target.value as UserRole }))
                }
                className="input-field"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Status</span>
              <select
                value={createForm.status}
                onChange={(e) =>
                  setCreateForm((c) => ({ ...c, status: e.target.value as UserStatus }))
                }
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </label>
            {error && showCreate ? (
              <p className="sm:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <button type="submit" disabled={isSaving} className="btn-primary px-5 py-3 text-sm disabled:opacity-60">
                {isSaving ? "Creating..." : "Create user"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {selectedUser && form ? (
        <section className="panel rounded-[2rem] p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted">Edit user</p>
              <h2 className="text-2xl font-semibold">
                {selectedUser.first_name} {selectedUser.last_name}
              </h2>
            </div>
            <button type="button" onClick={closeEditor} className="btn-secondary px-4 py-2 text-sm">
              Close
            </button>
          </div>

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">First name</span>
              <input
                required
                value={form.first_name}
                onChange={(e) => setForm((c) => (c ? { ...c, first_name: e.target.value } : c))}
                className="input-field"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Last name</span>
              <input
                required
                value={form.last_name}
                onChange={(e) => setForm((c) => (c ? { ...c, last_name: e.target.value } : c))}
                className="input-field"
              />
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="text-sm font-medium">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((c) => (c ? { ...c, email: e.target.value } : c))}
                className="input-field"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Role</span>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((c) => (c ? { ...c, role: e.target.value as UserRole } : c))
                }
                className="input-field"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Status</span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((c) => (c ? { ...c, status: e.target.value as UserStatus } : c))
                }
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </label>
            <label className="block space-y-2 sm:col-span-2">
              <span className="text-sm font-medium">New password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((c) => (c ? { ...c, password: e.target.value } : c))}
                placeholder="Leave blank to keep current password"
                className="input-field"
              />
            </label>
            {error ? (
              <p className="sm:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <button type="submit" disabled={isSaving} className="btn-primary px-5 py-3 text-sm disabled:opacity-60">
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
