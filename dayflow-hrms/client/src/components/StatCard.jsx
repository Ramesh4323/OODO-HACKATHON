import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', className = '' }) => {
  return (
    <div className={`neu-card neu-card-hover p-6 flex items-start justify-between group cursor-pointer ${className}`}>
      <div className="space-y-1">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight transition-transform duration-300 group-hover:translate-x-1">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 font-semibold">{subtitle}</p>}
      </div>

      {Icon && (
        <div className="w-11 h-11 neu-inset flex items-center justify-center text-blue-600 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
