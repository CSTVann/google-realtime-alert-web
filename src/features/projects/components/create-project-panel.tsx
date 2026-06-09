"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createProject } from "@/lib/api";

export function CreateProjectPanel() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const project = await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        telegram_chat_id: telegramChatId.trim(),
        telegram_bot_token: telegramBotToken.trim(),
      });
      router.push(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel mx-auto max-w-2xl rounded-[2rem] p-8">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-muted">New project</p>
      <h1 className="mt-2 text-3xl font-semibold">Connect Telegram &amp; start tracking</h1>
      <p className="mt-2 text-sm text-muted">
        Add your project details and Telegram bot. We will send &quot;Successfully Connecting&quot;
        to your group when linked.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Project name *</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-24 resize-y"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Telegram group ID *</span>
          <input
            required
            value={telegramChatId}
            onChange={(e) => setTelegramChatId(e.target.value)}
            placeholder="-1001234567890"
            className="input-field"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Telegram bot token *</span>
          <input
            required
            value={telegramBotToken}
            onChange={(e) => setTelegramBotToken(e.target.value)}
            placeholder="123456:ABC-DEF..."
            className="input-field"
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full px-5 py-3 text-sm disabled:opacity-60">
          {isSubmitting ? "Creating..." : "Create project & connect Telegram"}
        </button>
      </form>
    </section>
  );
}
