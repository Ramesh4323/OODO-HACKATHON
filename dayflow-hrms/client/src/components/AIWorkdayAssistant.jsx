import React from 'react';
import { Sparkles, Brain, Flame, Heart, TrendingUp, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

const AIWorkdayAssistant = ({ attendancePercentage = 98, totalDays = 12, pendingLeaves = 0 }) => {
  // Compute Workday Wellness Index (0 - 100)
  const wellnessScore = Math.min(100, Math.max(70, Math.round(attendancePercentage * 0.95 + (10 - pendingLeaves) * 0.5)));
  
  const getInsights = () => {
    if (wellnessScore >= 90) {
      return {
        level: 'OPTIMAL BALANCE & HIGH PERFORMANCE',
        badge: 'pill-teal',
        icon: ShieldCheck,
        tip: 'Outstanding work-life harmony! Your check-in consistency and attendance compliance are in the top 5% of the organization.',
        recommendation: 'Keep maintaining your balanced shift schedule and take planned breaks to sustain peak energy.'
      };
    } else if (wellnessScore >= 80) {
      return {
        level: 'STEADY PRODUCTIVITY',
        badge: 'pill-purple',
        icon: TrendingUp,
        tip: 'Solid attendance record with consistent daily check-ins across the current work cycle.',
        recommendation: 'Consider submitting your upcoming leave requests early to plan team coverage efficiently.'
      };
    } else {
      return {
        level: 'WELLNESS ALERT & BURNOUT RISK',
        badge: 'pill-pink',
        icon: AlertTriangle,
        tip: 'You have logged consecutive full-day shifts without taking a restorative wellness break.',
        recommendation: 'We recommend applying for a paid wellness or leave day this month to recharge.'
      };
    }
  };

  const insight = getInsights();
  const IconComponent = insight.icon;

  return (
    <div className="cloud-card p-6 md:p-8 bg-gradient-to-br from-[#f0f7ff] via-[#ffffff] to-[#e8f4ff] border border-sky-200/80 space-y-6 relative overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl pointer-events-none"></div>

      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-100 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              Dayflow AI Workday Assistant <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </h2>
            <p className="text-xs text-slate-500 font-semibold">Real-time productivity & work-life balance insights</p>
          </div>
        </div>

        <span className={`px-4 py-1.5 text-xs font-black rounded-full ${insight.badge} flex items-center gap-1.5 shadow-sm`}>
          <IconComponent className="w-3.5 h-3.5" /> {insight.level}
        </span>
      </div>

      {/* Gauge Meter & Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center relative z-10">
        
        {/* Score Radial Box */}
        <div className="p-5 bg-white/90 rounded-2xl border border-sky-100 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">Workday Wellness Score</span>
          <div className="my-2 relative flex items-center justify-center">
            <span className="text-4xl font-black text-slate-900 tracking-tight">{wellnessScore}</span>
            <span className="text-xs font-black text-sky-600 absolute -top-1 -right-4">/100</span>
          </div>
          <div className="w-full bg-sky-100 h-2 rounded-full overflow-hidden mt-1">
            <div className="bg-gradient-to-r from-sky-400 to-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${wellnessScore}%` }}></div>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="md:col-span-2 p-5 bg-sky-50/80 rounded-2xl border border-sky-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-sky-800">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-400" /> Smart AI Diagnostic
          </div>
          <p className="text-xs font-bold text-slate-800 leading-relaxed">
            "{insight.tip}"
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] font-semibold text-slate-600">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400 shrink-0" />
            <span><strong className="text-slate-900">Recommendation:</strong> {insight.recommendation}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AIWorkdayAssistant;
