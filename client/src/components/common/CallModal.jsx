import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, X, UserCheck } from 'lucide-react';
import { SHOWROOM_OWNERS, getCallLink, getWhatsAppLink } from '../../utils/formatters';

const CallModal = ({ isOpen, onClose, vehicle = null }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="bg-navy-900 text-white p-6 pb-5 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1">
              साईबाबा मोटर्स • Kasba Walve
            </div>
            <h3 className="text-xl font-bold font-display">Contact Showroom Owners</h3>
            <p className="text-slate-300 text-sm mt-1">
              Directly talk with the owners for verified vehicle inspection, pricing, and test drives.
            </p>

            {vehicle && (
              <div className="mt-3 p-2.5 bg-navy-800/80 rounded-lg border border-navy-700 text-xs text-slate-200">
                Inquiring about:{' '}
                <span className="font-semibold text-white">
                  {vehicle.year} {vehicle.brand} {vehicle.model}
                </span>
              </div>
            )}
          </div>

          {/* Owners List */}
          <div className="p-6 space-y-3.5 divide-y divide-slate-100">
            {SHOWROOM_OWNERS.map((owner, index) => (
              <div
                key={owner.phone}
                className={`flex items-center justify-between gap-3 ${
                  index > 0 ? 'pt-3.5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy-100 text-navy-800 flex items-center justify-center font-bold text-sm">
                    {owner.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{owner.name}</h4>
                    <p className="text-xs text-slate-500">{owner.formattedPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getCallLink(owner.phone)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-navy-900 rounded-lg hover:bg-navy-800 transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={getWhatsAppLink(owner.phone, vehicle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Showroom Location: Kasba Walve • Timings: 9:00 AM – 8:30 PM
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CallModal;
