import React from 'react';
import VehicleCard from './VehicleCard';
import EmptyState from '../common/EmptyState';

const VehicleGrid = ({
  vehicles = [],
  isLoading = false,
  emptyTitle = 'No vehicles found',
  emptyDescription = 'Try changing your filters or check back soon for fresh arrivals.',
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse flex flex-col"
          >
            <div className="aspect-[16/10] bg-slate-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded w-2/5 my-3" />
              <div className="h-12 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-200 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilters ? 'Reset All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  );
};

export default VehicleGrid;
