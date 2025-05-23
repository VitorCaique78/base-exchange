import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import { Order } from "@/types/order";

const mockOrders: Order[] = Array.from({ length: 50 }, (_, index) => ({
  id: String(index + 1),
  instrumento: ["BTC/USD", "ETH/USD", "USD/BRL"][index % 3],
  lado: index % 2 === 0 ? "Compra" : "Venda",
  preco: parseFloat((1000 + index * 10).toFixed(2)),
  quantidade: 10 + (index % 5),
  quantidadeRestante: 5 + (index % 3),
  status: ["Aberta", "Parcial", "Cancelada"][index % 3],
  dataHora: dayjs(Date.now() - index * 1000000).format("DD/MM/YYYY"),
}));

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(mockOrders);
}
