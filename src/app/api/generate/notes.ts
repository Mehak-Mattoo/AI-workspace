import { Note } from "@/hooks/useNotes";
import { apiRoutes } from "@/components/helpers/routes";

export async function handleSummarizeNote(note: Note) {
  const res = await fetch(apiRoutes.GENERATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: ` Summarize the following note in 3 concise bullet points: ${note.content}. Return the summary as a JSON object with the following structure: { summary: string, bulletPoints: string[] }`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "AI request failed");
  }

  const { summary, bulletPoints } = await res.json();
  console.log(summary, bulletPoints);
}
