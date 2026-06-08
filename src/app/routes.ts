export const authRoutes = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  UPDATE_PASSWORD: "/auth/update-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  SIGNUP_SUCCESS: "/auth/signup/success",
  AUTH_ERROR: "/auth/error",
};

export const protectedRoutes = {
  HOME: "/home",
  MY_NOTES: "/home/mynotes",
  NOTE: "/home/notes",
  PROFILE: "/home/profile",
  SETTINGS: "/settings",
};

export const apiRoutes = {
  GENERATE: "/api/generate",
  CHAT: "/api/chat",
};

export function notePath(note: {
  id: string | number;
  folder_id?: string | null;
}) {
  const id = String(note.id);
  if (note.folder_id) {
    return `${protectedRoutes.NOTE}/${note.folder_id}/${id}`;
  }
  return `${protectedRoutes.NOTE}/${id}`;
}

export function myNotesPath(folderId?: string | null) {
  if (folderId) {
    return `${protectedRoutes.MY_NOTES}?folder=${folderId}`;
  }
  return protectedRoutes.MY_NOTES;
}
