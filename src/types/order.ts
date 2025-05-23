export interface Order {
  id: string;
  instrumento: string;
  status: string;
  lado: string;
  dataHora: string;
  preco: number;
  quantidade: number;
  quantidadeRestante: number;
}
