import { create } from "zustand";
import { api } from "@/shared/api/api";
import type { Role, User } from "../types/auth.types";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  checkAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "checking",

  checkAuth: async () => {
    try {
      const { data } = await api.get<User>("/auth/me");
      const normalizedUser: User = {
        ...data,
        roles: data.roles ?? (data.role ? [data.role] : []),
        role: data.role ?? ((data.roles && data.roles.includes("admin")) ? "admin" : "user"),
      };
      set({ user: normalizedUser, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  login: async (username: string, password: string) => {
    await api.post("/auth/token", new URLSearchParams({ username, password }));
    await get().checkAuth();
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, status: "unauthenticated" });
    }
  },

  hasRole: (...roles: Role[]) => {
    const user = get().user;
    if (!user) return false;
    const userRoles: string[] = user.roles ?? (user.role ? [user.role] : []);
    return roles.some((r) => userRoles.includes(r));
  },
}));

export const useEsAdmin = () => useAuthStore((s) => s.hasRole("admin"));
