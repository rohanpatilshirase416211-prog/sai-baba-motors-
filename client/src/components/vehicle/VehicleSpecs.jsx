import React from 'react';
import {
  Calendar,
  Gauge,
  MapPin,
  Fuel,
  Settings,
  ShieldCheck,
  Paintbrush,
  Zap,
  FileText,
  Car,
} from 'lucide-react';
import { formatKm } from '../../utils/formatters';

const VehicleSpecs = ({ vehicle }) => {
  if (!vehicle) return null;

  const specItems = [
    {
      label: 'Vehicle Type',
      value: vehicle.vehicleType === 'car' ? 'Four-Wheeler (Car)' : 'Two-Wheeler (Bike)',
      icon: Car,
    },
    {
      label: 'Make / Brand',
      value: vehicle.brand,
      icon: ShieldCheck,
    },
    {
      label: 'Model & Variant',
      value: `${vehicle.model} ${vehicle.variant || ''}`.trim(),
      icon: FileText,
    },
    {
      label: 'Model Year',
      value: vehicle.year,
      icon: Calendar,
    },
    {
      label: 'Kilometers Driven',
      value: formatKm(vehicle.running),
      icon: Gauge,
    },
    {
      label: 'Passing / RTO',
      value: vehicle.passing,
      icon: MapPin,
    },
    {
      label: 'Fuel Type',
      value: vehicle.fuelType,
      icon: Fuel,
    },
    {
      label: 'Transmission',
      value: vehicle.transmission,
      icon: Settings,
      hide: !vehicle.transmission || vehicle.transmission === 'N/A',
    },
    {
      label: 'Engine Displacement',
      value: vehicle.engineCC ? `${vehicle.engineCC} cc` : null,
      icon: Zap,
      hide: !vehicle.engineCC,
    },
    {
      label: 'Ownership History',
      value: vehicle.ownership,
      icon: ShieldCheck,
      hide: !vehicle.ownership || vehicle.ownership === 'N/A',
    },
    {
      label: 'Color / Finish',
      value: vehicle.color,
      icon: Paintbrush,
      hide: !vehicle.color,
    },
    {
      label: 'Registration Number',
      value: vehicle.registration || 'Available on request',
      icon: FileText,
      hide: !vehicle.registration,
    },
  ].filter((item) => !item.hide && item.value);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-navy-950 mb-5 font-display flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
        Vehicle Specifications
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specItems.map((spec, idx) => {
          const Icon = spec.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="p-2 rounded-lg bg-white text-navy-800 shadow-2xs border border-slate-200/70 shrink-0">
                <Icon className="w-4 h-4 text-navy-700" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-slate-500 font-medium block">
                  {spec.label}
                </span>
                <span className="text-sm font-bold text-slate-900 truncate block mt-0.5">
                  {spec.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSpecs;
