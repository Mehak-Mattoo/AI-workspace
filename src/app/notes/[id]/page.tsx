"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useNotes, useUpdateNote, useDeleteNote } from "@/hooks/useNotes";
import { protectedRoutes } from "@/app/routes";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { NoteForm } from "@/components/notes/NoteForm";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { data: notes = [], isLoading, isError } = useNotes();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const note = notes?.find((n) => String(n.id) === noteId);

  const handleUpdateNote = (payload: { title: string; content: string }) => {
    if (!note) return;
    updateNote.mutate(
      {
        ...note,
        title: payload.title,
        content: payload.content,
      },
      {
        onSuccess: () => setOpenEditDialog(false),
      },
    );
  };

  if (isError) {
    return (
      <div>
        <p>Failed to load notes.</p>
        <Link href={protectedRoutes.HOME}>Back</Link>
      </div>
    );
  }

  if (!note) {
    return (
      <div>
        <p>Note not found.</p>
        <Link href={protectedRoutes.HOME}>Back</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link
        href={protectedRoutes.HOME}
        className="text-sm text-muted-foreground"
      >
        Back
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="mt-4 text-3xl font-semibold">{note.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(note.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
            <Edit />
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Trash className="text-red-300" />
          </Button>
        </div>
      </div>

      <p className="mt-6 whitespace-pre-wrap">{note.content}</p>

      {openDeleteDialog && (
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Delete this note?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The note will be permanently
                deleted.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button
                variant="destructive"
                disabled={deleteNote.isPending}
                onClick={() => {
                  deleteNote.mutate(String(note.id), {
                    onSuccess: () => {
                      setOpenDeleteDialog(false);
                      router.push(protectedRoutes.HOME);
                    },
                  });
                }}
              >
                {deleteNote.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <NoteForm
        key={String(note.id)}
        openDialog={openEditDialog}
        note={note}
        isSaving={updateNote.isPending}
        onSubmit={handleUpdateNote}
        onCancel={() => setOpenEditDialog(false)}
      />
    </div>
  );
}
