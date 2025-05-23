import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateOrderModal from "./CreateOrderModal";

describe("CreateOrderModal", () => {
  const onSave = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    onSave.mockClear();
    onClose.mockClear();

    // Mock global fetch para todas as chamadas no teste
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            id: "123",
            instrumento: "PETR4",
            lado: "Compra",
            preco: 15.5,
            quantidade: 100,
            quantidadeRestante: 100,
            status: "Aberta",
            dataHora: "22/05/2025",
          }),
      } as Response)
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("deve chamar onSave com os dados da ordem se o formulário for válido", async () => {
    render(<CreateOrderModal open={true} onClose={onClose} onSave={onSave} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Instrumento/i), "PETR4");

    await user.clear(screen.getByLabelText(/Preço/i));
    await user.type(screen.getByLabelText(/Preço/i), "15.5");

    await user.clear(screen.getByLabelText(/Quantidade/i));
    await user.type(screen.getByLabelText(/Quantidade/i), "100");

    await user.click(screen.getByRole("button", { name: /Criar/i }));

    expect(onSave).toHaveBeenCalledTimes(1);

    const calledWith = onSave.mock.calls[0][0];
    expect(calledWith).toMatchObject({
      instrumento: "PETR4",
      lado: "Compra",
      preco: 15.5,
      quantidade: 100,
      status: "Aberta",
    });
  });
});
