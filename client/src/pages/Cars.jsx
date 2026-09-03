import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, Car, Search, RotateCcw } from 'lucide-react';
import VehicleGrid from '../components/vehicle/VehicleGrid';
import FilterSidebar from '../components/vehicle/FilterSidebar';
import MobileFilterDrawer from '../components/vehicle/MobileFilterDrawer';
import { vehicleAPI } from '../services/api';

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state initialized from URL query parameters
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    maxRunning: searchParams.get('maxRunning') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    passing: searchParams.get('passing') || '',
    ownership: searchParams.get('ownership') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [passingList, setPassingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [totalVehicles, setTotalVehicles] = useState(0);

  // Load distinct brands and passing codes
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await vehicleAPI.getFilters('car');
        if (res.data.success) {
          setBrands(res.data.data.brands || []);
          setPassingList(res.data.data.passingList || []);
        }
      } catch (err) {
        console.error('Failed to load car filters:', err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch cars when filters change
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const params = {
          type: 'car',
          ...filters,
        };

        // Clean empty keys
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key];
        });

        // Sync with URL params
        setSearchParams(params);

        const res = await vehicleAPI.getAll(params);
        if (res.data.success) {
          setVehicles(res.data.data || []);
          setTotalVehicles(res.data.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch cars:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      brand: '',
      maxPrice: '',
      maxRunning: '',
      fuelType: '',
      transmission: '',
      passing: '',
      ownership: '',
      search: '',
      sort: 'newest',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600 mb-1">
            <Car className="w-4 h-4" />
            <span>Second-Hand Cars Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-950 font-display">
            Used Cars in Kasba Walve
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Showing {totalVehicles} inspected pre-owned cars available with verified documentation.
          </p>
        </div>

        {/* Mobile Filter Button & Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-900 bg-white border border-slate-200 shadow-sm md:hidden"
          >
            <Filter className="w-4 h-4 text-gold-600" />
            <span>Filters</span>
          </button>

          {/* Sort Control */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 hidden sm:inline">Sort by:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="km_asc">Lowest Kilometers</option>
              <option value="year_desc">Latest Model Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Keyword Search Input Bar */}
      <div className="mb-8 relative max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search by car name, passing (e.g. MH 09), or model..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 shadow-xs"
        />
        {filters.search && (
          <button
            onClick={() => handleFilterChange('search', '')}
            className="text-xs text-slate-400 hover:text-slate-600 absolute right-3.5 top-1/2 -translate-y-1/2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Content Layout (Sidebar + Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden md:block md:col-span-1 sticky top-24">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            brands={brands}
            passingList={passingList}
            vehicleType="car"
          />
        </div>

        {/* Vehicles Grid */}
        <div className="md:col-span-3">
          <VehicleGrid
            vehicles={vehicles}
            isLoading={isLoading}
            emptyTitle="No cars match your criteria"
            emptyDescription="Try clearing some filters or searching for another brand or model."
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        brands={brands}
        passingList={passingList}
        vehicleType="car"
      />
    </div>
  );
};

export default Cars;
