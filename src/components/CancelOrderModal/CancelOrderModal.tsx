import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { Order } from "@/types/order";

interface CancelOrderModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onCancelConfirmed: (orderId: string) => void;
}

export const CancelOrderModal = ({
  open,
  order,
  onClose,
  onCancelConfirmed,
}: CancelOrderModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!order) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cancelar ordem.");
      }

      const updated = await response.json();

      onCancelConfirmed(updated.id);
      enqueueSnackbar("Ordem cancelada com sucesso!", { variant: "success" });
      onClose();
    } catch (err: any) {
      enqueueSnackbar(err.message || "Erro ao cancelar ordem.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>Cancelar Ordem</DialogTitle>
      <DialogContent>
        Tem certeza que deseja cancelar a ordem ID: <strong>{order?.id}</strong>
        ?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Não
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Cancelando..." : "Sim, cancelar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
