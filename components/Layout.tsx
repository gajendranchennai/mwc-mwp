import React, { useState } from 'react';
import { View } from '../types';
import { LayoutDashboard, Wallet, Users, CheckSquare, MessageCircle, Image, Menu, X, LogOut, Phone, Clock } from 'lucide-react';

interface LayoutProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  children: React.ReactNode;
  onLogout: () => void;
  userName?: string;
}

const Logo: React.FC = () => (
  <div className="flex flex-col">
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 flex-shrink-0">
        {/* Custom Double Heart SVG inspired by MyWeddingClicks */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
           <path d="M30 35 C10 15, -10 45, 30 75 C70 45, 50 15, 30 35" fill="none" stroke="#ec4899" strokeWidth="8" strokeLinecap="round" />
           <path d="M60 35 C40 15, 20 45, 60 75 C100 45, 80 15, 60 35" fill="none" stroke="#ec4899" strokeWidth="8" strokeLinecap="round" className="opacity-90" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-gray-600 font-sans">My</span>
          <span className="text-brand-500 font-sans">Wedding</span>
          <span className="text-gray-600 font-sans">Planner</span>
        </div>
      </div>
    </div>
    <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-1 ml-12">Love in Every Detail</span>
  </div>
);

const NavItem: React.FC<{ view: View; current: View; label: string; icon: React.ReactNode; onClick: () => void }> = ({ view, current, label, icon, onClick }) => {
  const isActive = view === current;
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center space-x-3 px-6 py-4 transition-all duration-200 border-l-4 ${
        isActive 
          ? 'bg-gradient-to-r from-brand-50 to-transparent border-brand-500 text-brand-600' 
          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
      }`}
    >
      <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-brand-500' : 'group-hover:text-brand-400'}`}>
        {icon}
      </span>
      <span className={`font-semibold text-sm tracking-wide ${isActive ? 'text-brand-900' : ''}`}>{label}</span>
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children, onLogout, userName }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { view: View.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { view: View.BUDGET, label: 'Budget Tracker', icon: <Wallet size={20} /> },
    { view: View.GUESTS, label: 'Guest List', icon: <Users size={20} /> },
    { view: View.TIMELINE, label: 'Event Time Chart', icon: <Clock size={20} /> },
    { view: View.CHECKLIST, label: 'Checklist', icon: <CheckSquare size={20} /> },
    { view: View.ASSISTANT, label: 'Bella AI Assistant', icon: <MessageCircle size={20} /> },
    { view: View.INSPIRATION, label: 'Inspiration Board', icon: <Image size={20} /> },
    { view: View.CONTACT, label: 'Contact Us', icon: <Phone size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-gray-800">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full glass-effect z-30 shadow-sm p-4 flex justify-between items-center border-b border-gray-100">
        <Logo />
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-brand-500 transition-colors">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shadow-2xl lg:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8 pb-6 border-b border-gray-50">
            <Logo />
            {userName && <p className="text-xs text-gray-400 mt-2 font-medium">Logged in as {userName}</p>}
          </div>

          <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
            <div className="px-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Planning</div>
            {navItems.slice(0, 5).map((item) => (
              <NavItem
                key={item.view}
                view={item.view}
                current={currentView}
                label={item.label}
                icon={item.icon}
                onClick={() => {
                  setCurrentView(item.view);
                  setMobileMenuOpen(false);
                }}
              />
            ))}
            
            <div className="px-6 mt-8 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">AI Tools</div>
            {navItems.slice(5, 7).map((item) => (
              <NavItem
                key={item.view}
                view={item.view}
                current={currentView}
                label={item.label}
                icon={item.icon}
                onClick={() => {
                  setCurrentView(item.view);
                  setMobileMenuOpen(false);
                }}
              />
            ))}

            <div className="px-6 mt-8 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Support</div>
            {navItems.slice(7).map((item) => (
              <NavItem
                key={item.view}
                view={item.view}
                current={currentView}
                label={item.label}
                icon={item.icon}
                onClick={() => {
                  setCurrentView(item.view);
                  setMobileMenuOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="p-6 border-t border-gray-50">
             <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white shadow-lg shadow-brand-200">
                <div className="flex justify-between items-start mb-2">
                   <p className="text-xs font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">PRO</p>
                </div>
                <p className="text-sm font-medium mb-1">Upgrade Plan</p>
                <p className="text-xs text-brand-100 mb-3">Get unlimited AI generations.</p>
                <button className="w-full bg-white text-brand-600 text-xs font-bold py-2 rounded-lg hover:bg-brand-50 transition-colors">
                  View Plans
                </button>
             </div>
             <div 
               onClick={onLogout}
               className="mt-4 flex items-center space-x-2 text-gray-400 text-sm px-2 cursor-pointer hover:text-red-500 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-24 lg:pt-0 overflow-x-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-slate-50 pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
            {children}
        </div>
      </main>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;