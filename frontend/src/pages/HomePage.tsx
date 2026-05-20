import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Button,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, FC, ReactElement } from "react";
import {
  ArrowForwardOutlined,
  WhatsApp,
  AutoAwesomeOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { fetchCategories } from "../api/admin";
import { searchProducts } from "../api/products";
import CategoryShowcase from "../components/CategoryShowcase";
import ImageGrid from "../components/ImageGrid";
import AboutContactSection from "../components/AboutContactSection";
import SEO from "../components/SEO";
import { useTranslation } from "react-i18next";
import PageTransition from "../components/PageTransition";
import { getWhatsAppUrl } from "../utils/whatsapp";

interface Category {
  _id: string;
  name: string;
  [key: string]: any;
}

interface Product {
  _id: string;
  [key: string]: any;
}

const HomePage: FC = (): ReactElement => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchCategories({ page: 1, limit: 6 }),
          searchProducts({ page: 1, limit: 6 })
        ]);
        setCategories(catRes.items);
        setProducts(prodRes.data.items);
      } catch (err) {
        console.error("Failed to fetch home data", err);
      } finally {
        setLoadingCategories(false);
        setLoadingProducts(false);
      }
    })();
  }, []);

  return (
    <PageTransition>
      <SEO
        title="Alrhomi Catalog | Premium Digital Showroom"
        description="Experience the finest selection of professional equipment in a stunning digital showroom."
        keywords="premium catalog, professional equipment, high-end tools, Alrhomi"
        type="website"
      />
      
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {/* Cinematic Hero Section */}
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: 'url("/premium_hero_banner_1779240298835.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.4) saturate(1.2)",
              zIndex: -1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 0%, var(--bg-dark) 100%)",
              zIndex: -1,
            }
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Stack spacing={4} sx={{ maxWidth: 800, textAlign: "right" }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 3,
                    py: 1,
                    width: "fit-content",
                    borderRadius: "100px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <AutoAwesomeOutlined sx={{ color: "var(--accent-secondary)", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--accent-secondary)" }}>
                    {t("home.hero_badge")}
                  </Typography>
                </Box>

                <Typography
                  variant={isMdUp ? "h1" : "h2"}
                  className="text-gradient"
                  sx={{ 
                    fontWeight: 800, 
                    lineHeight: 1.1,
                    fontSize: { xs: "3rem", md: "5rem" }
                  }}
                >
                  {t("home.hero_title")}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{ 
                    color: "var(--text-secondary)", 
                    lineHeight: 1.6,
                    maxWidth: 700,
                    fontWeight: 400
                  }}
                >
                  {t("home.hero_subtitle")}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ pt: 4 }}>
                  <Button
                    className="btn-premium"
                    size="large"
                    endIcon={<ArrowForwardOutlined />}
                    onClick={() => navigate("/catalog")}
                    sx={{ fontSize: "1.1rem", px: 6, py: 2 }}
                  >
                    تصفح الكتالوج
                  </Button>
                  <Button
                    className="btn-glass"
                    size="large"
                    startIcon={<WhatsApp />}
                    onClick={() => window.open(getWhatsAppUrl(), "_blank")}
                    sx={{ fontSize: "1.1rem", px: 6, py: 2 }}
                  >
                    تواصل مباشرة
                  </Button>
                </Stack>
              </Stack>
            </motion.div>
          </Container>
        </Box>

        {/* Categories Grid - Floating Glass Effect */}
        <Container maxWidth="lg" sx={{ mt: -15, pb: 12, position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box className="glass" sx={{ p: { xs: 4, md: 8 }, mb: 12 }}>
              <Stack spacing={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                    تصفح حسب <span style={{ color: "var(--accent-primary)" }}>الفئات</span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: "var(--text-secondary)", maxWidth: 600, mx: "auto" }}>
                    مجموعة مختارة من أرقى المعدات والأدوات الاحترافية المصنفة بدقة لتسهيل وصولك لما تحتاجه.
                  </Typography>
                </Box>
                
                <CategoryShowcase
                  categories={categories}
                  loading={loadingCategories}
                  limit={6}
                  showMore={true}
                  onMoreClick={() => navigate("/categories")}
                />
              </Stack>
            </Box>
          </motion.div>

          {/* Latest Products - Modern Grid */}
          <Stack spacing={6}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                أحدث <span style={{ color: "var(--accent-secondary)" }}>الإضافات</span>
              </Typography>
              <Typography variant="body1" sx={{ color: "var(--text-secondary)", maxWidth: 600, mx: "auto" }}>
                كن أول من يكتشف أحدث قطعنا الحصرية المضافة حديثاً للكتالوج.
              </Typography>
            </Box>

            <ImageGrid
              images={products}
              withDownload
              onSelect={(img) => navigate(`/product/${img._id}`)}
            />

            <Box sx={{ textAlign: "center", pt: 4 }}>
              <Button
                className="btn-premium"
                size="large"
                onClick={() => navigate("/catalog")}
              >
                اكتشف كل المنتجات
              </Button>
            </Box>
          </Stack>
        </Container>

        <AboutContactSection />
      </Box>
    </PageTransition>
  );
};

export default HomePage;
