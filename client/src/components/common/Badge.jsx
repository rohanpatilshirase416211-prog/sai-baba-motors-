import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    primary: 'bg-navy-50 text-navy-900 border-navy-200 font-semibold',
    gold: 'bg-gold-50 text-gold-700 border-gold-300 font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    sold: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
    dark: 'bg-navy-950 text-white border-navy-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
