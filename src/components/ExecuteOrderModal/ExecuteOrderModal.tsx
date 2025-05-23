import { Order } from "@/types/order";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onExecuteConfirmed: (original: Order, nova: Order) => void;
}

const ExecuteOrderModal: React.FC<Props> = ({
  open,
  order,
  onClose,
  onExecuteConfirmed,
}) => {
  const [quantidade, setQuantidade] = useState<number | "">(0);
  const [precoUnitario, setPrecoUnitario] = useState<number | "">(0);
  const [lado, setLado] = useState<"Compra" | "Venda">("Compra");

  useEffect(() => {
    if (order) {
      setQuantidade(order.quantidadeRestante);
      setPrecoUnitario(order.preco);
      setLado("Compra");
    }
  }, [order]);

  if (!order) return null;

  const handleExecute = async () => {
    const response = await fetch("/api/orders/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order, quantidade, precoUnitario, lado }),
    });

    if (!response.ok) {
      // Aqui você pode tratar o erro como quiser, mas sem snackbar
      return;
    }

    const data = await response.json();
    onExecuteConfirmed(data.original, data.nova);
    onClose();
  };

  const isExecuteDisabled =
    quantidade === "" ||
    precoUnitario === "" ||
    quantidade <= 0 ||
    precoUnitario < order.preco ||
    (quantidade > order.quantidadeRestante && lado === "Venda");

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Simular Execução de Ordem</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Typography><strong>ID:</strong> {order.id}</Typography>
          <Typography><strong>Instrumento:</strong> {order.instrumento}</Typography>
          <Typography>
            <strong>Valor Total Ordem:</strong> R${" "}
            {(order.preco * order.quantidade).toFixed(2).replace(".", ",")}
          </Typography>
          <Typography><strong>Qtd. Original:</strong> {order.quantidade}</Typography>
          <Typography><strong>Qtd. Restante:</strong> {order.quantidadeRestante}</Typography>

          <FormControl fullWidth>
            <InputLabel id="lado-label">Lado</InputLabel>
            <Select
              labelId="lado-label"
              id="lado"
              value={lado}
              label="Lado"
              onChange={e => setLado(e.target.value as "Compra" | "Venda")}
            >
              <MenuItem value="Compra">Compra</MenuItem>
              <MenuItem value="Venda">Venda</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Quantidade a Executar"
            type="number"
            value={quantidade}
            onChange={e => {
              const val = e.target.value;
              setQuantidade(val === "" ? "" : Number(val));
            }}
            inputProps={{ min: 0, max: order.quantidadeRestante }}
          />

          <TextField
            label="Preço Unitário (R$)"
            type="number"
            value={precoUnitario}
            onChange={e => {
              const val = e.target.value;
              setPrecoUnitario(val === "" ? "" : Number(val));
            }}
            inputProps={{ min: order.preco }}
          />

          <Typography style={{ color: "#2c290a" }}>
            <strong>Total:</strong> R${" "}
            {!Number.isNaN(quantidade && precoUnitario ? quantidade * precoUnitario : 0)
              ? ((quantidade as number) * (precoUnitario as number)).toFixed(2).replace(".", ",")
              : 0}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: "#2c290a" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleExecute}
          variant="contained"
          sx={{
            ...(quantidade !== "" &&
              precoUnitario !== "" &&
              quantidade > 0 &&
              precoUnitario >= order.preco &&
              quantidade <= order.quantidadeRestante && {
                backgroundColor: "#ccf729",
                color: "black",
                "&:hover": { backgroundColor: "#c0e123" },
              }),
          }}
          disabled={isExecuteDisabled}
        >
          Executar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExecuteOrderModal;
