import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Bike,
  Sparkles,
  ShieldCheck,
  FileCheck,
  BadgePercent,
  Users,
  MapPin,
  Phone,
  ArrowRight,
  ChevronRight,
  Star,
  CheckCircle,
  Navigation,
} from 'lucide-react';
import SearchBar from '../components/vehicle/SearchBar';
import VehicleCard from '../components/vehicle/VehicleCard';
import Spinner from '../components/common/Spinner';
import CallModal from '../components/common/CallModal';
import { vehicleAPI } from '../services/api';
import { SHOWROOM_INFO, SHOWROOM_OWNERS, getCallLink, getWhatsAppLink } from '../utils/formatters';

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await vehicleAPI.getFeatured(6);
        if (res.data.success) {
          setFeaturedVehicles(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load featured vehicles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const trustHighlights = [
    {
      icon: ShieldCheck,
      title: '100% Quality Inspected',
      description: 'Every car and bike undergoes a multi-point mechanical inspection before being put on display.',
    },
    {
      icon: FileCheck,
      title: 'Verified RTO Documents',
      description: 'Zero legal hassles. Genuine RC book, NOC transfer assistance, and clear ownership paper history.',
    },
    {
      icon: BadgePercent,
      title: 'Transparent Fair Pricing',
      description: 'No hidden dealership commissions or inflated costs. Honest pricing matched to market condition.',
    },
    {
      icon: Users,
      title: 'Direct Owner Dealing',
      description: 'Direct communication with Rohit Patil, Amit Pawar, and Yuvaraj Chavan for hassle-free deals.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white overflow-hidden pt-12 pb-24">
        {/* Background Subtle Automobile Graphic Texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-navy-700/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-gold-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 z-10">
          {/* Trust Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs sm:text-sm text-gold-300 font-medium"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Kasba Walve's Most Trusted Pre-Owned Dealership</span>
          </motion.div>

          {/* Main Headings */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight">
              <span className="font-marathi block text-white drop-shadow-sm">
                साईबाबा <span className="text-gold-400">मोटर्स</span>
              </span>
              <span className="text-xl sm:text-3xl md:text-4xl font-display font-semibold text-slate-200 block mt-2">
                Trusted Used Cars & Bikes
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed pt-2">
              Find quality pre-owned cars and bikes at the right price. Inspected vehicles, clear RTO paperwork, and genuine customer service in Kasba Walve.
            </p>
          </motion.div>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Car className="w-5 h-5" />
              <span>Explore Cars</span>
            </Link>

            <Link
              to="/bikes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-navy-800 hover:bg-navy-700 border border-navy-700/80 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Bike className="w-5 h-5 text-gold-400" />
              <span>Explore Bikes</span>
            </Link>

            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
            >
              <span>Sell Your Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Floating Quick Search Section */}
      <div className="-mt-20 sm:-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <SearchBar initialType="all" />
      </div>

      {/* Featured Vehicles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked Collection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-950 font-display">
              Featured Vehicles
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Top quality pre-owned four-wheelers and two-wheelers ready for immediate handover.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cars"
              className="text-xs font-bold uppercase tracking-wider text-navy-900 hover:text-gold-600 flex items-center gap-1 transition-colors"
            >
              <span>All Cars</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/bikes"
              className="text-xs font-bold uppercase tracking-wider text-navy-900 hover:text-gold-600 flex items-center gap-1 transition-colors"
            >
              <span>All Bikes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Featured Vehicle Grid */}
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No featured vehicles currently displayed.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-navy-950 bg-navy-100 hover:bg-navy-200 transition-colors"
          >
            <span>View All Available Inventory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why Choose Sai Baba Motors */}
      <section className="bg-navy-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
              Buy & Sell With Complete Peace of Mind
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At <strong className="text-white">साईबाबा मोटर्स</strong>, we value honesty, customer relationships, and vehicle quality above everything else.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-navy-950/60 border border-navy-800 hover:border-gold-500/40 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center mb-4 group-hover:bg-gold-400 group-hover:text-navy-950 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Owner Direct Desk & Quick Contact Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 text-white border border-navy-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Kasba Walve Showroom</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display">
                Have a Specific Car or Bike in Mind?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect directly with showroom partners <strong>Rohit Patil</strong>,{' '}
                <strong>Amit Pawar</strong>, or <strong>Yuvaraj Chavan</strong>. We provide instant vehicle evaluations, live walkaround video tours, and test drives.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCallModalOpen(true)}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-md transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Owners Direct</span>
                </button>

                <a
                  href={SHOWROOM_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-gold-400" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Owner Cards */}
            <div className="lg:col-span-5 space-y-3">
              {SHOWROOM_OWNERS.map((owner) => (
                <div
                  key={owner.phone}
                  className="p-4 rounded-xl bg-navy-800/80 border border-navy-700/80 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white">{owner.name}</h4>
                    <p className="text-xs text-gold-400 font-medium">{owner.formattedPhone}</p>
                  </div>
                  <a
                    href={getCallLink(owner.phone)}
                    className="p-2.5 rounded-lg bg-gold-400 text-navy-950 hover:bg-gold-500 transition-colors"
                    aria-label={`Call ${owner.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call Modal */}
      <CallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
    </div>
  );
};

export default Home;
