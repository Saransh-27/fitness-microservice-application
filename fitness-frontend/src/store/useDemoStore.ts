import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DemoState {
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      enterDemoMode: () => set({ isDemoMode: true }),
      exitDemoMode: () => set({ isDemoMode: false }),
    }),
    {
      name: "fitness-demo-mode",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
