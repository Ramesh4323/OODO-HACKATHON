import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 22)); // August 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate days for grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const selectedDay = 22;

  return (
    <div className="cloud-calendar-card p-6 shadow-xl relative overflow-hidden">
      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-black text-white tracking-tight">
          {monthNames[month]} {year}
        </h3>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-blue-100/90 mb-3 uppercase tracking-wider">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center gap-y-2 text-xs font-bold">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`}></div>;
          }
          const isSelected = day === selectedDay && month === 7 && year === 2026;
          return (
            <div key={`day-${day}`} className="flex items-center justify-center py-1">
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-transform ${
                  isSelected
                    ? 'bg-white text-[#0066ff] font-black shadow-md scale-110'
                    : 'hover:bg-white/20 text-white cursor-pointer'
                }`}
              >
                {day < 10 ? `0${day}` : day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;
