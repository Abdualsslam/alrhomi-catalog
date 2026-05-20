import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { Warning as WarningIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { DeleteDialogState } from "../../hooks/useProductManagement";

interface Props {
  state: DeleteDialogState;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteProductDialog: React.FC<Props> = ({ state, onClose, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={state.open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { direction: "rtl" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <WarningIcon color="error" />
        <Typography variant="h6">{t("admin.products.delete_confirm")}</Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography>
          {t("admin.products.delete_message", { name: state.name })}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          py: 2,
          px: 3,
        }}
      >
        <Button onClick={onClose} disabled={state.loading}>
          {t("common.cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          startIcon={state.loading ? <CircularProgress size={16} /> : <DeleteIcon />}
          disabled={state.loading}
        >
          {t("common.delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductDialog;
