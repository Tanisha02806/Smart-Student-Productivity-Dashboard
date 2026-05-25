import { useEffect, useState } from "react";
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import {
  BookOpen,
  ClipboardCheck,
  Timer,
  CheckCircle2,
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import ProductivityScore from "../components/dashboard/ProductivityScore";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get("/auth/profile");

        setUser(res?.user || res || null);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  const assignmentsQuery = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      try {
        return await api.get("/assignments");
      } catch {
        return [];
      }
    },
  });

  const attendanceQuery = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      try {
        return await api.get("/attendance");
      } catch {
        return [];
      }
    },
  });

  const focusQuery = useQuery({
    queryKey: ["focus"],
    queryFn: async () => {
      try {
        return await api.get("/focus");
      } catch {
        return [];
      }
    },
  });

  const assignments = assignmentsQuery.data || [];
  const attendance = attendanceQuery.data || [];
  const focusSessions = focusQuery.data || [];

  const completedCount = assignments.filter(
    (a) => a?.status === "completed"
  ).length;

  const totalFocusMin = focusSessions.reduce(
    (sum, item) =>
      sum + (item?.duration_minutes || 0),
    0
  );

  const avgAttendance =
    attendance.length > 0
      ? Math.round(
          attendance.reduce(
            (s, a) =>
              s +
              ((a?.attended_classes || 0) /
                Math.max(a?.total_classes || 1, 1)) *
                100,
            0
          ) / attendance.length
        )
      : 0;

  const firstName =
    user?.full_name?.split(" ")[0] ||
    user?.name ||
    "Student";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-3xl font-bold">
          Welcome back{" "}
          <span className="text-primary">
            {firstName}
          </span>
          👋
        </h1>

        <p className="text-muted-foreground">
          Here's your academic overview
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Assignments"
          value={assignments.length}
          subtitle={`${completedCount} completed`}
          icon={BookOpen}
        />

        <StatsCard
          title="Completed"
          value={`${
            assignments.length
              ? Math.round(
                  (completedCount /
                    assignments.length) *
                    100
                )
              : 0
          }%`}
          icon={CheckCircle2}
        />

        <StatsCard
          title="Focus"
          value={`${Math.round(
            totalFocusMin / 60
          )}h`}
          icon={Timer}
        />

        <StatsCard
          title="Attendance"
          value={`${avgAttendance}%`}
          icon={ClipboardCheck}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyChart
            focusSessions={focusSessions}
          />

          <UpcomingDeadlines
            assignments={assignments}
          />
        </div>

        <ProductivityScore
          assignments={assignments}
          attendance={attendance}
          focusSessions={focusSessions}
        />
      </div>
    </div>
  );
}