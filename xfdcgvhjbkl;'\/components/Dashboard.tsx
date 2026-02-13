
import React, { useMemo, useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Transaction } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { getFinancialAdvice } from '../services/geminiService';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [aiAdvice, setAiAdvice] = useState<string>("Analyzing your finances...");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(true);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return {
      balance: income - expense,
      income,
      expense
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    // Group last 7 days for trend
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const inc = dayTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const exp = dayTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      return { date: date.slice(5), income: inc, expense: exp };
    });
  }, [transactions]);

  const expenseBreakdown = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  useEffect(() => {
    if (transactions.length === 0) {
      setAiAdvice("Start adding transactions in Rand to get personalized financial insights!");
      setIsLoadingAdvice(false);
      return;
    }
    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      const advice = await getFinancialAdvice(transactions);
      setAiAdvice(advice);
      setIsLoadingAdvice(false);
    };
    fetchAdvice();
  }, [transactions]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform">
            <Wallet className="w-16 h-16" />
          </div>
          <p className="text-primary-100 text-sm font-medium">Total Balance</p>
          <h2 className="text-3xl font-bold mt-1">R{stats.balance.toLocaleString()}</h2>
          <div className="flex items-center mt-4 text-xs bg-white/10 w-fit px-2 py-1 rounded-full backdrop-blur-md">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>Wealth Tracker</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Income</p>
              <h2 className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                +R{stats.income.toLocaleString()}
              </h2>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
              <ArrowUpRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Expenses</p>
              <h2 className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">
                -R{stats.expense.toLocaleString()}
              </h2>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-xl">
              <ArrowDownRight className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & AI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white">Cash Flow</h3>
            <div className="flex space-x-2 text-xs text-slate-500">
              <div className="flex items-center"><div className="w-3 h-3 bg-primary-500 rounded-full mr-1"></div> Income (R)</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-rose-500 rounded-full mr-1"></div> Expenses (R)</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number) => [`R${value.toFixed(2)}`, '']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="income" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Financial Advisor */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <Sparkles className="w-48 h-48" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold">Focus AI</h3>
            </div>
            <p className={`text-slate-300 text-sm leading-relaxed min-h-[120px] ${isLoadingAdvice ? 'animate-pulse' : ''}`}>
              "{aiAdvice}"
            </p>
          </div>
          <button className="mt-6 w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-medium transition-colors border border-white/10">
            Smart Recommendations
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Expense Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseBreakdown.slice(0, 5)}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis hide />
                <Tooltip 
                   formatter={(value: number) => [`R${value.toFixed(2)}`, '']}
                   contentStyle={{ borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Mini List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.length > 0 ? transactions.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    {CATEGORY_ICONS[t.category] || CATEGORY_ICONS['Other']}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{t.description}</p>
                    <p className="text-xs text-slate-500">{t.category} • {t.date}</p>
                  </div>
                </div>
                <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? '+' : '-'}R{t.amount.toFixed(2)}
                </p>
              </div>
            )) : (
              <p className="text-center py-8 text-slate-400">No transactions yet. Start by adding one!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
