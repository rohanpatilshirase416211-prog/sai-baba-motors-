import React from 'react';
import { RotateCcw, Filter, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  brands = [],
  passingList = [],
  vehicleType = 'car',
}) => {
  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric'];
  const transmissions = ['Manual', 'Automatic'];
  const ownerships = ['1st Owner', '2nd Owner', '3rd Owner'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-navy-950 font-bold text-base">
          <Filter className="w-4 h-4 text-gold-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Brand
          </label>
          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 text-sm">
            <button
              type="button"
              onClick={() => onFilterChange('brand', '')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                !filters.brand
                  ? 'bg-navy-900 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>All Brands</span>
              {!filters.brand && <Check className="w-3.5 h-3.5" />}
            </button>
            {brands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onFilterChange('brand', filters.brand === b ? '' : b)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  filters.brand === b
                    ? 'bg-navy-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{b}</span>
                {filters.brand === b && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Max Price Slider / Filter */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Budget
          </label>
          <span className="text-xs font-bold text-navy-950">
            {filters.maxPrice ? `Up to ${formatPrice(filters.maxPrice)}` : 'Any Price'}
          </span>
        </div>
        <select
          value={filters.maxPrice || ''}
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
        >
          <option value="">Any Budget</option>
          <option value="100000">Under ₹1 Lakh</option>
          <option value="200000">Under ₹2 Lakh</option>
          <option value="400000">Under ₹4 Lakh</option>
          <option value="600000">Under ₹6 Lakh</option>
          <option value="800000">Under ₹8 Lakh</option>
          <option value="1200000">Under ₹12 Lakh</option>
          <option value="1800000">Under ₹18 Lakh</option>
        </select>
      </div>

      {/* Kilometers Running */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Max Running (KM)
          </label>
          <span className="text-xs font-bold text-navy-950">
            {filters.maxRunning ? `≤ ${filters.maxRunning} km` : 'Any KM'}
          </span>
        </div>
        <select
          value={filters.maxRunning || ''}
          onChange={(e) => onFilterChange('maxRunning', e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
        >
          <option value="">Any KM</option>
          <option value="20000">Under 20,000 km</option>
          <option value="40000">Under 40,000 km</option>
          <option value="60000">Under 60,000 km</option>
          <option value="80000">Under 80,000 km</option>
        </select>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Fuel Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {fuelTypes.map((fuel) => (
            <button
              key={fuel}
              type="button"
              onClick={() => onFilterChange('fuelType', filters.fuelType === fuel ? '' : fuel)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filters.fuelType === fuel
                  ? 'bg-navy-900 text-white border-navy-900 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission (Cars mostly) */}
      {vehicleType === 'car' && (
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Transmission
          </label>
          <div className="flex gap-2">
            {transmissions.map((trans) => (
              <button
                key={trans}
                type="button"
                onClick={() =>
                  onFilterChange('transmission', filters.transmission === trans ? '' : trans)
                }
                className={`flex-1 py-1.5 text-center rounded-lg text-xs font-medium border transition-colors ${
                  filters.transmission === trans
                    ? 'bg-navy-900 text-white border-navy-900 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {trans}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passing / RTO (e.g. MH 09, MH 10, MH 12) */}
      {passingList.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Passing / RTO
          </label>
          <div className="flex flex-wrap gap-1.5">
            {passingList.map((passing) => (
              <button
                key={passing}
                type="button"
                onClick={() =>
                  onFilterChange('passing', filters.passing === passing ? '' : passing)
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  filters.passing === passing
                    ? 'bg-navy-900 text-white border-navy-900 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {passing}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ownership */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Ownership
        </label>
        <div className="space-y-1">
          {ownerships.map((owner) => (
            <button
              key={owner}
              type="button"
              onClick={() =>
                onFilterChange('ownership', filters.ownership === owner ? '' : owner)
              }
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                filters.ownership === owner
                  ? 'bg-navy-900 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{owner}</span>
              {filters.ownership === owner && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
