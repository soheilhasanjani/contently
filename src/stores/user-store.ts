import { postAuthLogout } from "@/api/generated/endpoints/auth/auth";
import type { MeData } from "@/api/generated/models";
import { clearAccessToken } from "@/lib/auth/cookie";
import type { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";

type UserState = {
  user: MeData | null;
  setUser: (user: MeData | null) => void;
  clearUser: () => void;
  /** `POST /auth/logout`, then clear cookie / user / query cache (even if API fails). */
  logout: (queryClient: QueryClient) => Promise<void>;
};

/** Panel current user from `GET /auth/me` — not theme, not arbitrary API lists. */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  logout: async (queryClient) => {
    try {
      await postAuthLogout();
    } catch {
      // Ignore — local session must still be cleared.
    }

    clearAccessToken();
    set({ user: null });
    await queryClient.clear();
  },
}));
