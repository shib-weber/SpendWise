import React from 'react';
import { ShieldCheck, Calendar, PieChart, Zap, ArrowRight } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Zap className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">SpendWise</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-16 pb-24 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Master your money, <br />one entry at a time.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
          The only expense tracker that lets you travel through your financial history. 
          Secure, personalized, and built for your future.
        </p>
        <button 
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
        >
          Get Started for Free <ArrowRight size={20} />
        </button>
      </header>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure OTP Access</h3>
              <p className="text-slate-500 leading-relaxed">
                Forget passwords. Access your data securely using your college email and a one-time password.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Financial Time Travel</h3>
              <p className="text-slate-500 leading-relaxed">
                Easily log expenses for past trips or future bills by simply navigating the calendar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <PieChart size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Accounts</h3>
              <p className="text-slate-500 leading-relaxed">
                Manage multiple accounts—from cash to savings—and watch your balances update in real-time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>&copy; 2026 SpendWise Tracker. Built for the Modern University Student.</p>
      </footer>
    </div>
  );
};

export default LandingPage;