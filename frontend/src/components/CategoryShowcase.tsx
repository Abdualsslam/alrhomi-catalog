import {
  Box,
  Typography,
  Grid,
  Skeleton,
  Stack,
} from "@mui/material";
import { useMemo, FC, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowForwardOutlined, CategoryOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parent?: string | { name: string };
  itemsCount?: number;
}

interface CategoryShowcaseProps {
  categories?: Category[];
  loading?: boolean;
  limit?: number;
  showMore?: boolean;
  onMoreClick?: () => void;
}

const CategoryShowcase: FC<CategoryShowcaseProps> = ({
  categories = [],
  loading = false,
  limit = 6,
  showMore = false,
  onMoreClick,
}): ReactElement => {
  const navigate = useNavigate();

  const organizedCategories = useMemo(() => {
    if (loading || !categories.length) return [];
    return categories.filter((cat) => !cat.parent).slice(0, limit);
  }, [categories, loading, limit]);

  const displayCategories = loading
    ? Array.from({ length: limit }, (_, idx) => ({ _id: `skeleton-${idx}` } as Category))
    : organizedCategories;

  return (
    <Box>
      <Grid container spacing={4}>
        {displayCategories.map((category, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category._id ?? idx}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              style={{ height: "100%" }}
            >
              <Box
                className="glass-card glass"
                onClick={() => !loading && navigate(`/catalog?category=${category._id}`)}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 300,
                }}
              >
                {loading ? (
                  <Skeleton variant="rectangular" height="100%" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                ) : (
                  <>
                    <Box
                      sx={{
                        height: 200,
                        position: "relative",
                        backgroundImage: category.image ? `url(${category.image})` : 'none',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundBlendMode: "overlay",
                        backgroundColor: "rgba(0,0,0,0.4)",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 20,
                          right: 20,
                          background: "var(--accent-primary)",
                          px: 2,
                          py: 0.5,
                          borderRadius: "100px",
                          boxShadow: "0 4px 15px rgba(59, 130, 246, 0.5)"
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                          {category.itemsCount ?? 0} قطعة
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 4, flexGrow: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "white" }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {category.description || "استكشف أرقى الخيارات في هذه الفئة."}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </motion.div>
          </Grid>
        ))}

        {showMore && !loading && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{ height: "100%" }}
            >
              <Box
                className="glass-card"
                onClick={onMoreClick}
                sx={{
                  height: "100%",
                  minHeight: 300,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "var(--accent-secondary)",
                    background: "rgba(6, 182, 212, 0.05)"
                  }
                }}
              >
                <CategoryOutlined sx={{ fontSize: 48, color: "var(--accent-secondary)", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "white", display: "flex", alignItems: "center", gap: 1 }}>
                  عرض جميع الفئات <ArrowForwardOutlined fontSize="small" />
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CategoryShowcase;
