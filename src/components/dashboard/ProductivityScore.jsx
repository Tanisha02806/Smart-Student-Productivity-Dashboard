import React from "react";
import { motion } from "framer-motion";

export default function ProductivityScore({ assignments, focusSessions, attendance }) {
  // Calculate score components
  const completedRatio = assignments.length > 0
    ? assignments.filter(a => a.status === "completed").length / assignments.length
    : 0;
  
  const totalFocusMinutes = focusSessions
    .filter(s => s.session_type === "focus" && s.completed)
    .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const focusScore = Math.min(totalFocusMinutes / 600, 1); // 10 hours = max
  
  const avgAttendance = attendance.length > 0
    ? attendance.reduce((sum, a) => sum + (a.attended_classes / Math.max(a.total_classes, 1)), 0) / attendance.length
    : 0;

  const score = Math.round((completedRatio * 40 + focusScore * 30 + avgAttendance * 30));

  const getColor = (s) => {
    if (s >= 80) return "text-chart-3";
    if (s >= 60) return "text-primary";
    if (s >= 40) return "text-chart-4";
    return "text-destructive";
  };

  const getLabel = (s) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Average";
    return "Needs Work";
  };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card rounded-2xl p-6 border border-border flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 self-start">Productivity Score</h3>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getColor(score)}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <p className={`mt-3 font-semibold text-sm ${getColor(score)}`}>{getLabel(score)}</p>
      <div className="mt-4 w-full space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Assignments</span>
          <span className="font-medium text-foreground">{Math.round(completedRatio * 100)}%</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Focus Time</span>
          <span className="font-medium text-foreground">{Math.round(totalFocusMinutes / 60)}h</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Attendance</span>
          <span className="font-medium text-foreground">{Math.round(avgAttendance * 100)}%</span>
        </div>
      </div>
    </div>
  );
}