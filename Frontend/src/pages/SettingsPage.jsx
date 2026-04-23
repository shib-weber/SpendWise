import React from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  ShieldCheck, 
  Zap, 
  BrainCircuit, 
  LineChart,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const SettingsPage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 pt-24 md:pt-8 md:ml-24">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <SettingsIcon className="text-blue-600" />
              Settings
            </h1>
            <p className="text-gray-500 text-sm">Manage your account and explore upcoming capabilities.</p>
          </div>

          <div className="space-y-6">
            
            {/* General Settings Section */}
            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User size={18} className="text-slate-400" />
                Account Preferences
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Currency Display</p>
                    <p className="text-xs text-gray-400">Default currency for all accounts</p>
                  </div>
                  <span className="font-bold text-blue-600 bg-white px-4 py-1 rounded-xl shadow-sm border border-slate-100">INR (₹)</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl opacity-60 cursor-not-allowed">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Push Notifications</p>
                    <p className="text-xs text-gray-400">Alerts for overspending</p>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </section>

            {/* UPCOMING FEATURES: AI & Advanced Analysis */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-500/30">
                  <Sparkles size={12} />
                  Under Brewing
                </div>

                <h2 className="text-2xl md:text-3xl font-black mb-4">The Future of SpendWise</h2>
                <p className="text-slate-300 text-sm md:text-base max-w-lg mb-8">
                  We're building an advanced AI engine to analyze your spending habits, predict future balances, and provide personalized saving strategies.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Feature Card 1 */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl group cursor-help">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4">
                      <BrainCircuit size={20} />
                    </div>
                    <h4 className="font-bold text-white mb-1">AI Financial Advisor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Real-time suggestions to optimize your subscriptions and monthly bills.
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                      Coming in v2.0 <ArrowRight size={10} />
                    </div>
                  </div>

                  {/* Feature Card 2 */}
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl group cursor-help">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
                      <LineChart size={20} />
                    </div>
                    <h4 className="font-bold text-white mb-1">Predictive Analytics</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Deep-dive reports showing where your money goes 6 months into the future.
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">
                      Beta Launch: June <ArrowRight size={10} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Links */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
              <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
                <button className="hover:text-blue-600 transition-colors">Terms of Service</button>
              </div>
              <p className="text-slate-400 text-[10px] font-medium italic">
                SpendWise Version 1.0.4 (Stable)
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;