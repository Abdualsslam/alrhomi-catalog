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
        className={className}
        style={style}
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          "&:hover": {
            transform: "translateY(-10px) scale(1.02)",
            boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.18)}`,
            borderColor: alpha(theme.palette.primary.main, 0.2),
            "& .image-container img": {
              transform: "scale(1.08)",
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
              paddingTop: "110%",
              overflow: "hidden",
              bgcolor: alpha(theme.palette.primary.main, 0.02),
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
                  "&::after": {
                    background: `linear-gradient(90deg, transparent, ${alpha(
                      theme.palette.background.paper,
                      0.5
                    )}, transparent)`,
                  },
                }}
              />
            )}
            <Box
              component="img"
              src={image.watermarkedUrl || image.originalUrl}
              alt={title}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: imgLoaded ? 1 : 0,
                p: 2,
              }}
            />

            {/* Hover Overlay */}
            <Box
              className="image-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, ${alpha(
                  theme.palette.primary.dark,
                  0.6
                )} 0%, ${alpha(theme.palette.primary.main, 0.2)} 50%, transparent 100%)`,
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
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.2)}`,
                pointerEvents: "none",
              }}
            >
              <VisibilityOutlined sx={{ fontSize: 28, color: "primary.main" }} />
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
                {image.tags.slice(0, 3).map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.background.paper, 0.92),
                      color: "text.primary",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                      height: 28,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.common.black,
                        0.1
                      )}`,
                      transition: "all 0.3s ease",
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                      "&:hover": {
                        bgcolor: theme.palette.background.paper,
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                ))}
                {image.tags.length > 3 && (
                  <Chip
                    label={`+${image.tags.length - 3}`}
                    size="small"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: "white",
                      backdropFilter: "blur(12px)",
                      border: "none",
                      height: 28,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.primary.main,
                        0.35
                      )}`,
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>

          <CardContent sx={{ width: "100%", p: 2.5, flexGrow: 0 }}>
            <Stack spacing={1.5}>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  minHeight: "3em",
                  color: "text.primary",
                }}
              >
                {title}
              </Typography>

              <Chip
                label={image.category}
                size="medium"
                sx={{
                  background: `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.12
                  )} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                  color: "primary.main",
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  height: 30,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  width: "fit-content",
                  transition: "all 0.3s ease",
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                  "&:hover": {
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.18
                    )} 0%, ${alpha(theme.palette.primary.main, 0.12)} 100%)`,
                  },
                }}
              />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
      <ImageModal open={open} onClose={() => setOpen(false)} image={image} />
    </>
  );
}
