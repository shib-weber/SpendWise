import React, { useState, useEffect } from 'react';
import { X, Tag, IndianRupee, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const ExpenseModal = ({ isOpen, onClose, accounts, onSave, selectedDate, type: initialType = 'expense' }) => {
  // Define the initial state structure for easy resetting
  const initialState = {
    title: '',
    amount: '',
    category: 'General',
    account_id: accounts[0]?.id || '',
    date: selectedDate,
    type: initialType 
  };

  const [formData, setFormData] = useState(initialState);

  // Update logic when modal opens or date/type changes
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ 
        ...prev, 
        date: selectedDate,
        type: initialType,
        account_id: accounts[0]?.id || '' 
      }));
    }
  }, [selectedDate, accounts, isOpen, initialType]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormData(initialState); // Reset when clicking X or Cancel
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.account_id) return alert("Please select an account");
    
    // Send data to parent
    onSave({ ...formData, amount: parseFloat(formData.amount) });
    
    // RESET FORM for next use
    setFormData(initialState);
    
    onClose();
  };

  const isIncome = formData.type === 'income';

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Toggle between Expense and Income */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button 
            type="button"
            onClick={() => setFormData({...formData, type: 'expense'})}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${!isIncome ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            <ArrowDownCircle size={16}/> Expense
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, type: 'income'})}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all ${isIncome ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
          >
            <ArrowUpCircle size={16}/> Income
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{isIncome ? 'Add Money' : 'Add Expense'}</h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
            <X size={20}/>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              required 
              type="text" 
              placeholder={isIncome ? "Source (e.g. Salary, Gift)" : "What did you spend on?"} 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          
          <div className="relative">
            <IndianRupee className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isIncome ? 'text-green-500' : 'text-slate-400'}`} size={18} />
            <input 
              required 
              type="number" 
              placeholder="0.00" 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.amount} 
              onChange={e => setFormData({...formData, amount: e.target.value})} 
            />
          </div>

          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              required 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl appearance-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.account_id} 
              onChange={e => setFormData({...formData, account_id: parseInt(e.target.value)})}
            >
              <option value="" disabled>Select Account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} (₹{acc.balance})</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
              isIncome ? 'bg-green-600 shadow-green-100 hover:bg-green-700' : 'bg-blue-600 shadow-blue-100 hover:bg-blue-700'
            }`}
          >
            Confirm {isIncome ? 'Income' : 'Expense'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;