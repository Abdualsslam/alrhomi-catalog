import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { WhatsApp } from "@mui/icons-material";
import { FC, ReactElement } from "react";
import { getWhatsAppUrl } from "../../utils/whatsapp";

interface NavLinkItem {
  label: string;
  path: string;
}

const navLinks: NavLinkItem[] = [
  { label: "الرئيسية", path: "/" },
  { label: "المنتجات", path: "/catalog" },
  { label: "الفئات", path: "/categories" },
];

const SiteHeader: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 1100, p: { xs: 1, md: 2 } }}>
      <AppBar
        position="static"
        className="glass"
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: { xs: "16px", md: "24px" },
          color: "white",
        }}
      >
        <Toolbar
          component={Container}
          maxWidth="lg"
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            py: 1
          }}
        >
          {/* Logo Section */}
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            <Box
              component="img"
              src="/logo.webp"
              alt="Alrhomi Logo"
              sx={{ width: 45, height: 45, filter: "brightness(0) invert(1)" }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, display: { xs: "none", sm: "block" } }}>
              ALRHOMI
            </Typography>
          </Stack>

          {/* Navigation Links */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={NavLink}
                to={link.path}
                sx={{
                  color: "var(--text-secondary)",
                  borderRadius: "12px",
                  px: 2,
                  fontWeight: 500,
                  transition: "all 0.3s ease",
                  "&:hover": { color: "white", background: "rgba(255,255,255,0.05)" },
                  "&.active": {
                    color: "white",
                    background: "rgba(255, 255, 255, 0.1)",
                    fontWeight: 700,
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              className="btn-premium"
              size="small"
              onClick={() => navigate("/catalog")}
              sx={{ display: { xs: "none", sm: "inline-flex" }, px: 3 }}
            >
              اكتشف الآن
            </Button>
            
            <IconButton
              onClick={() => window.open(getWhatsAppUrl(), "_blank")}
              sx={{
                background: "rgba(37, 211, 102, 0.15)",
                color: "#25D366",
                "&:hover": { background: "rgba(37, 211, 102, 0.25)" }
              }}
            >
              <WhatsApp />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default SiteHeader;
