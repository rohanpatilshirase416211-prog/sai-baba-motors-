import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'navy', subtitle }) => {
  const colorMap = {
    navy: 'bg-navy-50 text-navy-900 border-navy-100',
    gold: 'bg-gold-50 text-gold-700 border-gold-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black text-slate-900 font-display">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
          colorMap[color] || colorMap.navy
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatCard;
