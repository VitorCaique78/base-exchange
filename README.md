# 🧾 Projeto: Simulador de Execução de Ordens

Este projeto é um **simulador de Gerenciamento de Ordens**, desenvolvido em **React + TypeScript**, utilizando **Material UI** como biblioteca de componentes. As ordens podem ser simuladas, divididas e atualizadas dinamicamente, com persistência no `localStorage`.

---

## 🚀 Funcionalidades

- Visualização de ordens com preço, quantidade e quantidade restante.
- Simulação de execução de ordens com validação:
  - O preço unitário da nova ordem deve ser maior ou igual ao original.
  - A nova ordem mantém os dados principais da original, alterando apenas `preço` e `quantidade`.
  - Ao executar, a quantidade da ordem original é atualizada conforme o lado da ordem:
    - **Compra**: soma a nova quantidade.
    - **Venda**: subtrai a nova quantidade.
  - Marcação automática de ordens como "Executada" quando `quantidadeRestante` for 0.
- Validação robusta usando **Zod** para garantir integridade dos dados.
- Testes automatizados utilizando **Jest**, **React Testing Library** e **MSW** para simulação de requisições API.

---

## 🛠️ Tecnologias Utilizadas

- **React** (com hooks)
- **TypeScript**
- **Material UI (v5+)**
- **Jest** + **@testing-library/react**
- **localStorage** para persistência local
- **Custom Theme (Material UI)**

---

## 📁 Estrutura de Pastas (simplificada)

```
src/
├── components/
│   ├── ExecuteOrderModal/
│   │   ├── ExecuteOrderModal.tsx
│   │   └── ExecuteOrderModal.test.tsx
│   └── CreateOrderModal/
├── pages/
│   └── index.tsx
├── types/
│   └── order.ts
├── theme.ts

```

---

## 📦 Instalação

```bash
npm install
npm run dev
```

---

## ✅ Testes

```bash
npm run test
```