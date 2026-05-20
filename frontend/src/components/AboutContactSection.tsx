import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import {
  PhoneOutlined,
  EmailOutlined,
  LocationOnOutlined,
  WhatsApp,
  BusinessOutlined,
} from "@mui/icons-material";
import { FC, ReactElement } from "react";
import { getWhatsAppUrl } from "../utils/whatsapp";

const AboutContactSection: FC = (): ReactElement => {
  return (
    <Box sx={{ py: { xs: 10, md: 15 }, position: "relative" }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          {/* About Text */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="overline" sx={{ color: "var(--accent-primary)", fontWeight: 800, letterSpacing: 2 }}>
                  تاريخنا العريق
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 800, mt: 1, mb: 3 }}>
                  أكثر من <span className="text-gradient">65 عاماً</span> من التميز
                </Typography>
                <Typography variant="body1" sx={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1.1rem" }}>
                  بدأت حكايتنا في عام 1955، ومنذ ذلك الحين ونحن نضع معايير الجودة في تجهيز المطاعم والمطابخ المركزية. نحن لا نبيع المعدات فحسب، بل نبني شراكات نجاح تدوم لأجيال.
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 6 }}>
                  <Box className="glass" sx={{ p: 3, textAlign: "center" }}>
                    <BusinessOutlined sx={{ fontSize: 40, color: "var(--accent-secondary)", mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>+5000</Typography>
                    <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>مشروع منفذ</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box className="glass" sx={{ p: 3, textAlign: "center" }}>
                    <BusinessOutlined sx={{ fontSize: 40, color: "var(--accent-primary)", mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>1955</Typography>
                    <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>عام التأسيس</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          {/* Contact Cards */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="glass" sx={{ p: { xs: 4, md: 6 } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>تواصل <span style={{ color: "var(--accent-secondary)" }}>معنا</span></Typography>
              
              <Stack spacing={4}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ p: 2, borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-primary)" }}>
                    <LocationOnOutlined />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block" }}>المقر الرئيسي</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>جدة، حي الهنداوية - مركز بن شيهون</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ p: 2, borderRadius: "12px", background: "rgba(34, 211, 238, 0.1)", color: "var(--accent-secondary)" }}>
                    <PhoneOutlined />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block" }}>اتصل بنا</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>012 647 7825</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ p: 2, borderRadius: "12px", background: "rgba(255, 255, 255, 0.05)", color: "white" }}>
                    <EmailOutlined />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block" }}>البريد الإلكتروني</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>almarhomi@almrhomi1955.com</Typography>
                  </Box>
                </Stack>
                
                <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
                
                <Button
                  className="btn-premium"
                  fullWidth
                  size="large"
                  startIcon={<WhatsApp />}
                  onClick={() => window.open(getWhatsAppUrl(), "_blank")}
                  sx={{ py: 2 }}
                >
                  تواصل عبر واتساب مباشر
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutContactSection;
