import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box,
  Skeleton,
  alpha,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageModal from "./ImageModal";
import { ImageCardProps } from "../types/component.types";
import { VisibilityOutlined } from "@mui/icons-material";

export default function ImageCard({
  image,
  onViewDetails,
  className,
  style,
}: ImageCardProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const theme = useTheme();
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
    <>
      <Card
        className={`${className} hover-lift`}
        style={style}
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 5,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          bgcolor: theme.palette.mode === 'dark' ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          "&:hover": {
            boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.25)}`,
            borderColor: alpha(theme.palette.primary.main, 0.3),
            "& .image-container img": {
              transform: "scale(1.1) rotate(1deg)",
            },
            "& .image-overlay": {
              opacity: 1,
            },
            "& .view-icon": {
              opacity: 1,
              transform: "translate(-50%, -50%) scale(1)",
            },
          },
        }}
      >
        <CardActionArea
          onClick={handleClick}
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box
            className="image-container"
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "100%", // 1:1 Aspect ratio for consistency
              overflow: "hidden",
              bgcolor: theme.palette.mode === 'dark' ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
            }}
          >
            {!imgLoaded && (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
            <Box
              component="img"
              src={image.watermarkedUrl || image.originalUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                opacity: imgLoaded ? 1 : 0,
                p: 3,
              }}
            />

            {/* Hover Overlay - Mesh-like gradient */}
            <Box
              className="image-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, ${alpha(
                  theme.palette.primary.main,
                  0.4
                )} 0%, transparent 100%)`,
                opacity: 0,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
              }}
            />

            {/* View Icon */}
            <Box
              className="view-icon"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(0.8)",
                width: 56,
                height:56,
                borderRadius: "50%",
                bgcolor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: theme.shadows[10],
                pointerEvents: "none",
                zIndex: 3,
              }}
            >
              <VisibilityOutlined sx={{ fontSize: 24, color: "primary.main" }} />
            </Box>

            {/* Tags Overlay */}
            {image.tags && image.tags.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  left: 12,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.75,
                  zIndex: 2,
                }}
              >
                {image.tags.slice(0, 2).map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      color: "#1e293b",
                      backdropFilter: "blur(8px)",
                      height: 24,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      border: "none",
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <CardContent sx={{ width: "100%", p: 3, flexGrow: 0 }}>
            <Stack spacing={2}>
              <Typography
                variant="h6"
                sx={{
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  minHeight: "2.8em",
                  color: "text.primary",
                }}
              >
                {title}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Chip
                  label={image.category}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: "secondary.main",
                    fontWeight: 700,
                    borderRadius: 1.5,
                  }}
                />
                {image.watermarkedUrl && (
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    محمي
                  </Typography>
                )}
              </Box>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      <ImageModal open={open} onClose={() => setOpen(false)} image={image} />
    </>
  );
}
