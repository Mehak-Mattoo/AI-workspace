import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string | null;
}

const TABLE_KEYS = {
  NOTES: "notes",
};

const fetchNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from(TABLE_KEYS.NOTES)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
};

export function useNotes() {
  return useQuery<Note[]>({
    queryKey: [TABLE_KEYS.NOTES],
    queryFn: fetchNotes,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNote: { title: string; content: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from(TABLE_KEYS.NOTES)
        .insert([
          {
            ...newNote,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE_KEYS.NOTES] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Note) => {
      const { data, error } = await supabase
        .from(TABLE_KEYS.NOTES)
        .update({ title: note.title, content: note.content })
        .eq("id", note.id)
        .select();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE_KEYS.NOTES] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from(TABLE_KEYS.NOTES)
        .delete()
        .eq("id", id)
        .select("id");

      console.log("deleted rows", data);

      if (error) {
        throw new Error("Delete blocked — 0 rows removed (check RLS or id)");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE_KEYS.NOTES] });
    },
  });
}
