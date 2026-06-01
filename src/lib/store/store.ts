import { create } from "zustand";

interface NoteStore {
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  selectedNoteId: null,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
}));
