import { render, fireEvent, screen } from "@testing-library/react";
import { Order } from "@/types/order";
import ExecuteOrderModal from "./ExecuteOrderModal";

const createOrder = (override: Partial<Order> = {}): Order => ({
  id: "123",
  instrumento: "PETR4",
  preco: 100,
  quantidade: 10,
  quantidadeRestante: 4,
  status: "Pendente",
  lado: "Compra",
  dataHora: "22/05/2025",
  ...override,
});

describe("ExecuteOrderModal", () => {
  it("permite execução se lado for Compra mesmo que quantidade seja maior que quantidade restante", async () => {
    const mockOrder = createOrder({ quantidadeRestante: 4, lado: "Compra" });
    const onExecuteConfirmed = jest.fn();

    render(
      <ExecuteOrderModal
        open
        order={mockOrder}
        onClose={() => {}}
        onExecuteConfirmed={onExecuteConfirmed}
      />
    );

    fireEvent.change(screen.getByLabelText(/Quantidade a Executar/i), {
      target: { value: "10" }, // maior que quantidadeRestante
    });

    fireEvent.change(screen.getByLabelText(/Preço Unitário/i), {
      target: { value: "150" }, // válido
    });

    const botaoExecutar = screen.getByRole("button", { name: /Executar/i });
    expect(botaoExecutar).toBeEnabled();
  });
});
