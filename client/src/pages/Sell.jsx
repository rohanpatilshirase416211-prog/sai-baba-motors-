import React, { useState } from 'react';
import {
  Upload,
  Sparkles,
  CheckCircle2,
  Car,
  Bike,
  AlertCircle,
  IndianRupee,
  Phone,
  User,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { sellRequestAPI, uploadAPI } from '../services/api';

const Sell = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: 'car',
    brand: '',
    model: '',
    year: new Date().getFullYear() - 3,
    running: '',
    registration: '',
    expectedPrice: '',
    additionalInformation: '',
    images: [],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('images', files[i]);
      }

      const res = await uploadAPI.uploadImages(data);
      if (res.data.success && res.data.urls) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...res.data.urls],
        }));
      }
    } catch (err) {
      setErrorMsg('Failed to upload photos. You can still submit the vehicle without photos.');
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.brand || !formData.model || !formData.expectedPrice) {
      setErrorMsg('Please fill in your name, contact phone, vehicle brand, model, and expected price.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await sellRequestAPI.create(formData);
      if (res.data.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit sell request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 text-gold-700 text-xs font-bold uppercase tracking-wider border border-gold-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Evaluation & Best Valuation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-950 font-display">
          Sell Your Car or Bike to साईबाबा मोटर्स
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Get the highest on-the-spot market price for your used vehicle in Kasba Walve. Fast payment and zero paperwork hassle.
        </p>
      </div>

      {/* Selling Value Props */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center mx-auto">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-navy-950">Instant Evaluation</h4>
          <p className="text-xs text-slate-500">Same-day inspection & fair valuation</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-navy-950">Immediate Payment</h4>
          <p className="text-xs text-slate-500">Direct bank transfer upon agreement</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-navy-950">Hassle-Free RTO Transfer</h4>
          <p className="text-xs text-slate-500">We manage the full RC ownership transfer</p>
        </div>
      </div>

      {/* Main Submission Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg">
        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-navy-950 font-display">
              Vehicle Submitted Successfully!
            </h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{formData.name}</strong>! Rohit Patil, Amit Pawar, or Yuvaraj Chavan from साईबाबा मोटर्स will call you at <strong>{formData.phone}</strong> to discuss valuation and schedule an inspection in Kasba Walve.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: '',
                  phone: '',
                  vehicleType: 'car',
                  brand: '',
                  model: '',
                  year: new Date().getFullYear() - 3,
                  running: '',
                  registration: '',
                  expectedPrice: '',
                  additionalInformation: '',
                  images: [],
                });
              }}
              className="mt-4 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-navy-900 bg-gold-400 hover:bg-gold-500 shadow-sm"
            >
              Submit Another Vehicle
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                1. Your Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822012345"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Vehicle Specs */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                2. Vehicle Information
              </h3>

              {/* Type Switcher */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('vehicleType', 'car')}
                  className={`flex-1 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    formData.vehicleType === 'car'
                      ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Four-Wheeler (Car)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('vehicleType', 'bike')}
                  className={`flex-1 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    formData.vehicleType === 'bike'
                      ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Two-Wheeler (Bike)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand / Make *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maruti, Hyundai, Honda"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swift, Creta, Splendor"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Manufacturing Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kilometers Driven
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 45000"
                    value={formData.running}
                    onChange={(e) => handleInputChange('running', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration / Passing (e.g. MH 09)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MH 09 CS 1234"
                    value={formData.registration}
                    onChange={(e) => handleInputChange('registration', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expected Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450000"
                    value={formData.expectedPrice}
                    onChange={(e) => handleInputChange('expectedPrice', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Information (Condition, Servicing, Tyres, Insurance)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Single owner, brand new tyres, comprehensive insurance valid till Dec 2026, never involved in any accident..."
                  value={formData.additionalInformation}
                  onChange={(e) => handleInputChange('additionalInformation', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Step 3: Photos */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                3. Vehicle Photos (Optional)
              </h3>

              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-navy-900 rounded-2xl cursor-pointer bg-slate-50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-800">
                  {isUploading ? 'Uploading photos...' : 'Click to select vehicle photos'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Clear front, side, and interior photos help us provide a higher offer
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {formData.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-20 aspect-[16/10] rounded-lg overflow-hidden border border-slate-200 shrink-0"
                    >
                      <img src={img} alt="Vehicle preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Submitting Request...' : 'Submit Vehicle for Evaluation'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Sell;
