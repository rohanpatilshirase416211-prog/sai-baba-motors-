import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  HelpCircle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  User,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, title = 'Admin Portal' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles Management', path: '/admin/vehicles', icon: Car },
    { name: 'Customer Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Sell Requests', path: '/admin/sell-requests', icon: ShoppingBag },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-navy-950 text-slate-300 border-r border-navy-800 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-navy-800/80">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0">
              <img src="/logo.png" alt="साईबाबा मोटर्स" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-marathi text-lg font-bold text-white tracking-tight leading-none">
                साईबाबा <span className="text-red-500">मोटर्स</span>
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block mt-1">
                Dealer Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-gold-500 text-navy-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-navy-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] bg-navy-800 px-1.5 py-0.5 rounded text-slate-300">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-navy-950 font-display">{title}</h1>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900">
                {user?.name || 'Showroom Admin'}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                Active Session
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-sm border border-navy-200">
              <ShieldCheck className="w-4 h-4 text-navy-800" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-64 bg-navy-950 text-white h-full z-10 flex flex-col">
            <div className="p-5 border-b border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain" />
                <span className="font-marathi text-xl font-black text-white">साईबाबा <span className="text-red-500">मोटर्स</span></span>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                      active
                        ? 'bg-gold-500 text-navy-950 font-bold'
                        : 'text-slate-300 hover:bg-navy-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-navy-800 space-y-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
