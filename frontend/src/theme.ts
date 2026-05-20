import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { ThemeMode } from "./types/context.types";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      borderRadius: { small: number; medium: number; large: number };
    };
  }
  interface ThemeOptions {
    custom?: {
      borderRadius?: { small?: number; medium?: number; large?: number };
    };
  }
}

export function getTheme(mode: ThemeMode): Theme {
  const isDark = mode === "dark";
  
  const themeOptions: ThemeOptions = {
    direction: "rtl",
    palette: {
      mode: "dark", // We force dark mode feel for the "insane" UI
      primary: {
        main: "#3b82f6",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#06b6d4",
      },
      background: {
        default: "#050507",
        paper: "#0d0d12",
      },
      text: {
        primary: "#ffffff",
        secondary: "rgba(255, 255, 255, 0.7)",
      },
      divider: "rgba(255, 255, 255, 0.1)",
    },
    typography: {
      fontFamily: "'Outfit', 'Noto Sans Arabic', sans-serif",
      h1: { fontWeight: 800, letterSpacing: "-0.02em" },
      h2: { fontWeight: 800, letterSpacing: "-0.02em" },
      h3: { fontWeight: 700, letterSpacing: "-0.01em" },
      h4: { fontWeight: 700, letterSpacing: "-0.01em" },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      body1: { lineHeight: 1.8 },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            textTransform: "none",
            fontWeight: 600,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          containedPrimary: {
            background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.5)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 24,
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            background: "#0d0d12",
          },
        },
      },
    },
    custom: {
      borderRadius: {
        small: 8,
        medium: 16,
        large: 32,
      },
    },
  };

  return createTheme(themeOptions);
}
