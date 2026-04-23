import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Settings, Zap } from 'lucide-react';

const Navbar = () => {
  const navItemClass = ({ isActive }) => 
    `p-3 md:p-4 rounded-2xl transition-all duration-300 group ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full h-16 md:h-full md:w-24 bg-white border-b md:border-b-0 md:border-r border-slate-100 flex flex-row md:flex-col items-center justify-between px-4 md:px-0 md:py-10 z-50">
      
      {/* Brand Logo */}
      <div className="md:mb-12">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Zap size={20} md:size={24} fill="currentColor" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-row md:flex-col gap-2 md:gap-6">
        <NavLink to="/dashboard" className={navItemClass} title="Dashboard">
          <LayoutDashboard size={22} md:size={24} />
        </NavLink>

        <NavLink to="/analytics" className={navItemClass} title="Analytics">
          <PieChart size={22} md:size={24} />
        </NavLink>
        
        {/* Settings moved here for mobile layout consistency */}
        <NavLink to="/settings" className={`md:hidden ${navItemClass({isActive: false})}`} title="Settings">
           <Settings size={22} />
        </NavLink>
      </div>

      {/* Bottom Actions - Hidden on mobile or restructured */}
      <div className="flex flex-row md:flex-col items-center gap-6">
        <NavLink to="/settings" className={`hidden md:flex ${navItemClass}`} title="Settings">
          <Settings size={24} />
        </NavLink>
        
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 border-2 border-white ring-2 ring-slate-50 overflow-hidden cursor-pointer hover:ring-blue-100 transition-all">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shib" 
            alt="User" 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;