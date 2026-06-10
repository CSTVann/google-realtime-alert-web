"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/features/ui/page-header";
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
    <section className="panel mx-auto max-w-2xl p-6 sm:p-8">
      <PageHeader
        label="New project"
        title="Connect Telegram"
        description='We will send "Successfully Connecting" to your group when linked.'
      />

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Project name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-24 resize-y"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Telegram group ID</span>
          <input
            required
            value={telegramChatId}
            onChange={(e) => setTelegramChatId(e.target.value)}
            placeholder="-1001234567890"
            className="input-field"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Telegram bot token</span>
          <input
            required
            value={telegramBotToken}
            onChange={(e) => setTelegramBotToken(e.target.value)}
            placeholder="123456:ABC-DEF..."
            className="input-field"
          />
        </label>

        {error ? <p className="alert alert-error">{error}</p> : null}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full px-4 py-2.5">
          {isSubmitting ? "Creating..." : "Create project"}
        </button>
      </form>
    </section>
  );
}
