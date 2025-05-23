import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Order } from "@/types/order";

const orderSchema = z.object({
  instrumento: z.string().min(1, "Campo obrigatório"),
  lado: z.enum(["Compra", "Venda"], {
    errorMap: () => ({ message: "Campo obrigatório" }),
  }),
  preco: z
    .number({ invalid_type_error: "Preço deve ser um número" })
    .min(0.01, "Preço deve ser maior que zero"),
  quantidade: z
    .number({ invalid_type_error: "Deve ser um número" })
    .int("Deve ser um número inteiro")
    .positive("Quantidade deve ser positiva"),
});

type FormData = z.infer<typeof orderSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
};

export default function CreateOrderModal({ open, onClose, onSave }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      instrumento: "",
      lado: "Compra", // valor inicial obrigatório, não pode ser vazio
      preco: 0,
      quantidade: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    const newOrder: Order = {
      id: String(Math.floor(100 + Math.random() * 900)),
      instrumento: data.instrumento,
      status: "Aberta",
      lado: data.lado,
      dataHora: dayjs().format("DD/MM/YYYY"),
      preco: data.preco,
      quantidade: data.quantidade,
      quantidadeRestante: data.quantidade,
    };

    const response = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    const savedOrder: Order = await response.json();

    onSave(savedOrder);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Criar Nova Ordem</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              select
              label="Lado"
              defaultValue={"Compra"}
              {...register("lado")}
              error={!!errors.lado}
              helperText={
                errors.lado?.message === "Required"
                  ? "Campo obrigatório"
                  : errors.lado?.message
              }
              fullWidth
            >
              <MenuItem value="Compra">Compra</MenuItem>
              <MenuItem value="Venda">Venda</MenuItem>
            </TextField>
            <TextField
              label="Instrumento"
              {...register("instrumento")}
              error={!!errors.instrumento}
              helperText={errors.instrumento?.message}
              fullWidth
            />
            <TextField
              label="Preço"
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              fullWidth
              margin="normal"
              {...register("preco", { valueAsNumber: true })}
              error={!!errors.preco}
              helperText={errors.preco?.message}
            />
            <TextField
              label="Quantidade"
              type="number"
              {...register("quantidade", { valueAsNumber: true })}
              error={!!errors.quantidade}
              helperText={errors.quantidade?.message}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} style={{ color: "#2c290a" }}>Cancelar</Button>
          <Button type="submit" variant="contained" style={{ backgroundColor: "#ccf729", color: "black" }}>
            Criar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
