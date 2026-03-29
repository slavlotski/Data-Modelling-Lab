import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  notation: "crowsfoot" | "chen";
  editorFontSize: number;
  setNotation: (notation: "crowsfoot" | "chen") => void;
  setEditorFontSize: (size: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notation: "crowsfoot",
      editorFontSize: 14,
      setNotation: (notation) => set({ notation }),
      setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
    }),
    { name: "dml-settings" }
  )
);
