// src/components/ImageModal.tsx
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Divider,
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  AlertColor,
} from "@mui/material";
import {
  Close,
  Download,
  Fullscreen,
  Share,
  FullscreenExit,
} from "@mui/icons-material";
import { useState, useRef, useEffect, FC, ReactElement } from "react";
import { saveAs } from "file-saver";
import API from "../api/images"; // استخدم instance مع interceptors مهيّئة للـ accessToken

interface ImageData {
  _id: string;
  description?: string;
  productName?: string;
  watermarkedUrl?: string;
  originalUrl: string;
  category?: string;
  model?: string;
  note?: string;
  uploadedAt?: string;
  isWatermarked?: boolean;
}

interface DownloadUrlResponse {
  url: string;
}

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  image: ImageData;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const ImageModal: FC<ImageModalProps> = ({ open, onClose, image }): ReactElement => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const title = image.description || image.productName || "صورة";

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(false);
    }
  }, [open, image]);

  const handleDownload = async (): Promise<void> => {
    try {
      // احصل على رابط التحميل المسبق عبر instance
      const { url } = await API.get<DownloadUrlResponse>(`/images/${image._id}/download-url`);
      // حمل البلووب من الرابط مباشرة (عادة لا يحتاج Authorization)
      const blobRes = await fetch(url);
      const blob = await blobRes.blob();
      saveAs(blob, `${image.category}-${image.model}.jpg`);
      setSnackbar({
        open: true,
        message: "تم بدء تنزيل الصورة",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "فشل تنزيل الصورة",
        severity: "error",
      });
    }
  };

  const handleShare = async (): Promise<void> => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({ open: true, message: "تم نسخ الرابط", severity: "info" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "فشل المشاركة", severity: "error" });
    }
  };

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      dialogRef.current
        ?.requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Fullscreen error:", err));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handler = (): void => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <>
      <Dialog
        ref={dialogRef}
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        fullScreen={isFullscreen}
        PaperProps={{ sx: { borderRadius: isFullscreen ? 0 : 4 } }}
      >
        <Box sx={{ position: "relative", bgcolor: "background.default" }}>
          {isLoading && (
            <CircularProgress
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
          {!error ? (
            <Box
              component="img"
              src={image.watermarkedUrl || image.originalUrl}
              alt={title}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError(true);
              }}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: isFullscreen ? "100vh" : "70vh",
                objectFit: "contain",
                display: isLoading ? "none" : "block",
              }}
            />
          ) : (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography color="error">فشل تحميل الصورة</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {
                  setIsLoading(true);
                  setError(false);
                }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          )}

          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
            <IconButton onClick={handleDownload}>
              <Download />
            </IconButton>
            <IconButton onClick={handleShare}>
              <Share />
            </IconButton>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5">
              {title}
            </Typography>
            {image.model && (
              <Typography color="text.secondary">
                الموديل: {image.model}
              </Typography>
            )}
            {image.note && (
              <Typography sx={{ mt: 1, fontStyle: "italic" }}>
                ملاحظة: {image.note}
              </Typography>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2">
                تفاصيل
              </Typography>
              <Typography variant="body2">
                تم الرفع:{" "}
                {image.uploadedAt ? new Date(image.uploadedAt).toLocaleDateString("ar-EG") : "غير متوفر"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2">
                الحالة
              </Typography>
              <Chip
                label={image.isWatermarked ? "مُعلَّمة" : "غير معلّمة"}
                color={image.isWatermarked ? "success" : "default"}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ImageModal;
