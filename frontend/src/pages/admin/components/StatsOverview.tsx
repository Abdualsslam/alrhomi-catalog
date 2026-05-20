import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  Stack,
} from "@mui/material";
import {
  Image as ImageIcon,
  HourglassTop as HourglassIcon,
  WaterDrop as WatermarkIcon,
  Person as PersonIcon,
  Inventory as ProductIcon,
  PhotoLibrary as ProductsWithImagesIcon,
  PhotoCameraOutlined as ProductsWithoutImagesIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const STAT_VARIANTS = [
  {
    key: "totalProducts",
    label: "إجمالي المنتجات",
    icon: <ProductIcon />,
    color: "#6366f1", // Indigo
  },
  {
    key: "productsWithImages",
    label: "منتجات مع صور",
    icon: <ProductsWithImagesIcon />,
    color: "#10b981", // Emerald
  },
  {
    key: "productsWithoutImages",
    label: "منتجات بدون صور",
    icon: <ProductsWithoutImagesIcon />,
    color: "#f43f5e", // Rose
  },
  {
    key: "totalImages",
    label: "إجمالي الصور",
    icon: <ImageIcon />,
    color: "#06b6d4", // Cyan
  },
  {
    key: "watermarkedCount",
    label: "صور مُعلَّمة",
    icon: <WatermarkIcon />,
    color: "#3b82f6", // Blue
  },
  {
    key: "pendingJobs",
    label: "مهام بانتظار المعالجة",
    icon: <HourglassIcon />,
    color: "#f59e0b", // Amber
  },
  {
    key: "activeUsers",
    label: "المستخدمون النشطون",
    icon: <PersonIcon />,
    color: "#8b5cf6", // Violet
  },
] as const;

interface StatsData {
  totalProducts?: number;
  productsWithImages?: number;
  productsWithoutImages?: number;
  totalImages?: number;
  watermarkedCount?: number;
  pendingJobs?: number;
  activeUsers?: number;
}

interface Props {
  stats: StatsData;
}

export default function StatsOverview({ stats }: Props) {
  const theme = useTheme();

  return (
    <Grid container spacing={3} sx={{ mb: 6 }}>
      {STAT_VARIANTS.map((variant) => {
        const value = stats?.[variant.key] ?? 0;
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={variant.key}>
            <Card
              elevation={0}
              className={theme.palette.mode === 'dark' ? 'glass' : 'glass-light'}
              sx={{
                borderRadius: 5,
                border: `1px solid ${alpha(variant.color, 0.1)}`,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: `0 20px 40px ${alpha(variant.color, 0.15)}`,
                  borderColor: alpha(variant.color, 0.3),
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(variant.color, 0.1),
                      color: variant.color,
                      boxShadow: `inset 0 0 0 1px ${alpha(variant.color, 0.1)}`,
                    }}
                  >
                    {variant.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {variant.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={800}>
                      {value.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
              {/* Subtle background glow */}
              <Box 
                sx={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  bgcolor: alpha(variant.color, 0.1),
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

