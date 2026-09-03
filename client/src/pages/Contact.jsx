import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';
import {
  SHOWROOM_INFO,
  SHOWROOM_OWNERS,
  getCallLink,
  getWhatsAppLink,
} from '../utils/formatters';
import { enquiryAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Please provide your name and phone number');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await enquiryAPI.create(formData);
      if (res.data.success) {
        setIsSuccess(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-950 font-display">
          Contact साईबाबा मोटर्स
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Visit our showroom in Kasba Walve, or call our owners directly for vehicle test drives, pricing inquiries, and immediate sales support.
        </p>
      </div>

      {/* Grid: Contact Info & Showroom Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Owner Contact Cards & Address */}
        <div className="lg:col-span-6 space-y-6">
          {/* Showroom Address Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-navy-50 text-navy-900 shrink-0">
                <Building className="w-6 h-6 text-navy-800" />
              </div>
              <div>
                <h3 className="font-marathi text-xl font-bold text-navy-950">
                  साईबाबा मोटर्स (Sai Baba Motors)
                </h3>
                <p className="text-xs text-gold-600 font-bold uppercase tracking-wider mt-0.5">
                  Used Cars & Bikes Showroom
                </p>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  Kasba Walve, Taluka Radhanagari, District Kolhapur, Maharashtra
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Clock className="w-4 h-4 text-gold-600 shrink-0" />
              <span>{SHOWROOM_INFO.workingHours}</span>
            </div>

            {/* Google Maps CTA */}
            <a
              href={SHOWROOM_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-sm transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>

          {/* Showroom Owners Contact List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Direct Owner Contact Desk
            </h3>

            {SHOWROOM_OWNERS.map((owner) => (
              <div
                key={owner.phone}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 font-bold text-lg flex items-center justify-center shrink-0">
                    {owner.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {owner.name}
                    </h4>
                    <p className="text-xs text-slate-500">{owner.role}</p>
                    <p className="text-xs font-semibold text-navy-900 mt-0.5">
                      {owner.formattedPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getCallLink(owner.phone)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-colors shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={getWhatsAppLink(owner.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: General Enquiry Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-navy-950 font-display">
              Send an Online Enquiry
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Have questions about vehicle availability or need help finding a specific model? Leave a message.
            </p>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-navy-950 font-display">
                Message Sent Successfully!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Thank you for reaching out to साईबाबा मोटर्स. Rohit Patil, Amit Pawar, or Yuvaraj Chavan will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9822012345"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. yourname@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what vehicle you are looking for, or any query..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Showroom Map Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 bg-navy-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-gold-400 font-bold">
              Showroom Map & Location
            </span>
            <h3 className="text-xl font-bold font-display">Visit Us in Kasba Walve</h3>
          </div>
          <a
            href={SHOWROOM_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps App</span>
          </a>
        </div>
        <div className="w-full h-80 bg-slate-100 relative">
          <iframe
            title="Sai Baba Motors Kasba Walve Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15296.883719808386!2d74.15!3d16.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc057004f1412b1%3A0x68i3YbbE5u36jY8!2sKasba%20Walve%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
