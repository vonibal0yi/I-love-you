
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Settings as SettingsIcon,
  Plus
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Settings from './components/Settings';
import TransactionModal from './components/TransactionModal';
import { Tab, Transaction, TransactionFormData } from './types';
import { INITIAL_TRANSACTIONS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  );
  
  // User Profile persistence including profile picture
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { 
      username: 'Alex Johnson', 
      email: 'alex.johnson@example.com',
      profilePic: null 
    };
  });

  // Data persistence: Initialize from localStorage or empty array
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    try {
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch (e) {
      console.error("Failed to parse stored transactions", e);
      return INITIAL_TRANSACTIONS;
    }
  });
  
  const [modalType, setModalType] = useState<'income' | 'expense' | null>(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const handleUpdateProfile = (newUsername: string, newEmail: string, newProfilePic: string | null) => {
    setProfile({ username: newUsername, email: newEmail, profilePic: newProfilePic });
  };

  const handleAddTransaction = (data: TransactionFormData) => {
    if (!modalType) return;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
      date: data.date,
      type: modalType
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <Dashboard transactions={transactions} />;
      case Tab.INCOME:
        return (
          <TransactionList 
            type="income" 
            transactions={transactions} 
            onAddClick={() => setModalType('income')}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case Tab.EXPENSE:
        return (
          <TransactionList 
            type="expense" 
            transactions={transactions} 
            onAddClick={() => setModalType('expense')}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case Tab.SETTINGS:
        return (
          <Settings 
            theme={theme} 
            onToggleTheme={toggleTheme} 
            username={profile.username}
            email={profile.email}
            profilePic={profile.profilePic}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  const avatarUrl = profile.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`;

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 hidden md:flex flex-col z-40">
        <div className="p-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">F</div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Focus Finance</h1>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {[
            { id: Tab.HOME, icon: LayoutDashboard, label: 'Overview' },
            { id: Tab.INCOME, icon: ArrowUpCircle, label: 'Income' },
            { id: Tab.EXPENSE, icon: ArrowDownCircle, label: 'Expenses' },
            { id: Tab.SETTINGS, icon: SettingsIcon, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button 
            onClick={() => setModalType('expense')}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-bold shadow-lg hover:shadow-primary-500/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>New Transaction</span>
          </button>
        </div>
      </aside>

      {/* Bottom Nav - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex justify-around p-4 z-40">
        {[
          { id: Tab.HOME, icon: LayoutDashboard },
          { id: Tab.INCOME, icon: ArrowUpCircle },
          { id: Tab.EXPENSE, icon: ArrowDownCircle },
          { id: Tab.SETTINGS, icon: SettingsIcon },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-3 rounded-2xl transition-all ${
              activeTab === item.id 
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
              : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-4 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <div className="md:hidden flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">F</div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Focus Finance</h1>
          </div>
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              {activeTab === Tab.HOME ? `Welcome, ${profile.username.split(' ')[0]}` : activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your wealth with precision.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900">
               <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Modals */}
      <TransactionModal 
        isOpen={modalType !== null} 
        onClose={() => setModalType(null)}
        type={modalType || 'expense'}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
};

export default App;
