import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, PieChart, Zap, ArrowRight, Download } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // 2. Capture the install prompt
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

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
        
        <div className="flex items-center gap-6">
          {/* Show Install Link in Nav for Desktop/Mobile if available */}
          {installPrompt && !isInstalled && (
            <button 
              onClick={handleInstallClick}
              className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Download size={16} /> Install App
            </button>
          )}
          <button 
            onClick={onGetStarted}
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-16 pb-24 text-center max-w-4xl mx-auto">
        {/* Status Badge */}
        {isInstalled && (
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold mb-8 animate-fade-in">
            <ShieldCheck size={14} /> Running on Desktop
          </div>
        )}

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Master your money, <br />one entry at a time.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
          The only expense tracker that lets you travel through your financial history. 
          Secure, personalized, and built for your future.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-lg shadow-blue-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </button>

          {/* Prominent Install Button for Mobile Users */}
          {installPrompt && !isInstalled && (
            <button 
              onClick={handleInstallClick}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-10 py-5 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              <Download size={20} /> Install App
            </button>
          )}
        </div>
      </header>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure OTP Access</h3>
              <p className="text-slate-500 leading-relaxed">
                Forget passwords. Access your data securely using your university email and a one-time password.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Financial Time Travel</h3>
              <p className="text-slate-500 leading-relaxed">
                Easily log expenses for past trips or future bills by simply navigating the calendar.
              </p>
            </div>

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

      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>&copy; 2026 SpendWise Tracker. Built for the Modern Student.</p>
      </footer>
    </div>
  );
};

export default LandingPage;