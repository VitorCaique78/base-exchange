import { Order } from "@/types/order";


const STORAGE_KEY = "orders";

export const getOrdersFromStorage = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveOrdersToStorage = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};
