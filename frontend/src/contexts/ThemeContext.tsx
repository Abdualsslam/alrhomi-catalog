// src/contexts/ThemeContext.tsx
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useContext,
  ReactElement,
} from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Theme } from "@mui/material/styles";
import { ThemeContextValue, ThemeMode } from "../types/context.types";
import { getTheme } from "../theme";

// Create context with undefined as initial value to enforce proper usage
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
  // Read mode from localStorage or use default with explicit type
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode as ThemeMode) || "light";
  });

  // Create theme based on mode with explicit Theme type
  const theme: Theme = useMemo(() => getTheme(mode), [mode]);

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = (): void => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Ensure HTML direction is set to RTL
  useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
    document.body.setAttribute("dir", "rtl");
  }, []);

  const value: ThemeContextValue = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook with proper type checking and undefined handling
export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeContext };
