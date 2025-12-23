import { UserRole } from "./models.types";

// Auth Context Types
export interface AuthContextValue {
  accessToken: string | null;
  role: UserRole | null;
  username: string | null;
  setAccessToken: (token: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setUsername: (username: string | null) => void;
}

// Theme Context Types
export type ThemeMode = "light" | "dark";

export interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}
