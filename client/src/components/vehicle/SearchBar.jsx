import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Bike, SlidersHorizontal, ArrowRight, Gauge, IndianRupee } from 'lucide-react';
import { vehicleAPI } from '../../services/api';

const SearchBar = ({ initialType = 'all', compact = false }) => {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState(initialType);
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxRunning, setMaxRunning] = useState('');
  const [brandsList, setBrandsList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await vehicleAPI.getFilters(vehicleType);
        if (res.data.success) {
          setBrandsList(res.data.data.brands || []);
        }
      } catch (err) {
        console.error('Failed to load search filter brands:', err);
      }
    };
    fetchBrands();
  }, [vehicleType]);

  const handleSearch = (e) => {
    e.preventDefault();

    const targetPath = vehicleType === 'bike' ? '/bikes' : vehicleType === 'car' ? '/cars' : '/cars';
    const queryParams = new URLSearchParams();

    if (vehicleType && vehicleType !== 'all') {
      queryParams.set('type', vehicleType);
    }
    if (brand && brand !== 'all') {
      queryParams.set('brand', brand);
    }
    if (maxPrice) {
      queryParams.set('maxPrice', maxPrice);
    }
    if (maxRunning) {
      queryParams.set('maxRunning', maxRunning);
    }
    if (searchKeyword.trim()) {
      queryParams.set('search', searchKeyword.trim());
    }

    const url = `${targetPath}?${queryParams.toString()}`;
    navigate(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-6 backdrop-blur-md">
      {/* Vehicle Type Switcher */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => setVehicleType('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            vehicleType === 'all'
              ? 'bg-navy-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Vehicles
        </button>
        <button
          type="button"
          onClick={() => setVehicleType('car')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            vehicleType === 'car'
              ? 'bg-navy-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Cars</span>
        </button>
        <button
          type="button"
          onClick={() => setVehicleType('bike')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            vehicleType === 'bike'
              ? 'bg-navy-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Bikes</span>
        </button>
      </div>

      {/* Main Search Controls */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Brand Dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Select Brand</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
          >
            <option value="">All Brands</option>
            {brandsList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Budget / Max Price */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Max Budget</label>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
          >
            <option value="">Any Budget</option>
            <option value="100000">Under ₹1 Lakh</option>
            <option value="300000">Under ₹3 Lakh</option>
            <option value="600000">Under ₹6 Lakh</option>
            <option value="1000000">Under ₹10 Lakh</option>
            <option value="1500000">Under ₹15 Lakh</option>
            <option value="2500000">Under ₹25 Lakh</option>
          </select>
        </div>

        {/* Maximum Kilometers */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Max Kilometers</label>
          <select
            value={maxRunning}
            onChange={(e) => setMaxRunning(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
          >
            <option value="">Any Running</option>
            <option value="20000">Under 20,000 km</option>
            <option value="40000">Under 40,000 km</option>
            <option value="60000">Under 60,000 km</option>
            <option value="80000">Under 80,000 km</option>
            <option value="100000">Under 1,00,000 km</option>
          </select>
        </div>

        {/* Search Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Vehicles</span>
          </button>
        </div>
      </form>

      {/* Optional Keyword Input */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Or search by model name (e.g. Swift, Creta, Classic 350, Splendor, Thar)..."
          className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;
