export const TABLE_KEYS = {
  NOTES: "notes",
  FOLDERS: "folders",
};

export const LUNA = "Luna";

export const BUCKET = "note-attachments";
export const AVATARS_BUCKET = "avatars";
export const MODEL_NAME = "gemini-2.5-flash";

export const getInitials = (name: string): string => {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
