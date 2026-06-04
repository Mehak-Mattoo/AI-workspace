import { z } from "zod";

export const noteSummarySchema = z.object({
  summary: z.string().describe("One-sentence overview of the note"),
  bulletPoints: z
    .array(z.string())
    // .min(3)
    // .max(3)
    .describe("Exactly 3 concise bullet points"),
});

export type NoteSummary = z.infer<typeof noteSummarySchema>;
