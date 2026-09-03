import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  Send,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Navigation,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import VehicleGallery from '../components/vehicle/VehicleGallery';
import VehicleSpecs from '../components/vehicle/VehicleSpecs';
import VehicleCard from '../components/vehicle/VehicleCard';
import EnquiryModal from '../components/forms/EnquiryModal';
import CallModal from '../components/common/CallModal';
import Spinner from '../components/common/Spinner';
import { vehicleAPI } from '../services/api';
import {
  formatPrice,
  formatKm,
  getWhatsAppLink,
  getCallLink,
  SHOWROOM_INFO,
  SHOWROOM_OWNERS,
} from '../utils/formatters';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await vehicleAPI.getById(id);
        if (res.data.success) {
          setVehicle(res.data.data);
          setRelated(res.data.related || []);
          // Scroll to top
          window.scrollTo(0, 0);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Vehicle not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${vehicle.year} ${vehicle.brand} ${vehicle.model} - साईबाबा मोटर्स`,
          text: `Check out this ${vehicle.brand} ${vehicle.model} at साईबाबा मोटर्स Kasba Walve`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-950 font-display">Vehicle Not Found</h2>
        <p className="text-slate-500 text-sm">
          The requested vehicle may have been sold or removed by the showroom.
        </p>
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-navy-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Vehicles</span>
        </Link>
      </div>
    );
  }

  const isSold = vehicle.status === 'sold';
  const vehicleTitle = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb & Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to={vehicle.vehicleType === 'bike' ? '/bikes' : '/cars'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-gold-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {vehicle.vehicleType === 'bike' ? 'Bikes' : 'Cars'}</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isCopied ? 'Link Copied!' : 'Share Vehicle'}</span>
        </button>
      </div>

      {/* Main Grid: Gallery & Sticky Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery & Specifications */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery */}
          <VehicleGallery images={vehicle.images} title={vehicleTitle} />

          {/* Core Specifications Grid */}
          <VehicleSpecs vehicle={vehicle} />

          {/* Additional Information Card (Custom Field) */}
          {vehicle.additionalInformation && (
            <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base mb-3 font-display">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Showroom Notes & Additional Information</span>
              </div>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
                {vehicle.additionalInformation}
              </p>
            </div>
          )}

          {/* Detailed Description */}
          {vehicle.description && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-navy-950 font-display">
                Vehicle Overview & Condition
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Sticky Contact Action Box */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-lg space-y-5">
            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-navy-100 text-navy-900">
                  {vehicle.vehicleType === 'car' ? 'Car' : 'Bike'}
                </span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                  Passing: {vehicle.passing}
                </span>
                {vehicle.featured && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-gold-100 text-gold-800">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-navy-950 font-display leading-tight">
                {vehicleTitle}
              </h1>
              {vehicle.variant && (
                <p className="text-sm text-slate-500 font-medium mt-0.5">{vehicle.variant}</p>
              )}
            </div>

            {/* Prominent Price */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                  Showroom Price
                </span>
                <span className="text-3xl sm:text-4xl font-black text-navy-950 font-display tracking-tight">
                  {formatPrice(vehicle.price)}
                </span>
              </div>
              {isSold ? (
                <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-black text-xs uppercase tracking-wider">
                  SOLD
                </span>
              ) : (
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  Available Now
                </span>
              )}
            </div>

            {/* Quick Metrics Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 border-t border-b border-slate-100 py-3.5">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-slate-400" />
                <span>{formatKm(vehicle.running)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-slate-400" />
                <span>{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>{vehicle.ownership}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Year {vehicle.year}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5">
              {/* WhatsApp Enquiry Button with Pre-filled vehicle details */}
              <a
                href={getWhatsAppLink('9130959393', vehicle)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Enquiry</span>
              </a>

              {/* Call Showroom Button */}
              <button
                type="button"
                onClick={() => setIsCallModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Showroom Owner</span>
              </button>

              {/* Send Enquiry Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsEnquiryModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Online Enquiry</span>
              </button>
            </div>

            {/* Kasba Walve Location & Directions */}
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <p>
                  Available for inspection at showroom: <strong>Kasba Walve</strong>, Radhanagari, Kolhapur.
                </p>
              </div>
              <a
                href={SHOWROOM_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 hover:text-gold-600"
              >
                <Navigation className="w-3.5 h-3.5 text-gold-600" />
                <span>Open Google Maps Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Vehicles Section */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-navy-950 font-display">
              Similar Vehicles You May Like
            </h3>
            <Link
              to={vehicle.vehicleType === 'bike' ? '/bikes' : '/cars'}
              className="text-xs font-bold uppercase tracking-wider text-navy-900 hover:text-gold-600"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => (
              <VehicleCard key={rel._id} vehicle={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        vehicle={vehicle}
      />

      {/* Call Showroom Modal */}
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        vehicle={vehicle}
      />
    </div>
  );
};

export default VehicleDetails;
