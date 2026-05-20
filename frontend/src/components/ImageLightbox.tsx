import React from "react";
import {
  Dialog,
  IconButton,
  Box,
  alpha,
  IconButtonProps,
} from "@mui/material";
import {
  Close,
  ArrowBackIosNew,
  ArrowForwardIos,
  Download,
} from "@mui/icons-material";
import { ProductImage } from "../types/models.types";

interface Props {
  open: boolean;
  onClose: () => void;
  images: ProductImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const NavButton: React.FC<IconButtonProps & { direction: "left" | "right" }> = ({
  direction,
  ...props
}) => (
  <IconButton
    {...props}
    sx={{
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      [direction === "left" ? "left" : "right"]: { xs: 8, md: 24 },
      zIndex: 2,
      bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7),
      backdropFilter: "blur(4px)",
      "&:hover": {
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
      },
      ...props.sx,
    }}
  >
    {direction === "left" ? <ArrowBackIosNew /> : <ArrowForwardIos />}
  </IconButton>
);

const ImageLightbox: React.FC<Props> = ({
  open,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) => {
  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % images.length);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = currentImage.watermarkedUrl || currentImage.originalUrl;
    link.download = `product-image-${currentImage._id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "rgba(0,0,0,0.9)",
          boxShadow: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onClose}
      >
        {/* Controls */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 1,
            zIndex: 3,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={handleDownload}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <Download />
          </IconButton>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {images.length > 1 && (
          <>
            <NavButton direction="left" onClick={handlePrev} />
            <NavButton direction="right" onClick={handleNext} />
          </>
        )}

        <Box
          component="img"
          src={currentImage.watermarkedUrl || currentImage.originalUrl}
          sx={{
            maxWidth: "95%",
            maxHeight: "95%",
            objectFit: "contain",
            userSelect: "none",
            transition: "transform 0.3s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Thumbnails at bottom (optional but good for UX) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: 1,
            zIndex: 2,
            px: 2,
            overflowX: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <Box
              key={img._id}
              onClick={() => onNavigate(idx)}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                border: "2px solid",
                borderColor: currentIndex === idx ? "primary.main" : "transparent",
                opacity: currentIndex === idx ? 1 : 0.5,
                transition: "all 0.2s",
                "&:hover": { opacity: 1 },
                flexShrink: 0,
              }}
            >
              <img
                src={img.watermarkedUrl || img.originalUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Dialog>
  );
};

export default ImageLightbox;
