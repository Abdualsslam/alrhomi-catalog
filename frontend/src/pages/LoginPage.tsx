// src/pages/LoginPage.tsx
import { useState, FormEvent } from "react";
import { useThemeMode } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Fade,
  CircularProgress,
  useTheme,
  alpha,
  Card,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  ArrowBack,
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api/client";
import { UserRole } from "../types/models.types";

export default function LoginPage() {
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // استخدام setAccessToken بدل setToken
  const { setAccessToken, setRole, setUsername } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API.post already returns response.data, so no destructuring needed
      const data = await API.post<{ token: string; role: UserRole }>("/auth/login", { username, password });

      // تخزين التوكن والدور واسم المستخدم باستخدام المفاتيح الموحدة
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username);
      setAccessToken(data.token);
      setRole(data.role);
      setUsername(username);

      // التنقل بناءً على الدور
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/catalog");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
      className={mode === 'dark' ? 'mesh-gradient' : 'mesh-gradient-light'}
    >
      {/* Floating Orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
          filter: "blur(80px)",
          zIndex: 0,
        }}
      />

      <IconButton
        onClick={toggleTheme}
        className="glass"
        sx={{
          position: "fixed",
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          color: "white",
          zIndex: 1000,
        }}
      >
        {mode === "dark" ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        <Card
          elevation={0}
          className={mode === 'dark' ? 'glass' : 'glass-light'}
          sx={{
            borderRadius: 6,
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 40px 80px ${alpha("#000", 0.2)}`,
          }}
        >
          <Box
            sx={{
              height: 8,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />

          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: theme.palette.primary.main,
                  borderRadius: "50%",
                  p: { xs: 1.5, sm: 2 },
                  mb: 2,
                }}
              >
                <Lock sx={{ fontSize: { xs: 32, sm: 40 }, color: "#fff" }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                }}
              >
                {t('login.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('login.subtitle')}
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={t('login.username')}
                margin="normal"
                value={username}
                onChange={(e) => setUsernameInput(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                  },
                }}
              />

              <TextField
                fullWidth
                label={t('login.password')}
                type={showPassword ? "text" : "password"}
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                  },
                }}
              />

              <Box sx={{ mt: 1, mb: 2 }}></Box>

              {error && (
                <Fade in={error !== ""}>
                  <Box
                    sx={{
                      bgcolor: theme.palette.error.light,
                      color: theme.palette.error.dark,
                      p: 1.5,
                      borderRadius: 2,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2">{error}</Typography>
                  </Box>
                </Fade>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                className="hover-lift"
                sx={{
                  mt: 4,
                  py: 1.8,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('login.button')
                )}
              </Button>

            </form>
          </Box>
        </Card>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{
              color: mode === "dark" ? "white" : "primary.main",
              fontWeight: 600,
            }}
          >
            {t('login.back_home')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
