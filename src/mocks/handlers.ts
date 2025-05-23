import { rest, RestRequest } from "msw";
import {
  getOrdersFromStorage,
  saveOrdersToStorage,
} from "@/utils/localStorageOrders";
import { Order } from "@/types/order";

// Inicializa a "base de dados"
let orders: Order[] = getOrdersFromStorage();

export const handlers = [
  // Criar nova ordem
  rest.post("/api/orders/create", async (req: RestRequest, res, ctx) => {
    const newOrder: Order = await req.json(); // <-- Tipagem explícita aqui
    orders.unshift(newOrder);
    saveOrdersToStorage(orders);
    return res(ctx.status(201), ctx.json(newOrder));
  }),

  // Cancelar ordem
  rest.post("/api/orders/:id/cancel", async (req: RestRequest, res, ctx) => {
    const { id } = req.params;
    const index = orders.findIndex((order) => order.id === id);

    if (index === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Ordem não encontrada" })
      );
    }

    const order = orders[index];
    const isCancellable =
      order.status === "Aberta" || order.status === "Parcial";

    if (!isCancellable) {
      return res(
        ctx.status(400),
        ctx.json({
          message:
            "Apenas ordens 'Abertas' ou 'Parciais' podem ser canceladas.",
        })
      );
    }

    const updatedOrder = { ...order, status: "Cancelada" };
    orders[index] = updatedOrder;
    saveOrdersToStorage(orders);

    return res(ctx.status(200), ctx.json(updatedOrder));
  }),

  //Simular execução de ordem
  rest.post("/api/orders/execute", async (req, res, ctx) => {
    const { order, quantidade, precoUnitario, side } = await req.json();

    if (!order || quantidade <= 0 || precoUnitario < order.preco) {
      return res(
        ctx.status(400),
        ctx.json({ message: "Dados inválidos para execução" })
      );
    }

    const index = orders.findIndex((o) => o.id === order.id);
    if (index === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Ordem não encontrada" })
      );
    }

    const ordemOriginal = orders[index];

    // Atualiza quantidadeRestante da ordem original
    let novaQuantidadeRestante = ordemOriginal.quantidadeRestante;
    if (side === "Compra") {
      novaQuantidadeRestante += quantidade;
    } else {
      novaQuantidadeRestante -= quantidade;
    }

    if (novaQuantidadeRestante < 0) {
      // Não pode ser negativa
      novaQuantidadeRestante = 0;
    }

    // Atualiza status da ordem original
    const novoStatusOriginal =
      novaQuantidadeRestante === 0 ? "Executada" : "Parcial";

    const originalAtualizada = {
      ...ordemOriginal,
      quantidadeRestante: novaQuantidadeRestante,
      status: novoStatusOriginal,
    };

    // Função para gerar novo id único no formato idOriginal-N
    function gerarNovoId(baseId: string): string {
      const idsFiltrados = orders
        .map((o) => o.id)
        .filter((id) => id.startsWith(baseId + "-"));

      const sufixos = idsFiltrados
        .map((id) => {
          const partes = id.split("-");
          const ultimo = partes[partes.length - 1];
          const num = Number(ultimo);
          return isNaN(num) ? 0 : num;
        })
        .filter((n) => n > 0);

      const maxSufixo = sufixos.length ? Math.max(...sufixos) : 0;

      return `${baseId}-${maxSufixo + 1}`;
    }

    const novoId = gerarNovoId(ordemOriginal.id);

    // Nova ordem criada com quantidade = quantidade executada e quantidadeRestante = quantidade executada
    const novaOrdem = {
      ...ordemOriginal,
      id: novoId,
      quantidade: quantidade,
      quantidadeRestante: quantidade,
      preco: precoUnitario,
      status: "Executada",
      side,
    };

    // Atualiza array de ordens
    orders[index] = originalAtualizada;
    orders.push(novaOrdem);

    saveOrdersToStorage(orders);

    return res(
      ctx.status(200),
      ctx.json({ original: originalAtualizada, nova: novaOrdem })
    );
  }),
];
