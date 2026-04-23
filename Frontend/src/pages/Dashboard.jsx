import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Plus, 
  Wallet, 
  Landmark, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Trash2, 
  LogOut, 
  ArrowUpCircle, 
  ArrowDownCircle,
  MoreVertical
} from 'lucide-react';
import ExpenseModal from '../components/ExpenseModal';
import Navbar from '../components/Navbar';

const Dashboard = ({ onLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [newAcc, setNewAcc] = useState({ name: '', balance: 0, category: 'savings' });

  useEffect(() => { 
    loadData(); 
  }, [selectedDate]);

  const loadData = async () => {
    try {
      const [accRes, expRes] = await Promise.all([
        api.getAccounts(), 
        api.getExpenses(selectedDate)
      ]);
      setAccounts(accRes.data);
      setExpenses(expRes.data);
    } catch (err) { 
      console.error("Sync Error:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  const handleCreateAccount = async () => {
    try {
      await api.addAccount(newAcc);
      setIsAccountModalOpen(false);
      setNewAcc({ name: '', balance: 0, category: 'savings' });
      loadData();
    } catch (err) {
      alert("Error creating account. Ensure the name is unique.");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Delete this transaction? This will revert your account balance.")) {
      await api.deleteExpense(id);
      loadData();
    }
  };

  const handleDeleteAccount = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This will permanently remove all associated transaction history.`
    );
    
    if (confirmed) {
      try {
        await api.deleteAccount(id);
        loadData();
      } catch (err) {
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsExpenseModalOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto p-4 md:p-6 lg:max-w-6xl min-h-screen bg-gray-50/50">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 mt-14 sm:mt-0 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">SpendWise</h1>
            <p className="text-sm text-gray-500 font-medium">Your personalized financial overview</p>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all flex-1 sm:flex-initial">
              <CalendarIcon size={16} className="text-blue-500 mr-2 shrink-0" />
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                className="outline-none text-xs md:text-sm font-medium bg-transparent w-full"
              />
            </div>

            <button 
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Accounts Grid - Horizontal scroll on very small screens, 2-3 columns elsewhere */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors group relative">
              <button 
                onClick={() => handleDeleteAccount(acc.id, acc.name)}
                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl md:opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>

              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 group-hover:bg-blue-50 rounded-2xl text-slate-400 group-hover:text-blue-600 transition-colors">
                  {acc.category === 'cash' ? <Wallet size={18}/> : acc.category === 'stocks' ? <TrendingUp size={18}/> : <Landmark size={18}/>}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{acc.category}</span>
              </div>
              <h3 className="text-gray-500 font-medium text-xs md:text-sm">{acc.name}</h3>
              <p className="text-xl md:text-2xl font-black text-gray-900">₹{acc.balance.toLocaleString()}</p>
            </div>
          ))}
          
          <button 
            onClick={() => setIsAccountModalOpen(true)}
            className="border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-transparent min-h-[140px]"
          >
            <Plus size={24} className="mb-1" />
            <span className="font-bold text-xs uppercase tracking-tight">New Account</span>
          </button>
        </div>

        {/* Transactions Ledger */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 md:p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-lg md:text-xl text-gray-900">Daily Ledger</h2>
              <p className="text-[10px] md:text-xs text-gray-400">Transactions for {new Date(selectedDate).toLocaleDateString()}</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <button 
                onClick={() => openModal('income')} 
                className="flex-1 sm:flex-none justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 md:px-5 py-3 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all"
              >
                <ArrowUpCircle size={16}/> Add Money
              </button>
              <button 
                onClick={() => openModal('expense')} 
                className="flex-1 sm:flex-none justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-3 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
              >
                <Plus size={16}/> Add Expense
              </button>
            </div>
          </div>

          {/* Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-8 py-4">Description</th>
                  <th className="px-8 py-4 text-center">Type</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                  <th className="px-8 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.length > 0 ? expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-800">{exp.title}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">{exp.category}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        exp.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {exp.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`font-black ${exp.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {exp.type === 'income' ? '+' : '-'}₹{exp.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button onClick={() => handleDeleteExpense(exp.id)} className="text-gray-200 group-hover:text-red-400 transition-colors">
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          </div>

          {/* Card View (Visible only on mobile) */}
          <div className="md:hidden divide-y divide-gray-50">
            {expenses.length > 0 ? expenses.map(exp => (
              <div key={exp.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${exp.type === 'income' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                    {exp.type === 'income' ? <ArrowUpCircle size={18}/> : <ArrowDownCircle size={18}/>}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{exp.title}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">{exp.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-black text-sm ${exp.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {exp.type === 'income' ? '+' : '-'}₹{exp.amount.toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteExpense(exp.id)} className="text-gray-300 active:text-red-500">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            )) : null}
          </div>

          {expenses.length === 0 && (
            <div className="text-center py-16 text-gray-300 font-medium">
              No records for this date.
            </div>
          )}
        </div>

        {/* Responsive Modals are usually handled within the Modal components via Tailwind, 
            but ensured the Create Account modal is responsive here */}
        {isAccountModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
              <h2 className="text-xl md:text-2xl font-bold mb-1">Create Account</h2>
              <p className="text-gray-400 text-sm mb-6">Where is this money stored?</p>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="e.g. HDFC Bank, Cash Wallet" 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                  value={newAcc.name}
                  onChange={e => setNewAcc({...newAcc, name: e.target.value})} 
                />
                <input 
                  type="number" 
                  placeholder="Initial Balance (₹)" 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm" 
                  value={newAcc.balance}
                  onChange={e => setNewAcc({...newAcc, balance: parseFloat(e.target.value) || 0})} 
                />
                <select 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-sm" 
                  value={newAcc.category}
                  onChange={e => setNewAcc({...newAcc, category: e.target.value})}
                >
                  <option value="savings">Bank/Savings</option>
                  <option value="cash">Physical Cash</option>
                  <option value="stocks">Investments</option>
                </select>
                <div className="flex flex-col gap-3 pt-4">
                  <button onClick={handleCreateAccount} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform">
                    Create Account
                  </button>
                  <button onClick={() => setIsAccountModalOpen(false)} className="w-full py-2 text-gray-400 font-medium text-sm">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ExpenseModal 
          isOpen={isExpenseModalOpen} 
          onClose={() => setIsExpenseModalOpen(false)} 
          accounts={accounts} 
          onSave={async (data) => { 
            await api.addExpense(data); 
            setIsExpenseModalOpen(false); 
            loadData(); 
          }} 
          selectedDate={selectedDate}
          type={modalType} 
        />
      </div>
    </>
  );
};

export default Dashboard;