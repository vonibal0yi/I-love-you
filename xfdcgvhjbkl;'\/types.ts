
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  description: string;
}

export interface FinancialStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
}

export enum Tab {
  HOME = 'HOME',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  SETTINGS = 'SETTINGS'
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface TransactionFormData {
  amount: string;
  category: string;
  description: string;
  date: string;
}
