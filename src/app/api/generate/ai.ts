import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { noteSummarySchema } from "@/lib/schema/noteSummary";
import { aiRateLimit } from "@/lib/rateLimit/rateLimit";
import { createClient } from "@/lib/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success, limit, remaining, reset } = await aiRateLimit.limit(
    user.id, // per logged-in user
  );

  if (!success) {
    return Response.json(
      {
        error: "Rate limit exceeded. Try again later.",
        limit,
        remaining,
        reset,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      },
    );
  }

  const { prompt } = await req.json();
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: noteSummarySchema,
      prompt,
    });

    return Response.json(object);
  } catch (err) {
    console.error("generateObject failed:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 },
    );
  }
}
