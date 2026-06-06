import { AVATARS_BUCKET } from "@/lib/constants/constants";
import type { User } from "@supabase/supabase-js";

type Claims = Record<string, unknown>;

export function getProfileFromUser(user: User | null | undefined) {
  if (!user) {
    return { name: "", email: "", avatar: "" };
  }

  const meta = user.user_metadata ?? {};

  return {
    name: (meta.full_name as string) ?? (meta.name as string) ?? "",
    email: user.email ?? "",
    avatar: (meta.avatar_url as string) ?? "",
  };
}

export function getProfileFromClaims(claims: Claims | null | undefined) {
  if (!claims) {
    return { name: "", email: "", avatar: "" };
  }

  const meta = (claims.user_metadata as Claims | undefined) ?? {};

  return {
    name:
      (claims.name as string) ??
      (claims.full_name as string) ??
      (meta.full_name as string) ??
      (meta.name as string) ??
      (claims.email as string) ??
      "",
    email: (claims.email as string) ?? "",
    avatar:
      (claims.avatar_url as string) ??
      (claims.picture as string) ??
      (meta.avatar_url as string) ??
      "",
  };
}

export async function uploadAvatar(
  supabase: ReturnType<typeof import("@/lib/client").createClient>,
  userId: string,
  file: File,
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    throw new Error(
      `Avatar upload failed: ${error.message}. Create a public "${AVATARS_BUCKET}" bucket in Supabase Storage with upload policies for authenticated users.`,
    );
  }

  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}
