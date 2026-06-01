"use client";

import { useMemo } from "react";
import { NoteForm } from "@/components/notes/NoteForm";
import {
  useCreateNote,
  useDeleteNote,
  useNotes,
  useUpdateNote,
  type Note,
} from "@/hooks/useNotes";
import { useNoteStore } from "@/lib/store";

export function NotesApp() {
  const { data: notes = [], isLoading, isError, error } = useNotes();
  const { selectedNoteId, setSelectedNoteId } = useNoteStore();

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  );

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

//   const isSaving =
//     createNote.isMutating || updateNote.isMutating || deleteNote.isMutating;

  function handleSubmit(payload: { title: string; content: string }) {
    if (selectedNote) {
      updateNote.mutate({ ...selectedNote, ...payload });
    } else {
      createNote.mutate(payload);
    }

    setSelectedNoteId(null);
  }

  function handleDelete() {
    if (!selectedNote) {
      return;
    }

    deleteNote.mutate(selectedNote.id, {
      onSuccess() {
        setSelectedNoteId(null);
      },
    });
  }

  function handleCreateClick() {
    setSelectedNoteId(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Note app
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Your notes
          </h1>
          <p className="max-w-2xl pt-2 text-sm text-muted-foreground">
            Create, update, and delete personal notes with Supabase and TanStack
            Query.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          New note
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-3xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Notes</h2>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {notes.length}
            </span>
          </div>

          {isLoading ? (
            <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
              Loading notes…
            </div>
          ) : isError ? (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
              Failed to load notes. {`${error}`}
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
              No notes yet. Create one to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`w-full rounded-3xl border px-4 py-3 text-left transition duration-150 ${
                    note.id === selectedNoteId
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/70 hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">
                      {note.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {note.content}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-border bg-background p-4 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {selectedNote ? "Edit note" : "Create note"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedNote
                  ? "Update or delete the selected note."
                  : "Start with a title and some content."}
              </p>
            </div>
          </div>

          <NoteForm
            key={selectedNote?.id ?? "new"}
            note={selectedNote}
            // isSaving={isSaving}
            onSubmit={handleSubmit}
            onDelete={selectedNote ? handleDelete : undefined}
            onCancel={selectedNote ? () => setSelectedNoteId(null) : undefined}
          />
        </section>
      </div>
    </div>
  );
}
