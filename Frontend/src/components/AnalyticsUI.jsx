import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import Navbar from '../components/Navbar'; 

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics = ({ expenses = [] }) => {
  
  // 1. Split data into Income and Expenses
  const processedData = useMemo(() => {
    const categories = {};
    let totalIncome = 0;
    let totalExpense = 0;

    expenses.forEach(item => {
      if (item.type === 'income') {
        totalIncome += item.amount;
      } else {
        totalExpense += item.amount;
        // Only categorize expenses for the Pie Chart
        const cat = item.title || 'Other';
        categories[cat] = (categories[cat] || 0) + item.amount;
      }
    });

    const pieData = Object.keys(categories).map((key, index) => ({
      name: key,
      value: categories[key],
      color: COLORS[index % COLORS.length] 
    }));

    return { pieData, totalIncome, totalExpense };
  }, [expenses]);

  const { pieData, totalIncome, totalExpense } = processedData;

  // 2. Prepare data for the Bar Chart (Comparison)
  // We'll show the last 7 transactions, distinguishing income vs expense visually
  const barData = useMemo(() => {
    return expenses.slice(-7).map(item => ({
      name: item.title,
      amount: item.amount,
      type: item.type,
      // Dynamic color: Green for income, Red/Blue for expense
      fill: item.type === 'income' ? '#10b981' : '#3b82f6' 
    }));
  }, [expenses]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex-1 ml-24 p-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Insights</h1>
            <p className="text-gray-500 text-lg">Comparing your cash flow and habits.</p>
          </div>

          {/* Top Level Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Income</p>
              <p className="text-3xl font-black text-emerald-500">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Expenses</p>
              <p className="text-3xl font-black text-rose-500">₹{totalExpense.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Pie Chart: Expense Distribution */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-rose-500 rounded-full"></span>
                Expense Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-6 border-t border-slate-50 pt-6">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="flex-1 truncate">{entry.name}</span>
                    <span className="text-slate-400 font-medium">₹{entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart: Recent Cash Flow */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                Recent Cash Flow
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}> 
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#94a3b8' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#94a3b8' }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={35}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-[10px] uppercase tracking-widest font-bold px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-emerald-600">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-blue-600">Expense</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card: Net Balance */}
          <div className="mt-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-xl">
            <div className="text-center md:text-left">
              <h4 className="text-slate-400 font-medium text-lg uppercase tracking-wider">Net Savings (Monthly)</h4>
              <p className="text-5xl font-black mt-2 text-white">
                ₹{(totalIncome - totalExpense).toLocaleString()}
              </p>
            </div>
            <div className="mt-6 md:mt-0 bg-white/5 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 text-center">
                <div className="text-blue-400 text-xs uppercase tracking-widest font-black mb-1">Savings Rate</div>
                <div className="text-2xl font-bold">
                  {totalIncome > 0 
                    ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) 
                    : 0}%
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;