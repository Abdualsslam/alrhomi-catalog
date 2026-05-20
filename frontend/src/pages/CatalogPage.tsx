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
  Button,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  useTheme,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Refresh, Tune } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import ImageGrid from "../components/ImageGrid";
import { searchProducts } from "../api/products";
import { fetchCategories } from "../api/admin";
import SEO from "../components/SEO";
import PageTransition from "../components/PageTransition";
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
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filters: CatalogFilters = {
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  };

  const page = parsePageParam(searchParams.get("page"));
  const [data, setData] = useState({ items: [], totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const limit = isMdUp ? 12 : 8;

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
    const fetch = async () => {
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
        setError("تعذر تحميل المنتجات حاليًا.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filters.q, filters.category, filters.sortBy, filters.sortOrder, page, limit]);

  const handleFilterChange = (payload: Partial<CatalogFilters>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries({ ...filters, ...payload }).forEach(([key, val]) => {
      if (val) nextParams.set(key, val);
      else nextParams.delete(key);
    });
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  return (
    <PageTransition>
      <SEO title="Catalog | Alrhomi Showroom" description="Browse our professional equipment collection." />

      <Box sx={{ py: { xs: 4, md: 8 } }}>
        <Container maxWidth="xl">
          {/* Page Header */}
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }} className="text-gradient">
              {t('catalog.title')}
            </Typography>
            <Typography variant="body1" sx={{ color: "var(--text-secondary)", maxWidth: 600, mx: "auto" }}>
              {t('catalog.subtitle')}
            </Typography>
          </Box>

          {/* Search & Layout */}
          <Grid container spacing={4}>
            {/* Sidebar Filters */}
            <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: showMobileFilters ? "block" : "none", md: "block" } }}>
              <Box className="glass" sx={{ p: 4, position: "sticky", top: 100 }}>
                <Filters
                  categories={categories}
                  values={filters}
                  onChange={handleFilterChange}
                  onReset={() => setSearchParams(new URLSearchParams())}
                />
              </Box>
            </Grid>

            {/* Main Content */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Stack spacing={4}>
                {/* Search Bar Glass */}
                <Box className="glass" sx={{ p: 2 }}>
                  <SearchBar
                    value={filters.q}
                    onSearch={(q) => handleFilterChange({ q })}
                    placeholder={t('catalog.search_placeholder')}
                  />
                </Box>

                {/* Toolbar */}
                <Box className="glass" sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t('catalog.results_found', { count: data.totalItems })}
                  </Typography>
                  
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button 
                      sx={{ display: { md: "none" } }}
                      variant="outlined" 
                      startIcon={<Tune />}
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                    >
                      الفلاتر
                    </Button>
                    
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <Select
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(e) => {
                          const [sortBy, sortOrder] = e.target.value.split("-");
                          handleFilterChange({ sortBy, sortOrder: sortOrder as "asc" | "desc" });
                        }}
                        className="glass"
                        sx={{ borderRadius: "12px", ".MuiOutlinedInput-notchedOutline": { border: "none" } }}
                      >
                        <MenuItem value="createdAt-desc">{t('catalog.sort_options.newest')}</MenuItem>
                        <MenuItem value="createdAt-asc">{t('catalog.sort_options.oldest')}</MenuItem>
                        <MenuItem value="productName-asc">{t('catalog.sort_options.name_asc')}</MenuItem>
                        <MenuItem value="productName-desc">{t('catalog.sort_options.name_desc')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>

                {/* Products Grid */}
                <AnimatePresence mode="wait">
                  {loading ? (
                    <Grid container spacing={3}>
                      {Array.from({ length: limit }).map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                          <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 6, bgcolor: "rgba(255,255,255,0.05)" }} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : error ? (
                    <Alert severity="error" className="glass">{error}</Alert>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ImageGrid
                        images={data.items}
                        withDownload
                        onSelect={(img) => navigate(`/product/${img._id}`)}
                      />
                      
                      {data.totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                          <Pagination
                            count={data.totalPages}
                            page={page}
                            onChange={(_, p) => handleFilterChange({ page: p.toString() } as any)}
                            color="primary"
                            size="large"
                            sx={{
                              "& .MuiPaginationItem-root": {
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(255,255,255,0.05)",
                                "&.Mui-selected": {
                                  background: "var(--accent-primary)",
                                }
                              }
                            }}
                          />
                        </Box>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PageTransition>
  );
}