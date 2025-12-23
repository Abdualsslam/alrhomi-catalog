import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
  alpha,
  Stack,
  CardMedia,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, FC, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOutlined, CategoryOutlined, ArrowForwardOutlined } from "@mui/icons-material";

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
  const theme = useTheme();
  const navigate = useNavigate();

  // تنظيم الفئات: الرئيسية فقط للعرض
  const organizedCategories = useMemo(() => {
    if (loading || !categories.length) return [];

    // عرض الفئات الرئيسية فقط
    const parentCategories = categories.filter((cat) => !cat.parent);
    return parentCategories.slice(0, limit);
  }, [categories, loading, limit]);

  const displayCategories = loading
    ? Array.from({ length: limit }, (_, idx) => ({ _id: `skeleton-${idx}` } as Category))
    : organizedCategories;

  const handleCategoryClick = (category: Category): void => {
    if (!loading && category._id && !category._id.startsWith('skeleton-')) {
      navigate(`/catalog?category=${category._id}`);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {displayCategories.map((category, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category._id ?? idx}>
            <Card
              elevation={0}
              onClick={() => handleCategoryClick(category)}
              sx={{
                borderRadius: 4,
                height: "100%",
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: loading ? "default" : "pointer",
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(10px)",
                position: "relative",
                animation: loading ? "none" : "fadeInUp 0.5s ease-out forwards",
                animationDelay: `${idx * 80}ms`,
                opacity: loading ? 1 : 0,
                "&:hover": loading
                  ? {}
                  : {
                    transform: "translateY(-12px) scale(1.02)",
                    boxShadow: `0 25px 50px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    "& .category-image": {
                      transform: "scale(1.15)",
                    },
                    "& .category-overlay": {
                      opacity: 1,
                    },
                    "& .category-badge": {
                      transform: "scale(1.05)",
                    },
                  },
              }}
            >
              {loading ? (
                <>
                  <Skeleton
                    variant="rectangular"
                    height={220}
                    sx={{
                      "&::after": {
                        background: `linear-gradient(90deg, transparent, ${alpha(
                          theme.palette.background.paper,
                          0.4
                        )}, transparent)`,
                      },
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton width="70%" height={32} sx={{ mb: 1.5, borderRadius: 1 }} />
                    <Skeleton width="50%" height={20} sx={{ borderRadius: 1 }} />
                  </CardContent>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      position: "relative",
                      height: 220,
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                      overflow: "hidden",
                    }}
                  >
                    {category.image ? (
                      <CardMedia
                        component="img"
                        image={category.image}
                        alt={category.name}
                        className="category-image"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.08
                          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        }}
                      >
                        {category.parent ? (
                          <CategoryOutlined
                            sx={{
                              fontSize: 80,
                              color: alpha(theme.palette.primary.main, 0.25),
                            }}
                          />
                        ) : (
                          <FolderOutlined
                            sx={{
                              fontSize: 80,
                              color: alpha(theme.palette.primary.main, 0.25),
                            }}
                          />
                        )}
                      </Box>
                    )}
                    {/* Gradient Overlay */}
                    <Box
                      className="category-overlay"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                        background: `linear-gradient(to top, ${alpha(
                          theme.palette.common.black,
                          0.4
                        )} 0%, transparent 100%)`,
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Product Count Badge */}
                    <Box
                      className="category-badge"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        color: "white",
                        px: 2,
                        py: 0.75,
                        borderRadius: 2.5,
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {category.itemsCount ?? 0} منتج
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "text.primary",
                          fontWeight: 700,
                          lineHeight: 1.3,
                          transition: "color 0.3s ease",
                        }}
                      >
                        {category.name}
                      </Typography>
                      {category.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.7,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {category.description}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </>
              )}
            </Card>
          </Grid>
        ))}
        {showMore && !loading && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={0}
              onClick={onMoreClick}
              sx={{
                borderRadius: 4,
                height: "100%",
                minHeight: 340,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.25)}`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                background: `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.03
                )} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "fadeInUp 0.5s ease-out forwards",
                animationDelay: `${displayCategories.length * 80}ms`,
                opacity: 0,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  borderStyle: "solid",
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.08
                  )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  transform: "translateY(-12px) scale(1.02)",
                  boxShadow: `0 25px 50px ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}`,
                  "& .more-icon": {
                    transform: "scale(1.1) rotate(10deg)",
                  },
                  "& .more-arrow": {
                    transform: "translateX(-5px)",
                  },
                },
              }}
            >
              <Stack spacing={3} alignItems="center" sx={{ p: 4 }}>
                <Box
                  className="more-icon"
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
                  }}
                >
                  <CategoryOutlined
                    sx={{
                      fontSize: 45,
                      color: "primary.main",
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  عرض جميع الفئات
                  <ArrowForwardOutlined
                    className="more-arrow"
                    sx={{
                      fontSize: 20,
                      transition: "transform 0.3s ease",
                    }}
                  />
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", lineHeight: 1.7 }}
                >
                  اكتشف المزيد من الفئات والمنتجات المتنوعة
                </Typography>
              </Stack>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CategoryShowcase;
