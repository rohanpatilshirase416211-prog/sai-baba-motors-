import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, Car, Bike, Sparkles } from 'lucide-react';
import CallModal from './CallModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (nextClicks >= 5) {
      e.preventDefault();
      setLogoClicks(0);
      navigate('/admin/login');
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 2500);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cars', path: '/cars', icon: Car },
    { name: 'Bikes', path: '/bikes', icon: Bike },
    { name: 'Sell Vehicle', path: '/sell', highlight: true },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-md py-3'
            : 'bg-white/95 backdrop-blur-sm shadow-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo - 5 clicks opens Admin Portal */}
          <Link
            to="/"
            onClick={handleBrandClick}
            className="flex items-center gap-3 group select-none cursor-pointer"
            title="साईबाबा मोटर्स"
          >
            <div className="h-12 w-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200/80 group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo.png"
                alt="साईबाबा मोटर्स लोगो"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-marathi text-xl sm:text-2xl font-black text-navy-950 tracking-tight leading-none group-hover:text-navy-700 transition-colors">
                साईबाबा <span className="text-red-600">मोटर्स</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-1">
                Used Cars & Bikes • Kasba Walve
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;

              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy-900 bg-gold-400 hover:bg-gold-500 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? 'text-navy-900 bg-navy-50 font-bold'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsCallModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-navy-900 hover:bg-navy-800 shadow hover:shadow-md transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-gold-400" />
              <span>Call Showroom</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsCallModalOpen(true)}
              className="p-2 rounded-lg bg-navy-900 text-gold-400 sm:hidden"
              aria-label="Call showroom"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 shadow-xl space-y-2 animate-fadeIn">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;

              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-navy-900 bg-gold-400 mt-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    active
                      ? 'text-navy-900 bg-navy-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCallModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-navy-900 shadow-sm"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>Call Showroom Owners</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Call Modal */}
      <CallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
    </>
  );
};

export default Navbar;
