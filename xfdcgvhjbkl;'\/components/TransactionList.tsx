
import React, { useState } from 'react';
import { Search, Filter, Plus, Trash2 } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface TransactionListProps {
  type: TransactionType;
  transactions: Transaction[];
  onAddClick: () => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ type, transactions, onAddClick, onDeleteTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTransactions = transactions
    .filter(t => t.type === type)
    .filter(t => 
      (selectedCategory === 'All' || t.category === selectedCategory) &&
      (t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
       t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const categories = ['All', ...Array.from(new Set(transactions.filter(t => t.type === type).map(t => t.category)))];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">{type}s</h2>
        <button 
          onClick={onAddClick}
          className={`flex items-center px-6 py-2 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 ${
            type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add {type}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700 overflow-x-auto">
          {filteredTransactions.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Transaction</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount (R)</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mr-3">
                          {CATEGORY_ICONS[t.category] || CATEGORY_ICONS['Other']}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.category}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.date}</td>
                    <td className={`px-6 py-4 text-right font-bold ${type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {type === 'income' ? '+' : '-'}R{t.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDeleteTransaction(t.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <p>No {type}s found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
