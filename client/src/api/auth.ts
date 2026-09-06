import type { Profile } from "@/types";
import { api } from "./client";

export interface Credentials {
  email: string;
  password: string;
}

export interface Registration extends Credentials {
  confirmPassword: string;
}

export const authApi = {
  register: (input: Registration) => api.post<{ user: Profile }>("/auth/register", input).then((r) => r.user),
  login: (input: Credentials) => api.post<{ user: Profile }>("/auth/login", input).then((r) => r.user),
  logout: () => api.post<{ ok: true }>("/auth/logout"),
  /** Always resolves; `null` means "signed out". */
  me: () => api.get<{ user: Profile | null }>("/auth/me").then((r) => r.user),
};
