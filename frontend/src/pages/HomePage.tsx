import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  alpha,
  Card,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, FC, ReactElement } from "react";
import {
  ArrowForwardOutlined,
  WhatsApp,
  VerifiedOutlined,
  SupportAgentOutlined,
  EmojiEventsOutlined,
  AutoAwesomeOutlined,
  LocalShippingOutlined,
  ShieldOutlined,
} from "@mui/icons-material";
import { fetchCategories } from "../api/admin";
import { searchProducts } from "../api/products";
import CategoryShowcase from "../components/CategoryShowcase";
import ImageGrid from "../components/ImageGrid";
import AboutContactSection from "../components/AboutContactSection";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";
import PageTransition from "../components/PageTransition";
import { getWhatsAppUrl } from "../utils/whatsapp";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  injectMultipleSchemas,
} from "../utils/structuredData";

interface Category {
  _id: string;
  name: string;
  [key: string]: any;
}

interface Product {
  _id: string;
  [key: string]: any;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  delay: number;
}

const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  title,
  subtitle,
  color,
  delay,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      className="hover-lift"
      sx={{
        p: 4,
        borderRadius: 5,
        bgcolor: theme.palette.mode === 'dark' ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"}`,
        animation: "fadeInUp 0.6s ease-out forwards",
        animationDelay: `${delay}ms`,
        opacity: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: color,
          opacity: 0.5,
        },
        "&:hover": {
          boxShadow: `0 20px 40px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.3),
        },
      }}
    >
      <Box
        className="feature-icon"
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(color, 0.1),
          color: color,
          transition: "all 0.3s ease",
          "& svg": { fontSize: 32 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {subtitle}
      </Typography>
    </Card>
  );
};

const HomePage: FC = (): ReactElement => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  useEffect(() => {
    // إضافة البيانات المنظمة للصفحة الرئيسية
    injectMultipleSchemas([getOrganizationSchema(), getWebSiteSchema()]);

    // جلب الفئات
    (async () => {
      try {
        const res = await fetchCategories({ page: 1, limit: 6 });
        setCategories(res.items);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoadingCategories(false);
      }
    })();

    // جلب المنتجات
    (async () => {
      try {
        const res = await searchProducts({ page: 1, limit: 6 });
        setProducts(res.data.items);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  const { t } = useTranslation();

  const features = [
    {
      icon: <EmojiEventsOutlined />,
      title: t("home.features.experience_title"),
      subtitle: t("home.features.experience_desc"),
      color: theme.palette.warning.main,
    },
    {
      icon: <VerifiedOutlined />,
      title: t("home.features.quality_title"),
      subtitle: t("home.features.quality_desc"),
      color: theme.palette.success.main,
    },
    {
      icon: <SupportAgentOutlined />,
      title: t("home.features.support_title"),
      subtitle: t("home.features.support_desc"),
      color: theme.palette.info.main,
    },
    {
      icon: <LocalShippingOutlined />,
      title: t("home.features.shipping_title"),
      subtitle: t("home.features.shipping_desc"),
      color: theme.palette.secondary.main,
    },
  ];

  return (
    <PageTransition>
      <SEO
        title="كتالوج الرحومي - صور منتجات عالية الجودة"
        description="استكشف مجموعة واسعة من صور المنتجات عالية الجودة في كتالوج الرحومي. صور احترافية لجميع أنواع المنتجات مع إمكانية التحميل المباشر."
        keywords="كتالوج منتجات, صور منتجات, كتالوج الرحومي, صور احترافية, منتجات يمنية, كتالوج إلكتروني"
        type="website"
      />
      <Box sx={{ bgcolor: "background.default", position: "relative" }}>
        {/* Hero Section */}
        <Box
          className={theme.palette.mode === 'dark' ? 'mesh-gradient' : 'mesh-gradient-light'}
          sx={{
            position: "relative",
            overflow: "hidden",
            pt: { xs: 12, md: 20 },
            pb: { xs: 8, md: 15 },
            minHeight: { md: "90vh" },
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Floating Decorative Elements */}
          <Box
            className="animate-float-slow"
            sx={{
              position: "absolute",
              top: "15%",
              right: "10%",
              width: { xs: 200, md: 400 },
              height: { xs: 200, md: 400 },
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.primary.main,
                0.15
              )} 0%, transparent 70%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <Box
            className="animate-float-slow"
            sx={{
              position: "absolute",
              bottom: "10%",
              left: "5%",
              width: { xs: 150, md: 300 },
              height: { xs: 150, md: 300 },
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.secondary.main,
                0.12
              )} 0%, transparent 70%)`,
              filter: "blur(40px)",
              animationDelay: "2s",
              pointerEvents: "none",
            }}
          />
          {/* Subtle Grid Pattern */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(${alpha(
                theme.palette.primary.main,
                0.03
              )} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Stack spacing={4} textAlign={{ xs: "center", md: "right" }}>
                  {/* Animated Badge */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 1,
                      borderRadius: 10,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.15
                      )}`,
                      alignSelf: { xs: "center", md: "flex-start" },
                      animation: "fadeInUp 0.6s ease-out forwards",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <AutoAwesomeOutlined
                      sx={{
                        fontSize: 18,
                        color: "primary.main",
                        animation: "float 3s ease-in-out infinite",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "primary.main",
                        letterSpacing: 0.5,
                        fontWeight: 600,
                      }}
                    >
                      {t("home.hero_badge")}
                    </Typography>
                  </Box>

                  {/* Main Title */}
                  <Typography
                    variant={isMdUp ? "h2" : "h3"}
                    sx={{
                      lineHeight: 1.2,
                      fontWeight: 800,

                      opacity: 0,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.dark} 100%)`,
                      backgroundSize: "200% auto",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation:
                        "fadeInUp 0.6s ease-out forwards, gradient-move 4s ease infinite",
                      animationDelay: "0.1s",
                    }}
                  >
                    {t("home.hero_title")}
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.9,
                      maxWidth: 600,
                      animation: "fadeInUp 0.6s ease-out forwards",
                      animationDelay: "0.2s",
                      opacity: 0,
                    }}
                  >
                    {t("home.hero_subtitle")}
                  </Typography>

                  {/* CTA Buttons */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      pt: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                      animation: "fadeInUp 0.6s ease-out forwards",
                      animationDelay: "0.3s",
                      opacity: 0,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardOutlined />}
                      onClick={() => navigate("/catalog")}
                      sx={{
                        px: 5,
                        py: 2,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 10px 30px ${alpha(
                          theme.palette.primary.main,
                          0.35
                        )}`,
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: `0 15px 40px ${alpha(
                            theme.palette.primary.main,
                            0.45
                          )}`,
                        },
                      }}
                    >
                      تصفح المنتجات
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<WhatsApp />}
                      onClick={() =>
                        window.open(getWhatsAppUrl(), "_blank")
                      }
                      sx={{
                        px: 4,
                        py: 2,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        borderWidth: 2,
                        borderColor: alpha(theme.palette.success.main, 0.5),
                        color: theme.palette.success.main,
                        "&:hover": {
                          borderWidth: 2,
                          transform: "translateY(-4px)",
                          bgcolor: alpha(theme.palette.success.main, 0.08),
                          borderColor: theme.palette.success.main,
                        },
                      }}
                    >
                      تواصل معنا
                    </Button>
                  </Stack>

                  {/* Trust Badges */}
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                      pt: 3,
                      justifyContent: { xs: "center", md: "flex-start" },
                      animation: "fadeInUp 0.6s ease-out forwards",
                      animationDelay: "0.4s",
                      opacity: 0,
                    }}
                  >
                    <Chip
                      icon={<ShieldOutlined />}
                      label="ضمان شامل"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                          color: theme.palette.success.main,
                        },
                      }}
                    />
                    <Chip
                      icon={<VerifiedOutlined />}
                      label="جودة معتمدة"
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        "& .MuiChip-icon": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </Stack>
                </Stack>
              </Grid>

              {/* Feature Cards */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={2.5}>
                  {features.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      subtitle={feature.subtitle}
                      color={feature.color}
                      delay={100 + index * 100}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Categories Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Chip
              label="الفئات"
              sx={{
                mb: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              فئات المنتجات
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.8 }}
            >
              اكتشف مجموعتنا الواسعة من المعدات والأدوات المتخصصة لقطاع الضيافة
            </Typography>
          </Box>

          <CategoryShowcase
            categories={categories}
            loading={loadingCategories}
            limit={6}
            showMore={true}
            onMoreClick={() => navigate("/categories")}
          />
        </Container>

        {/* Products Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            position: "relative",
            background: `linear-gradient(180deg, ${alpha(
              theme.palette.primary.main,
              0.02
            )} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 50%, ${alpha(
              theme.palette.background.default,
              1
            )} 100%)`,
          }}
        >
          {/* Decorative element */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${alpha(
                theme.palette.primary.main,
                0.2
              )}, transparent)`,
            }}
          />

          <Container maxWidth="lg">
            <Box sx={{ mb: 6, textAlign: "center" }}>
              <Chip
                label="جديد"
                sx={{
                  mb: 2,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                أحدث المنتجات
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.8 }}
              >
                تصفح أحدث المنتجات والمعدات المتاحة في كتالوجنا
              </Typography>
            </Box>

            {loadingProducts ? (
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <Box
                      sx={{
                        height: 380,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.divider, 0.2),
                        position: "relative",
                        overflow: "hidden",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(90deg, transparent, ${alpha(
                            theme.palette.background.paper,
                            0.4
                          )}, transparent)`,
                          animation: "shimmer 1.5s infinite",
                          backgroundSize: "200% 100%",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <ImageGrid
                images={products}
                withDownload
                onSelect={(img) => navigate(`/product/${img._id}`)}
              />
            )}

            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardOutlined />}
                onClick={() => navigate("/catalog")}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 10px 30px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: `0 15px 40px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                  },
                }}
              >
                عرض جميع المنتجات
              </Button>
            </Box>
          </Container>
        </Box>

        <AboutContactSection />
      </Box>
    </PageTransition>
  );
};

export default HomePage;
