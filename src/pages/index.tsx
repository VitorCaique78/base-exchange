import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Stack,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import OrderDetails from "@/components/OrderDetailsModal/OrderDetailsModal";
import { Order } from "@/types/order";
import { enqueueSnackbar } from "notistack";
import CreateOrderModal from "@/components/CreateOrderModal/CreateOrderModal";
import { CancelOrderModal } from "@/components/CancelOrderModal/CancelOrderModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ExecuteOrderModal from "@/components/ExecuteOrderModal/ExecuteOrderModal";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filtros, setFiltros] = useState({
    id: "",
    instrumento: "",
    status: "",
    lado: "",
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // Início Criação da Ordem
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateOrder = async (newOrder: Order) => {
    setOrders((prev) => {
      const updatedOrders = [newOrder, ...prev];
      localStorage.setItem("orders", JSON.stringify(updatedOrders)); // opcional, se quiser garantir
      return updatedOrders;
    });

    setCreateModalOpen(false);
    enqueueSnackbar("Ordem criada com sucesso!", { variant: "success" });
  };

  // Fim Criação da Ordem

  // Ínicio Detalhes da Ordem
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };
  // Fim Detalhes da Ordem

  // Início Cancelamento da Ordem

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  const handleOpenCancel = (order: Order) => {
    setOrderToCancel(order);
    setCancelModalOpen(true);
  };

  const handleCancelConfirmed = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelada" } : order
      )
    );
  };

  // Fim Cancelamento da Ordem

  // Início Execução da Ordem

  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [orderToExecute, setOrderToExecute] = useState<Order | null>(null);

  const handleOpenExecute = (order: Order) => {
    setOrderToExecute(order);
    setExecuteModalOpen(true);
  };

  const handleExecuteConfirmed = (original: Order, nova: Order) => {
    setOrders((prev) => {
      // Remove a ordem original antiga da lista
      const filtered = prev.filter((o) => o.id !== original.id);
      // Adiciona a ordem original atualizada e a nova ordem
      const updated = [nova, original, ...filtered];

      // Salva no localStorage
      localStorage.setItem("orders", JSON.stringify(updated));

      return updated;
    });

    enqueueSnackbar("Execução simulada com sucesso!", { variant: "success" });
  };

  // Fim Execução da Ordem

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "instrumento", headerName: "Instrumento", width: 150 },
    { field: "lado", headerName: "Lado", width: 120 },
    { field: "preco", headerName: "Preço", width: 120 },
    { field: "quantidade", headerName: "Quantidade", width: 120 },
    { field: "quantidadeRestante", headerName: "Qtd. Restante", width: 140 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "dataHora",
      headerName: "Data/Hora",
      width: 180,
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 150,
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton onClick={() => handleOpenDetails(params.row)}>
            <VisibilityIcon />
          </IconButton>
          {["Aberta", "Parcial"].includes(params.row.status) &&
            params.row.id.length > 2 && (
              <>
                <IconButton onClick={() => handleOpenCancel(params.row)}>
                  <CancelIcon color="error" />
                </IconButton>
                <IconButton onClick={() => handleOpenExecute(params.row)}>
                  <PlayArrowIcon sx={{ color: "#ccf729" }} />
                </IconButton>
              </>
            )}
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Verifica se há ordens no localStorage
        const localData = localStorage.getItem("orders");
        if (localData) {
          const parsedData = JSON.parse(localData);
          setOrders(parsedData);
          return;
        }

        // Se não tiver no localStorage, busca da API
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Erro ao buscar ordens");
        const data = await response.json();
        localStorage.setItem("orders", JSON.stringify(data));
        setOrders(data);
      } catch (error) {
        console.error("Erro ao carregar ordens:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const { id, instrumento, status, lado } = filtros;
    const filtrado = orders.filter((order) => {
      return (
        (!id || order.id.toString().includes(id)) &&
        (!instrumento || order.instrumento.includes(instrumento)) &&
        (!status || order.status === status) &&
        (!lado || order.lado === lado)
      );
    });
    setFilteredOrders(filtrado);
  }, [filtros, orders]);

  return (
    <Box p={4} pb={12} sx={{backgroundColor: "#2c290a"}}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography
          variant="h4"
          gutterBottom
          mt={2}
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          Visualização de Ordens
        </Typography>

        <Box component="img" src="/base-exchange.svg" alt="Logo do Projeto" />
      </Box>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: "white"}}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          flexWrap="wrap"
        >
          <TextField
            label="ID"
            value={filtros.id}
            size="small"
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, id: e.target.value }))
            }
          />
          <TextField
            label="Instrumento"
            value={filtros.instrumento}
            size="small"
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, instrumento: e.target.value }))
            }
          />
          <TextField
            label="Status"
            select
            value={filtros.status}
            size="small"
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, status: e.target.value }))
            }
            sx={{ minWidth: 100, flexGrow: 1 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Aberta">Aberta</MenuItem>
            <MenuItem value="Parcial">Parcial</MenuItem>
            <MenuItem value="Cancelada">Cancelada</MenuItem>
          </TextField>
          <TextField
            label="Lado"
            select
            value={filtros.lado}
            size="small"
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, lado: e.target.value }))
            }
            sx={{ minWidth: 100, flexGrow: 1 }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Compra">Compra</MenuItem>
            <MenuItem value="Venda">Venda</MenuItem>
          </TextField>
          <Button
            style={{ backgroundColor: "#ccf729", color: "black" }}
            onClick={() => setCreateModalOpen(true)}
          >
            Criar Ordem
          </Button>
        </Stack>
      </Paper>

      <Box height={650} sx={{backgroundColor: "white", borderRadius: "6px"}} p={1}>
        <DataGrid
          rows={filteredOrders}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>
      {selectedOrder && (
        <OrderDetails
          open={open}
          onClose={() => setOpen(false)}
          order={selectedOrder}
        />
      )}
      <CreateOrderModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateOrder}
      />
      <CancelOrderModal
        open={cancelModalOpen}
        order={orderToCancel}
        onClose={() => setCancelModalOpen(false)}
        onCancelConfirmed={handleCancelConfirmed}
      />
      <ExecuteOrderModal
        open={executeModalOpen}
        order={orderToExecute}
        onClose={() => setExecuteModalOpen(false)}
        onExecuteConfirmed={handleExecuteConfirmed}
      />
    </Box>
  );
}
