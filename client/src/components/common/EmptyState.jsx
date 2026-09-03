import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No vehicles found',
  description = 'Try adjusting your search or filter parameters to find what you are looking for.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center mb-4 border border-navy-100">
        <Icon className="w-8 h-8 text-navy-700" />
      </div>
      <h3 className="text-xl font-bold text-navy-950 mb-2 font-display">{title}</h3>
      <p className="text-slate-500 text-sm max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-navy-900 bg-gold-400 hover:bg-gold-500 shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
