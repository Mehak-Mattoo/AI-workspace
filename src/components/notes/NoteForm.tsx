"use client";

import { useEffect, useState } from "react";
import { Note } from "@/hooks/useNotes";

interface NoteFormProps {
  note?: Note | null;
  onSubmit: (note: { title: string; content: string }) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

export function NoteForm({
  note,
  onSubmit,
  onDelete,
  onCancel,
  isSaving = false,
}: NoteFormProps) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
  }, [note]);

  return (
    <form
      className="space-y-4 rounded-3xl border border-border bg-background p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ title: title.trim(), content: content.trim() });
      }}
    >
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          Title
        </label>
        <input
          className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter note title"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          Content
        </label>
        <textarea
          className="min-h-[160px] w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your note here"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving || title.trim().length === 0}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {note ? "Save note" : "Create note"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-border px-5 py-2 text-sm text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>
        )}

        {note && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-full border border-destructive px-5 py-2 text-sm text-destructive transition hover:bg-destructive/10"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
