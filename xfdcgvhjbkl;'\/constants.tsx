
import React from 'react';
import { Transaction } from './types';
import { 
  Briefcase, 
  ShoppingBag, 
  Coffee, 
  Home, 
  Utensils, 
  Car, 
  Zap, 
  PlusCircle, 
  TrendingUp,
  LayoutDashboard,
  Wallet,
  Settings,
  CreditCard
} from 'lucide-react';

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Salary': <Briefcase className="w-5 h-5" />,
  'Freelance': <Briefcase className="w-5 h-5 text-emerald-500" />,
  'Food': <Utensils className="w-5 h-5 text-orange-500" />,
  'Utilities': <Zap className="w-5 h-5 text-yellow-500" />,
  'Transport': <Car className="w-5 h-5 text-blue-500" />,
  'Coffee': <Coffee className="w-5 h-5 text-amber-700" />,
  'Rent': <Home className="w-5 h-5 text-indigo-500" />,
  'Shopping': <ShoppingBag className="w-5 h-5 text-pink-500" />,
  'Other': <CreditCard className="w-5 h-5 text-slate-500" />,
};

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'];
export const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Utilities', 'Transport', 'Coffee', 'Shopping', 'Health', 'Other'];
