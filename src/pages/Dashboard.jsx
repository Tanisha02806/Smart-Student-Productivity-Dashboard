import React, { useState, useEffect } from "react";
import { base44 } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, ClipboardCheck, Timer, CheckCircle2 } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import ProductivityScore from "@/components/dashboard/ProductivityScore";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => base44.entities.Assignment.list("-created_date"),
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => base44.entities.Attendance.list(),
  });

  const { data: focusSessions = [] } = useQuery({
    queryKey: ["focusSessions"],
    queryFn: () => base44.entities.FocusSession.list("-created_date"),
  });

  const completedCount = assignments.filter((a) => a.status === "completed").length;
  const totalFocusMin = focusSessions
    .filter((s) => s.session_type === "focus")
    .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const avgAttendance = attendance.length > 0
    ? Math.round(
        attendance.reduce((s, a) => s + (a.attended_classes / Math.max(a.total_classes, 1)) * 100, 0) /
          attendance.length
      )
    : 0;

  const firstName = user?.full_name?.split(" ")[0] || "Student";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, <span className="text-primary">{firstName}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your academic overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Assignments"
          value={assignments.length}
          subtitle={`${completedCount} completed`}
          icon={BookOpen}
          colorClass="bg-primary"
          delay={0}
        />
        <StatsCard
          title="Completed"
          value={`${assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 0}%`}
          subtitle="Completion rate"
          icon={CheckCircle2}
          colorClass="bg-chart-3"
          delay={0.1}
        />
        <StatsCard
          title="Focus Time"
          value={`${Math.round(totalFocusMin / 60)}h`}
          subtitle={`${totalFocusMin} minutes total`}
          icon={Timer}
          colorClass="bg-accent"
          delay={0.2}
        />
        <StatsCard
          title="Attendance"
          value={`${avgAttendance}%`}
          subtitle={`${attendance.length} subjects`}
          icon={ClipboardCheck}
          colorClass="bg-chart-5"
          delay={0.3}
        />
      </div>

      {/* Charts and Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WeeklyChart focusSessions={focusSessions} />
          <UpcomingDeadlines assignments={assignments} />
        </div>
        <div>
          <ProductivityScore
            assignments={assignments}
            focusSessions={focusSessions}
            attendance={attendance}
          />
        </div>
      </div>
    </div>
  );
}