import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { ChevronLeft, ChevronRight, PieChart as PieIcon } from 'lucide-react';
import Navbar from '../components/Navbar'; 

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics = ({ expenses = [] }) => {
  // 1. Initialize state with current month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // 2. Filter ALL data once based on the selected month
  const filteredData = useMemo(() => {
    return expenses.filter(item => {
      // Logic: Matches "2026-04" with the start of "2026-04-24"
      return item.date && item.date.startsWith(selectedMonth);
    });
  }, [expenses, selectedMonth]);

  // 3. Calculate Stats and Pie Data from the filtered set
  const processedStats = useMemo(() => {
    const categories = {};
    let income = 0;
    let expense = 0;

    filteredData.forEach(item => {
      if (item.type === 'income') {
        income += item.amount;
      } else {
        expense += item.amount;
        const cat = item.title || 'Other';
        categories[cat] = (categories[cat] || 0) + item.amount;
      }
    });

    const pieData = Object.keys(categories).map((key, index) => ({
      name: key,
      value: categories[key],
      color: COLORS[index % COLORS.length] 
    }));

    return { pieData, income, expense };
  }, [filteredData]);

  const { pieData, income: totalIncome, expense: totalExpense } = processedStats;

  // 4. Bar Chart logic (Last 7 entries of the SELECTED month)
  const barData = useMemo(() => {
    return filteredData.slice(-7).map(item => ({
      name: item.title,
      amount: item.amount,
      type: item.type,
      fill: item.type === 'income' ? '#10b981' : '#3b82f6' 
    }));
  }, [filteredData]);

  // Helper to jump months
  const changeMonth = (offset) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const monthLabel = new Date(selectedMonth + "-01").toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex-1 p-4 md:p-8 pt-24 md:pt-8 md:ml-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Header & Month Picker */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Financial Insights</h1>
              <p className="text-gray-500 text-sm">Reviewing activity for <span className="text-blue-600 font-bold">{monthLabel}</span></p>
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm w-fit">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600"><ChevronLeft size={20}/></button>
              <span className="px-4 font-bold text-slate-700 min-w-[140px] text-center">{monthLabel}</span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600"><ChevronRight size={20}/></button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Monthly Income</p>
              <p className="text-xl md:text-3xl font-black text-emerald-500">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Monthly Expenses</p>
              <p className="text-xl md:text-3xl font-black text-rose-500">₹{totalExpense.toLocaleString()}</p>
            </div>
          </div>

          {filteredData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
                    Expense Distribution
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                          {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                    Recent Activity
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                        <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={25}>
                          {barData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Net Balance Card */}
              <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-xl">
                <div>
                  <h4 className="text-slate-400 font-medium text-sm md:text-lg uppercase tracking-wider">Net Savings</h4>
                  <p className="text-3xl md:text-5xl font-black mt-2 text-white">₹{(totalIncome - totalExpense).toLocaleString()}</p>
                </div>
                <div className="mt-6 md:mt-0 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                  <div className="text-blue-300 text-[10px] uppercase tracking-widest font-black">Efficiency</div>
                  <div className="text-xl md:text-2xl font-bold">
                    {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
              <PieIcon className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-medium">No data recorded for this month.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;