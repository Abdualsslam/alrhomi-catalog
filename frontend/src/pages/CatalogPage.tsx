import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Box,
  Pagination,
  Typography,
  useMediaQuery,
  Skeleton,
  Grid,
  Stack,
  Paper,
  Button,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Refresh } from "@mui/icons-material";

import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ImageGrid from "../components/ImageGrid";
import { searchProducts } from "../api/products";
import { fetchCategories } from "../api/admin";
import SEO from "../components/SEO";
import PageTransition from "../components/PageTransition";
import { getItemListSchema, injectStructuredData } from "../utils/structuredData";
import type { Product, Category } from "../types/models.types";

type CatalogFilters = {
  q: string;
  category: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const parsePageParam = (value: string | null): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export default function CatalogPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const filters: CatalogFilters = {
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  };

  const page = parsePageParam(searchParams.get("page"));

  const [data, setData] = useState<{
    items: Product[];
    totalPages: number;
    totalItems: number;
  }>({
    items: [],
    totalPages: 1,
    totalItems: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  const limit = isMdUp ? 12 : isSmUp ? 8 : 6;

  useEffect(() => {
    const previousOverflowY = document.documentElement.style.overflowY;
    const previousScrollbarGutter = document.documentElement.style.scrollbarGutter;

    document.documentElement.style.overflowY = "scroll";
    document.documentElement.style.scrollbarGutter = "stable";

    return () => {
      document.documentElement.style.overflowY = previousOverflowY;
      document.documentElement.style.scrollbarGutter = previousScrollbarGutter;
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCategories({ page: 1, limit: 100 });
        setCategories(res.items || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const res = await searchProducts({
          q: filters.q,
          category: filters.category,
          page,
          limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        setData({
          items: res.data.items,
          totalPages: res.data.totalPages,
          totalItems: res.data.totalItems || 0,
        });
      } catch (err) {
        console.error("Fetch products failed", err);
        setError("تعذر تحميل المنتجات حاليًا. حاول مرة أخرى.");
        setData({
          items: [],
          totalPages: 1,
          totalItems: 0,
        });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [filters.q, filters.category, filters.sortBy, filters.sortOrder, page, limit, reloadKey]);

  useEffect(() => {
    if (data.items.length > 0) {
      const itemListSchema = getItemListSchema(data.items, filters.category);
      injectStructuredData(itemListSchema);
    }
  }, [data.items, filters.category]);

  const handleFilterChange = (payload: Partial<CatalogFilters>) => {
    const nextParams = new URLSearchParams(searchParams);

    const nextQ = payload.q !== undefined ? payload.q : filters.q;
    const nextCategory =
      payload.category !== undefined ? payload.category : filters.category;

    if (nextQ.trim()) {
      nextParams.set("q", nextQ.trim());
    } else {
      nextParams.delete("q");
    }

    if (nextCategory) {
      nextParams.set("category", nextCategory);
    } else {
      nextParams.delete("category");
    }

    if (payload.sortBy) {
      nextParams.set("sortBy", payload.sortBy);
    }
    if (payload.sortOrder) {
      nextParams.set("sortOrder", payload.sortOrder);
    }

    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextPage > 1) {
      nextParams.set("page", String(nextPage));
    } else {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  };

  const handleRetry = () => {
    setReloadKey((prev) => prev + 1);
  };

  const pageTitle = filters.category
    ? `${filters.category} - ${t('home.hero_title')}`
    : `${t('catalog.title')} - ${t('home.hero_title')}`;

  const pageDescription = filters.category
    ? `تصفح مجموعة ${filters.category} في كتالوج الرحومي. صور منتجات عالية الجودة مع إمكانية التحميل المباشر.`
    : "تصفح كتالوج المنتجات الكامل في كتالوج الرحومي. مجموعة واسعة من صور المنتجات عالية الجودة لجميع الفئات.";

  return (
    <PageTransition>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`كتالوج منتجات, ${filters.category || "منتجات"}, صور منتجات, كتالوج الرحومي`}
        type="website"
      />

      <Container maxWidth="xl">
        <Box
          className={theme.palette.mode === 'dark' ? 'mesh-gradient' : 'mesh-gradient-light'}
          sx={{
            position: "relative",
            overflow: "hidden",
            py: { xs: 8, md: 10 },
            mb: 5,
            borderRadius: 6,
            boxShadow: theme.shadows[4],
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography
                variant={isMdUp ? "h2" : "h3"}
                color="white"
                sx={{ fontWeight: 800 }}
              >
                {t('catalog.title')}
              </Typography>
              <Typography
                variant="h6"
                color="white"
                sx={{ maxWidth: 700, opacity: 0.9, fontWeight: 400 }}
              >
                {t('catalog.subtitle')}
              </Typography>
            </Stack>
          </Container>
        </Box>

        <Paper
          elevation={0}
          className={theme.palette.mode === 'dark' ? 'glass' : 'glass-light'}
          sx={{
            borderRadius: 5,
            p: { xs: 3, md: 4 },
            mb: 6,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <SearchBar
            value={filters.q}
            onSearch={(q: string) => handleFilterChange({ q: q.trim() })}
            placeholder={t('catalog.search_placeholder')}
          />
        </Paper>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 12, md: 3 }}>
            <Filters
              categories={categories}
              values={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 9 }}>
            <Stack spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  mb: 3,
                  p: 2.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6">
                  {t('catalog.results_found', { count: data.totalItems })}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
                    {t('catalog.pagination', { current: page, total: data.totalPages })}
                  </Typography>

                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="sort-select-label">{t('catalog.sort_by')}</InputLabel>
                    <Select
                      labelId="sort-select-label"
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      label={t('catalog.sort_by')}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split("-");
                        handleFilterChange({ sortBy, sortOrder: sortOrder as "asc" | "desc" });
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="createdAt-desc">{t('catalog.sort_options.newest')}</MenuItem>
                      <MenuItem value="createdAt-asc">{t('catalog.sort_options.oldest')}</MenuItem>
                      <MenuItem value="productName-asc">{t('catalog.sort_options.name_asc')}</MenuItem>
                      <MenuItem value="productName-desc">{t('catalog.sort_options.name_desc')}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              <Box
                sx={{
                  minHeight: { xs: 520, md: 720 },
                  transition: "opacity 0.2s ease",
                }}
              >
                {loading ? (
                  <Grid container spacing={3}>
                    {Array.from({ length: limit }).map((_, i) => (
                      <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={i}>
                        <Skeleton
                          variant="rectangular"
                          height={400}
                          sx={{ borderRadius: 4 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : error ? (
                  <Paper
                    elevation={0}
                    sx={{
                      textAlign: "center",
                      py: 8,
                      px: 3,
                      borderRadius: 4,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Alert severity="error" sx={{ mb: 3, textAlign: "right" }}>
                      {error}
                    </Alert>
                    <Button
                      variant="contained"
                      startIcon={<Refresh />}
                      onClick={handleRetry}
                      sx={{ borderRadius: 3, px: 4 }}
                    >
                      إعادة المحاولة
                    </Button>
                  </Paper>
                ) : data.items.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      textAlign: "center",
                      py: 10,
                      borderRadius: 4,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      لم يتم العثور على نتائج
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      جرّب البحث بكلمة مفتاحية أخرى أو أعد ضبط الفلاتر
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleResetFilters}
                      sx={{ borderRadius: 3, px: 4 }}
                    >
                      إعادة ضبط الفلاتر
                    </Button>
                  </Paper>
                ) : (
                  <>
                    <ImageGrid
                      images={data.items}
                      withDownload
                      onSelect={(img) => navigate(`/product/${img._id}`)}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        my: 4,
                        pt: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Pagination
                        count={data.totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          "& .MuiPaginationItem-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </PageTransition>
  );
}