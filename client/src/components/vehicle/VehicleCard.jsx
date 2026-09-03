import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera,
  Gauge,
  MapPin,
  Fuel,
  Settings,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice, formatKm, getWhatsAppLink } from '../../utils/formatters';
import CallModal from '../common/CallModal';

const VehicleCard = ({ vehicle }) => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  if (!vehicle) return null;

  const isSold = vehicle.status === 'sold';
  const displayImage =
    vehicle.primaryImage ||
    (vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null) ||
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';

  const photoCount = vehicle.images ? vehicle.images.length : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card hover:shadow-card-hover flex flex-col transition-all duration-300"
      >
        {/* Top Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={displayImage}
            alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                vehicle.vehicleType === 'bike'
                  ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
                  : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
            {/* Vehicle Type Badge */}
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-navy-950/80 backdrop-blur-md text-white border border-white/10 shadow-sm">
              {vehicle.vehicleType === 'car' ? 'Car' : 'Bike'}
            </span>

            {/* Featured Badge */}
            {vehicle.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-gold-500 text-navy-950 shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Sold Overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-navy-950/75 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="px-6 py-2 rounded-xl bg-rose-600 text-white font-black text-lg tracking-widest uppercase shadow-xl transform -rotate-6 border-2 border-white">
                SOLD OUT
              </span>
            </div>
          )}

          {/* Photo Count Badge */}
          {photoCount > 1 && (
            <div className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              <Camera className="w-3 h-3" />
              <span>{photoCount} Photos</span>
            </div>
          )}

          {/* Passing / RTO Badge on Image */}
          {vehicle.passing && (
            <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-navy-950 text-xs font-bold border border-slate-200 shadow-sm">
              <MapPin className="w-3 h-3 text-gold-600" />
              <span>{vehicle.passing}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Title */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-navy-700 transition-colors line-clamp-1 font-display">
                {vehicle.year} {vehicle.brand} {vehicle.model}
              </h3>
            </div>
            {vehicle.variant && (
              <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-1">
                {vehicle.variant}
              </p>
            )}

            {/* Price Banner */}
            <div className="mb-4 flex items-baseline justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-2xl font-black text-navy-950 tracking-tight font-display">
                  {formatPrice(vehicle.price)}
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Deal
              </span>
            </div>

            {/* Key Specs Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">
                  {formatKm(vehicle.running)}
                </span>
              </div>

              {vehicle.fuelType && (
                <div className="flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700 truncate">{vehicle.fuelType}</span>
                </div>
              )}

              {vehicle.transmission && vehicle.transmission !== 'N/A' && (
                <div className="flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700 truncate">
                    {vehicle.transmission}
                  </span>
                </div>
              )}

              {vehicle.ownership && vehicle.ownership !== 'N/A' && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-medium text-slate-700 truncate">
                    {vehicle.ownership}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-1">
            <Link
              to={`/vehicle/${vehicle._id}`}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-navy-900 group-hover:bg-navy-800 shadow-sm transition-colors"
            >
              View Full Details
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCallModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-navy-800" />
                <span>Call Owner</span>
              </button>

              <a
                href={getWhatsAppLink('9130959393', vehicle)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call Showroom Owner Modal */}
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        vehicle={vehicle}
      />
    </>
  );
};

export default VehicleCard;
