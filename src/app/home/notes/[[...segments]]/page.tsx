"use client";

import { useParams } from "next/navigation";
import { NoteDetailPage } from "@/components/helpers/NoteDetailPage";

export default function Page() {
  const params = useParams();
  const segments = params.segments as string[] | undefined;

  if (!segments?.length) {
    return null;
  }

  if (segments.length === 1) {
    return <NoteDetailPage noteId={segments[0]} />;
  }

  const [folderId, noteId] = segments;
  return <NoteDetailPage noteId={noteId} folderId={folderId} />;
}
