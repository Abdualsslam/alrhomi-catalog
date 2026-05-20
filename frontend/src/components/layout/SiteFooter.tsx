import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { FC, ReactElement } from "react";
import { getWhatsAppUrl } from "../../utils/whatsapp";

const SiteFooter: FC = (): ReactElement => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 12, 
        pt: 12, 
        pb: 4, 
        background: "rgba(0,0,0,0.3)", 
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }} className="text-gradient">
              ALRHOMI
            </Typography>
            <Typography sx={{ color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 400 }}>
              رائدون في تجهيز أرقى المطاعم والمطابخ الفندقية منذ عام 1955. نقدم حلولاً متكاملة تدمج بين الجودة العالية والابتكار التقني.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: "white" }}>
              روابط سريعة
            </Typography>
            <Stack spacing={2}>
              {["الرئيسية", "الكتالوج", "الفئات"].map((label, idx) => (
                <MuiLink
                  key={idx}
                  component={NavLink}
                  to={label === "الرئيسية" ? "/" : label === "الكتالوج" ? "/catalog" : "/categories"}
                  sx={{ 
                    color: "var(--text-secondary)", 
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                    "&:hover": { color: "var(--accent-primary)" }
                  }}
                >
                  {label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: "white" }}>
              معلومات الاتصال
            </Typography>
            <Stack spacing={2}>
              <Typography sx={{ color: "var(--text-secondary)" }}>
                جدة، حي الهنداوية - شارع شجرة الزيتون
              </Typography>
              <Typography sx={{ color: "var(--text-secondary)" }}>
                الهاتف: 012 647 7825
              </Typography>
              <MuiLink
                href={getWhatsAppUrl()}
                target="_blank"
                sx={{ 
                  color: "var(--accent-secondary)", 
                  textDecoration: "none",
                  fontWeight: 600
                }}
              >
                تواصل عبر واتساب مباشر
              </MuiLink>
            </Stack>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 8, borderColor: "rgba(255,255,255,0.05)" }} />
        
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "var(--text-secondary)", opacity: 0.5 }}
        >
          © {new Date().getFullYear()} شركة الرحومي المحدودة. صُمم بشغف للتميز.
        </Typography>
      </Container>
    </Box>
  );
};

export default SiteFooter;
