import { useMutation } from "@tanstack/react-query";
import type { Note } from "@/hooks/useNotes";
import { apiRoutes } from "@/app/routes";
import { noteSummarySchema } from "@/lib/schema/noteSummary";

export type NoteSummary = {
  summary: string;
  bulletPoints: string[];
};

async function summarizeNote(note: Note): Promise<NoteSummary> {
  const res = await fetch(apiRoutes.GENERATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `Summarize this note in 3 concise bullet points.

    Title: ${note.title}
    Content: ${note.content}`,
    }),
  });
    
    if (res.status === 429) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err.error ?? "Too many requests. Please wait and try again.",
      );
    }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "AI request failed");
  }

  const data = await res.json();

  return noteSummarySchema.parse(data);
}

export function useSummarizeNote() {
  return useMutation({
    mutationKey: ["summarize-note"],
    mutationFn: summarizeNote,
  });
}


