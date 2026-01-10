import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
    isAdminMode: boolean;
    toggleAdminMode: () => void;
}

export const useAdminStore = create<AdminStore>()(
    persist(
        (set) => ({
            isAdminMode: false,
            toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),
        }),
        {
            name: 'admin-mode-storage',
        }
    )
);
