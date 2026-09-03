import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  Clock,
  Car,
  Bike,
  Lock,
  MessageSquare,
} from 'lucide-react';
import { SHOWROOM_INFO, SHOWROOM_OWNERS, getCallLink, getWhatsAppLink } from '../../utils/formatters';

const Footer = () => {
  const [footerClicks, setFooterClicks] = useState(0);
  const clickTimerRef = useRef(null);
  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    const nextClicks = footerClicks + 1;
    setFooterClicks(nextClicks);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (nextClicks >= 5) {
      e.preventDefault();
      setFooterClicks(0);
      navigate('/admin/login');
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      setFooterClicks(0);
    }, 2500);
  };
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-800/80">
          {/* Column 1: Brand & Showroom Story - 5 clicks opens Admin Portal */}
          <div className="space-y-4">
            <div onClick={handleBrandClick} className="flex items-center gap-3 cursor-pointer select-none group" title="साईबाबा मोटर्स">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-100 shrink-0">
                <img
                  src="/logo.png"
                  alt="साईबाबा मोटर्स लोगो"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-marathi text-xl font-bold text-white tracking-tight leading-none">
                  साईबाबा <span className="text-red-500">मोटर्स</span>
                </h3>
                <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mt-1">
                  Used Cars & Bikes
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Kasba Walve's premier second-hand two-wheeler and four-wheeler showroom. We provide transparent vehicle evaluations, tested pre-owned vehicles, clean RTO transfer paperwork, and reliable customer service.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-navy-900/60 p-2.5 rounded-lg border border-navy-800">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{SHOWROOM_INFO.workingHours}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/cars"
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5 text-slate-500" />
                  <span>Browse Used Cars</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/bikes"
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <Bike className="w-3.5 h-3.5 text-slate-500" />
                  <span>Browse Used Bikes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-gold-400 font-semibold">•</span>
                  <span>Sell Your Vehicle</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <span>About Sai Baba Motors</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Showroom Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Showroom Owners */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2.5">
              Showroom Owners
            </h4>
            <div className="space-y-3.5">
              {SHOWROOM_OWNERS.map((owner) => (
                <div
                  key={owner.phone}
                  className="bg-navy-900/70 p-3 rounded-xl border border-navy-800/80 hover:border-navy-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">{owner.name}</p>
                      <a
                        href={getCallLink(owner.phone)}
                        className="text-xs text-gold-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{owner.formattedPhone}</span>
                      </a>
                    </div>
                    <a
                      href={getWhatsAppLink(owner.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 transition-colors border border-emerald-800/50"
                      aria-label={`WhatsApp ${owner.name}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Showroom Location & Map Direction */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-gold-500 pl-2.5">
              Showroom Location
            </h4>
            <div className="bg-navy-900/70 p-4 rounded-xl border border-navy-800 space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block font-semibold text-sm">
                    साईबाबा मोटर्स
                  </strong>
                  Kasba Walve, Taluka Radhanagari, District Kolhapur, Maharashtra
                </p>
              </div>

              <a
                href={SHOWROOM_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-sm transition-all duration-200 mt-2"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (Google Maps)</span>
              </a>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Pre-Owned Guarantee</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 साईबाबा मोटर्स (Sai Baba Motors). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Kasba Walve, Kolhapur</span>
            <span>•</span>
            <Link
              to="/admin/login"
              className="text-slate-500 hover:text-gold-400 transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Dealer Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
