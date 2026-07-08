import { CategoryType } from "@/features/financial/shared/types/CategoryType";

export const defaultCategories = [
  { name: "Vendas", type: CategoryType.REVENUE },
  { name: "Servicos", type: CategoryType.REVENUE },
  { name: "Outras receitas", type: CategoryType.REVENUE },
  { name: "Salarios", type: CategoryType.EXPENSE },
  { name: "Aluguel", type: CategoryType.EXPENSE },
  { name: "Fornecedores", type: CategoryType.EXPENSE },
  { name: "Impostos", type: CategoryType.EXPENSE },
  { name: "Outras despesas", type: CategoryType.EXPENSE },
] as const;
