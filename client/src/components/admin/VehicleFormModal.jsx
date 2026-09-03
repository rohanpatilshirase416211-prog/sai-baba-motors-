import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Star,
  Check,
  Image as ImageIcon,
  AlertCircle,
  Car,
  Bike,
} from 'lucide-react';
import { uploadAPI } from '../../services/api';

const VehicleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const isEdit = !!initialData;

  const defaultState = {
    vehicleType: 'car',
    brand: '',
    model: '',
    variant: '',
    year: new Date().getFullYear(),
    price: '',
    running: '',
    passing: 'MH 09',
    registration: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    engineCC: '',
    ownership: '1st Owner',
    color: '',
    description: '',
    additionalInformation: '',
    images: [],
    primaryImage: '',
    featured: false,
    status: 'available',
  };

  const [formData, setFormData] = useState(defaultState);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...defaultState,
        ...initialData,
        images: initialData.images || [],
        primaryImage:
          initialData.primaryImage ||
          (initialData.images && initialData.images.length > 0
            ? initialData.images[0]
            : ''),
      });
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Upload local images via multer API
  const handleFileUpload = async (e) => {
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
        setFormData((prev) => {
          const updatedImages = [...prev.images, ...res.data.urls];
          return {
            ...prev,
            images: updatedImages,
            primaryImage: prev.primaryImage || updatedImages[0] || '',
          };
        });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload images. Please check file format and size.');
    } finally {
      setIsUploading(false);
      e.target.value = null; // reset input
    }
  };

  // Add external image URL
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    setFormData((prev) => {
      const updatedImages = [...prev.images, imageUrlInput.trim()];
      return {
        ...prev,
        images: updatedImages,
        primaryImage: prev.primaryImage || updatedImages[0],
      };
    });
    setImageUrlInput('');
  };

  // Remove image
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, idx) => idx !== indexToRemove);
      let newPrimary = prev.primaryImage;
      if (prev.primaryImage === prev.images[indexToRemove]) {
        newPrimary = filtered.length > 0 ? filtered[0] : '';
      }
      return {
        ...prev,
        images: filtered,
        primaryImage: newPrimary,
      };
    });
  };

  // Set primary photo
  const handleSetPrimaryImage = (imgUrl) => {
    setFormData((prev) => ({ ...prev, primaryImage: imgUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.brand || !formData.model || !formData.price || !formData.running || !formData.passing) {
      setErrorMsg('Please fill in all mandatory fields (Brand, Model, Price, Running km, Passing).');
      return;
    }

    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between border-b border-navy-800 shrink-0">
            <div>
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Showroom Inventory Manager
              </span>
              <h2 className="text-xl font-bold font-display">
                {isEdit ? `Edit Vehicle: ${formData.year} ${formData.brand} ${formData.model}` : 'Add New Vehicle to Showroom'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Scrollable Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Basic Classification */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                1. Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Vehicle Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800"
                  >
                    <option value="car">Four-Wheeler (Car)</option>
                    <option value="bike">Two-Wheeler (Bike)</option>
                  </select>
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Brand / Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maruti Suzuki, Hyundai, Royal Enfield"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  />
                </div>

                {/* Model */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swift, Creta, Classic 350"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  />
                </div>

                {/* Variant */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Variant</label>
                  <input
                    type="text"
                    placeholder="e.g. ZXi, 1.5 SX, Reborn ABS"
                    value={formData.variant}
                    onChange={(e) => handleInputChange('variant', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Core Specs */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                2. Pricing & Running Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 525000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-navy-950"
                  />
                </div>

                {/* Year */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Model Year *</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  />
                </div>

                {/* Running Km */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Running (Kilometers) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    value={formData.running}
                    onChange={(e) => handleInputChange('running', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  />
                </div>

                {/* Passing */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Passing (RTO Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH 09, MH 10, MH 12"
                    value={formData.passing}
                    onChange={(e) => handleInputChange('passing', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Registration Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Registration Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. MH-09-EV-3412"
                    value={formData.registration}
                    onChange={(e) => handleInputChange('registration', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  />
                </div>

                {/* Fuel Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Transmission */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>

                {/* Ownership */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Ownership</label>
                  <select
                    value={formData.ownership}
                    onChange={(e) => handleInputChange('ownership', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  >
                    <option value="1st Owner">1st Owner</option>
                    <option value="2nd Owner">2nd Owner</option>
                    <option value="3rd Owner">3rd Owner</option>
                    <option value="4th+ Owner">4th+ Owner</option>
                  </select>
                </div>

                {/* Engine CC */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Engine CC</label>
                  <input
                    type="number"
                    placeholder="e.g. 1197 or 349"
                    value={formData.engineCC}
                    onChange={(e) => handleInputChange('engineCC', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  />
                </div>

                {/* Color */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Pearl Arctic White"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Inventory Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800"
                  >
                    <option value="available">Available (Public)</option>
                    <option value="sold">Sold (Mark as Sold)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
                  />
                  <label htmlFor="featured" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Feature on Home Page
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3: Descriptions & Additional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                3. Descriptions & Additional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Detailed showroom condition, servicing record, features, etc."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Additional Information (Important Notes / Tyres / Insurance)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Single owner, brand new MRF tyres, comprehensive insurance valid till Oct 2026, original dual keys."
                    value={formData.additionalInformation}
                    onChange={(e) => handleInputChange('additionalInformation', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Vehicle Photos */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2 h-2 rounded-full bg-gold-500" />
                4. Vehicle Photos & Gallery
              </h3>

              {/* Upload or Add URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {/* File Upload Box */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Upload Photos from Device
                  </label>
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-navy-900 cursor-pointer bg-white transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      {isUploading ? 'Uploading photos...' : 'Click to select image files'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      JPG, PNG, WEBP (Max 10MB each)
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* External Image URL input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Or Add Image URL Directly
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold hover:bg-navy-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    You can set any uploaded photo as the Primary Cover Image using the star icon.
                  </p>
                </div>
              </div>

              {/* Photo Preview Grid */}
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {formData.images.map((imgUrl, idx) => {
                    const isPrimary = formData.primaryImage === imgUrl;
                    return (
                      <div
                        key={idx}
                        className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 bg-slate-100 group shadow-xs ${
                          isPrimary ? 'border-gold-500 ring-2 ring-gold-200' : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Uploaded vehicle photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Badges & Actions Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(imgUrl)}
                            title={isPrimary ? 'Primary Image' : 'Set as Primary Cover'}
                            className={`p-1.5 rounded-lg ${
                              isPrimary ? 'bg-gold-500 text-navy-950' : 'bg-white/80 hover:bg-white text-slate-800'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            title="Remove photo"
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {isPrimary && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-gold-500 text-navy-950 font-bold text-[9px] uppercase shadow-xs">
                            Primary
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400">
                  No photos uploaded yet. Upload or add photo URLs above.
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Save Vehicle'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VehicleFormModal;
