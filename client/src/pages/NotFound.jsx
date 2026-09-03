import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <span className="text-6xl sm:text-8xl font-black text-navy-950 font-display">
        404
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-display">
        Page Not Found
      </h2>
      <p className="text-slate-500 text-sm max-w-sm">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex items-center gap-3 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
