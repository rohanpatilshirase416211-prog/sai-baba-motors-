import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle,
  FileCheck,
  Phone,
  Navigation,
  Sparkles,
  Car,
  Bike,
} from 'lucide-react';
import { SHOWROOM_INFO, SHOWROOM_OWNERS } from '../utils/formatters';

const About = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-12 sm:py-16">
      {/* Header Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-navy-100 text-navy-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>About साईबाबा मोटर्स</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-950 font-display">
          Kasba Walve's Trusted Pre-Owned Vehicle Dealership
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Founded with a commitment to integrity, transparency, and personal customer care for used car and bike buyers and sellers across the Kolhapur district.
        </p>
      </div>

      {/* Main Story & Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 font-display">
              Our Journey & Commitment to You
            </h2>
            <p>
              Buying or selling a used vehicle is an important milestone. At{' '}
              <strong className="text-navy-950">साईबाबा मोटर्स (Sai Baba Motors)</strong> in Kasba Walve, we believe the experience should be simple, transparent, and completely free from uncertainty.
            </p>
            <p>
              We handpick pre-owned two-wheelers and four-wheelers, thoroughly verify their mechanical condition and RTO registration records, and price them fairly so you get maximum value for your hard-earned money.
            </p>
            <p>
              Whether you are looking for a reliable family hatchback like a Maruti Swift, a robust SUV like a Creta or Thar, or a durable two-wheeler like a Splendor or Classic 350, our showroom partners are personally here to assist you through inspection, test drives, and document transfers.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-navy-950">
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Non-Accidental Inspection</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Clean RTO Document Verification</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No Hidden Agent Fees</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Vehicle Evaluation</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
                alt="Sai Baba Motors Showroom"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlay Badge */}
            <div className="absolute -bottom-6 -left-6 bg-navy-950 text-white p-5 rounded-2xl shadow-xl border border-navy-800 max-w-xs hidden sm:block">
              <span className="text-gold-400 text-xs font-bold uppercase tracking-wider block">
                Local Trust
              </span>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Kasba Walve, Radhanagari, Kolhapur • Open 7 Days a Week
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership / Partners Section */}
      <div className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
              Meet The Partners
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-950 font-display">
              Showroom Leadership
            </h2>
            <p className="text-slate-500 text-sm">
              Talk directly with the owners for honest vehicle discussions and friendly advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHOWROOM_OWNERS.map((owner) => (
              <div
                key={owner.phone}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-2xl bg-navy-900 text-gold-400 font-black text-2xl flex items-center justify-center mx-auto shadow-md">
                  {owner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-950 font-display">{owner.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{owner.role}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <a
                    href={`tel:+91${owner.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-50 text-navy-900 font-bold text-xs hover:bg-navy-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold-600" />
                    <span>{owner.formattedPhone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-navy-950 font-display">
          Ready to Find Your Next Vehicle?
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/cars"
            className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-md transition-all flex items-center gap-2"
          >
            <Car className="w-4 h-4" />
            <span>Browse Cars</span>
          </Link>
          <Link
            to="/bikes"
            className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-navy-900 hover:bg-navy-800 shadow-md transition-all flex items-center gap-2"
          >
            <Bike className="w-4 h-4" />
            <span>Browse Bikes</span>
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <span>Visit Showroom</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
