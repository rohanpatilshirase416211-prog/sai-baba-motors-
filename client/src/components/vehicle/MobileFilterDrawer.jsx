import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

const MobileFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  brands,
  passingList,
  vehicleType,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xs bg-white h-full overflow-y-auto shadow-2xl z-10 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-navy-900 text-white">
            <h3 className="font-bold text-base font-display">Filter Vehicles</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onResetFilters={onResetFilters}
              brands={brands}
              passingList={passingList}
              vehicleType={vehicleType}
            />
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;
