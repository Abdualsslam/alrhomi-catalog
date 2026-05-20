import {
  Typography,
  Chip,
  Box,
  Skeleton,
  Stack,
} from "@mui/material";
import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { VisibilityOutlined } from "@mui/icons-material";
import { ImageCardProps } from "../types/component.types";

export default function ImageCard({
  image,
  onViewDetails,
  className,
}: ImageCardProps): JSX.Element {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const title = image.productName || image.description || "منتج";

  const handleClick = (): void => {
    if (onViewDetails) {
      onViewDetails(image);
    } else {
      navigate(`/product/${image._id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ height: "100%" }}
    >
      <Box
        className={`${className} glass-card glass`}
        onClick={handleClick}
        sx={{
          height: "100%",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          "&:hover .hover-overlay": { opacity: 1 },
          "&:hover img": { transform: "scale(1.1)" },
          "&:hover .view-badge": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 }
        }}
      >
        {/* Image Wrapper */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "100%",
            background: "rgba(0,0,0,0.1)",
            overflow: "hidden"
          }}
        >
          {!imgLoaded && (
            <Skeleton
              variant="rectangular"
              sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.05)" }}
            />
          )}
          <Box
            component="img"
            src={image.watermarkedUrl || image.originalUrl}
            alt={title}
            onLoad={() => setImgLoaded(true)}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              p: 3,
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              opacity: imgLoaded ? 1 : 0,
            }}
          />

          {/* Hover Overlay */}
          <Box
            className="hover-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(59, 130, 246, 0.4), transparent)",
              opacity: 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* View Badge */}
          <Box
            className="view-badge"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(0.5)",
              opacity: 0,
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              width: 60,
              height: 60,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2
            }}
          >
            <VisibilityOutlined sx={{ color: "white" }} />
          </Box>

          {/* Category Chip */}
          <Chip
            label={image.category}
            size="small"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(5px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              fontWeight: 600,
              zIndex: 3
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.4,
              mb: 2,
              color: "white",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-secondary)" }} />
            <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontWeight: 500, letterSpacing: 0.5 }}>
              عرض التفاصيل
            </Typography>
          </Stack>
        </Box>
      </Box>
    </motion.div>
  );
}
