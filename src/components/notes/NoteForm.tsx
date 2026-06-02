"use client";

import { useEffect, useState } from "react";
import { Note } from "@/hooks/useNotes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Textarea } from "../ui/textarea";

interface NoteFormProps {
  openDialog: boolean;
  note?: Note | null;
  onSubmit: (note: { title: string; content: string }) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

export function NoteForm({
  openDialog,
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
    <>
      <Dialog open={openDialog} onOpenChange={(open) => {
        if (!open) {
          onCancel?.();
        }
      }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ title: title.trim(), content: content.trim() });
            
            setTitle("");
            setContent("");
          }}
        >
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="" >
            <DialogHeader>
              <DialogTitle>{note ? "Edit note" : "Add a new note"}</DialogTitle>
              <DialogDescription>
                {note ? "" : "Add a new note to your collection."}
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Title</Label>
                <Input id="name-1" name="name" defaultValue={title} />
              </Field>
              <Field>
                <Label htmlFor="username-1">Content</Label>
                <Textarea id="username-1" name="username" defaultValue={content} rows={10} />
              </Field>
            </FieldGroup>

            <DialogFooter>
             
              <Button
                type="submit"
                disabled={isSaving}
                onClick={() =>
                  onSubmit({ title: title.trim(), content: content.trim() })
                }
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
