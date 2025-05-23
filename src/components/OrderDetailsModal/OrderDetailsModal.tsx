import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, List, Divider, ListItem, ListItemText } from "@mui/material";
import dayjs from "dayjs";
import { Order } from "@/types/order";

type OrderDetailsProps = {
  open: boolean;
  onClose: () => void;
  order: Order;
};

export default function OrderDetails({
  open,
  onClose,
  order,
}: OrderDetailsProps) {
    if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Detalhes da Ordem</DialogTitle>
      <DialogContent>
        <Typography>ID: {order.id}</Typography>
        <Typography>Instrumento: {order.instrumento}</Typography>
        <Typography>Status: {order.status}</Typography>
        <Typography>Lado: {order.lado}</Typography>
        <Typography>Preço: R$ {order.preco}</Typography>
        <Typography>Quantidade: {order.quantidade}</Typography>
        <Typography>Data: {order.dataHora}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Histórico de Status</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Criado" secondary="21/05/2024 10:00" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Enviado para o sistema" secondary="21/05/2024 10:01" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Finalizado" secondary="21/05/2024 10:05" />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
}
