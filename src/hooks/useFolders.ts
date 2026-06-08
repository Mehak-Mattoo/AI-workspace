import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TABLE_KEYS } from "@/lib/constants/constants";

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string | null;
}

export const fetchFolders = async (): Promise<Folder[]> => {
  const { data, error } = await supabase
    .from(TABLE_KEYS.FOLDERS)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data ?? [];
};

export function useFolders() {
  return useQuery<Folder[]>({
    queryKey: [TABLE_KEYS.FOLDERS],
    queryFn: fetchFolders,
  });
}

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newFolder: { name: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from(TABLE_KEYS.FOLDERS)
        .insert([
          {
            name: newFolder.name.trim(),
            user_id: user.id,
          },
        ])
        .select();
      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE_KEYS.FOLDERS] });
    },
  });
};

export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data, error } = await supabase
        .from(TABLE_KEYS.FOLDERS)
        .update({
          name: name.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE_KEYS.FOLDERS] });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from(TABLE_KEYS.FOLDERS)
        .delete()
        .eq("id", id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TABLE_KEYS.FOLDERS] });
      queryClient.invalidateQueries({ queryKey: [TABLE_KEYS.NOTES] });
    },
  });
};
