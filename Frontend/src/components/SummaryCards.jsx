import React, { useMemo } from 'react';
import { Wallet, TrendingUp, Landmark, ArrowUpRight } from 'lucide-react';

const SummaryCards = ({ accounts = [] }) => {
  // Map icons to categories for cleaner lookup
  const iconMap = {
    cash: { icon: <Wallet size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    stocks: { icon: <TrendingUp size={20} />, color: 'bg-purple-50 text-purple-600' },
    savings: { icon: <Landmark size={20} />, color: 'bg-blue-50 text-blue-600' },
    default: { icon: <Landmark size={20} />, color: 'bg-slate-50 text-slate-600' }
  };

  // Calculate total net worth across all accounts
  const totalBalance = useMemo(() => 
    accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0), 
  [accounts]);

  return (
    <div className="space-y-6">
      {/* Optional: Mini Net Worth Header inside the component */}
      <div className="flex items-end gap-2 px-1">
        <span className="text-sm font-medium text-slate-400 uppercase tracking-widest">Total Assets:</span>
        <span className="text-xl font-bold text-slate-900">₹{totalBalance.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {accounts.length > 0 ? (
          accounts.map((acc) => {
            const categoryKey = acc.category?.toLowerCase() || 'default';
            const theme = iconMap[categoryKey] || iconMap.default;

            return (
              <div 
                key={acc.id} 
                className="group relative bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-2xl transition-colors ${theme.color}`}>
                    {theme.icon}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                    {acc.category}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-slate-500 font-medium text-sm group-hover:text-blue-600 transition-colors">
                    {acc.name}
                  </h3>
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-black text-slate-900">
                      ₹{acc.balance?.toLocaleString() || '0'}
                    </p>
                    <ArrowUpRight size={14} className="text-slate-200 group-hover:text-blue-300 transition-colors" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State Placeholder */
          <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm font-medium">No accounts linked yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCards;