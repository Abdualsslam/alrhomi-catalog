// src/theme.ts
import { createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { ThemeMode } from "./types/context.types";

// Module augmentation for custom theme properties
declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      borderRadius: {
        small: number;
        medium: number;
        large: number;
      };
      spacing: {
        section: number;
        card: number;
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      borderRadius?: {
        small?: number;
        medium?: number;
        large?: number;
      };
      spacing?: {
        section?: number;
        card?: number;
      };
    };
  }
}

/**
 * Creates a Material-UI theme based on the specified mode (light/dark)
 * @param mode - The theme mode ('light' or 'dark')
 * @returns A configured Material-UI Theme object
 */
export function getTheme(mode: ThemeMode): Theme {
  const themeOptions: ThemeOptions = {
    direction: "rtl",
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#5c6bc0" : "#1a237e",
        light: mode === "dark" ? "#8e99f3" : "#534bae",
        dark: mode === "dark" ? "#26418f" : "#000051",
        contrastText: "#ffffff",
      },
      secondary: {
        main: mode === "dark" ? "#29b6f6" : "#0277bd",
        light: mode === "dark" ? "#4fc3f7" : "#0288d1",
        dark: mode === "dark" ? "#0288d1" : "#01579b",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f9fafb",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : "#212121",
        secondary: mode === "dark" ? "#b0b0b0" : "#757575",
      },
      divider:
        mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    },
    typography: {
      fontFamily: "'Cairo', 'Segoe UI', 'Tahoma', 'Arial', sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            // Add spacing between icons and text in buttons
            "& .MuiButton-startIcon": {
              marginLeft: 8,
              marginRight: -4,
            },
            "& .MuiButton-endIcon": {
              marginRight: 8,
              marginLeft: -4,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            // Add spacing for icons inside IconButton when text is present
            "& .MuiSvgIcon-root": {
              margin: "0 2px",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
            color: mode === "dark" ? "#ffffff" : "#333",
            backgroundImage: "none",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#1e1e1e" : "#ffffff",
            backgroundImage: "none",
          },
        },
      },
    },
    custom: {
      borderRadius: {
        small: 4,
        medium: 8,
        large: 16,
      },
      spacing: {
        section: 64,
        card: 16,
      },
    },
  };

  return createTheme(themeOptions);
}
