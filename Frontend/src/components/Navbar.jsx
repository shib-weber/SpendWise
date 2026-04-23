import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Settings, Zap } from 'lucide-react';

const Navbar = () => {
  // Common styles for nav buttons
  const navItemClass = ({ isActive }) => 
    `p-4 rounded-2xl transition-all duration-300 group ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'
    }`;

  return (
    <nav className="fixed left-0 top-0 h-full w-24 bg-white border-r border-slate-100 flex flex-col items-center py-10 z-50">
      
      {/* Brand Logo */}
      <div className="mb-12">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Zap size={24} fill="currentColor" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-6">
        <NavLink to="/dashboard" className={navItemClass} title="Dashboard">
          <LayoutDashboard size={24} />
        </NavLink>

        <NavLink to="/analytics" className={navItemClass} title="Analytics">
          <PieChart size={24} />
        </NavLink>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-6">
        <NavLink to="/settings" className={navItemClass} title="Settings">
          <Settings size={24} />
        </NavLink>
        
        {/* User Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white ring-2 ring-slate-50 overflow-hidden cursor-pointer hover:ring-blue-100 transition-all">
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