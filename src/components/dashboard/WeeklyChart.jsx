import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { subDays, format, isSameDay, parseISO } from "date-fns";

export default function WeeklyChart({ focusSessions }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStr = format(date, "yyyy-MM-dd");
    const minutes = focusSessions
      .filter((s) => s.session_type === "focus" && s.date && isSameDay(parseISO(s.date), date))
      .reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    return {
      day: format(date, "EEE"),
      minutes,
      hours: Math.round((minutes / 60) * 10) / 10,
    };
  });

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Weekly Study Hours</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7Days} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              unit="h"
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: 12,
              }}
              formatter={(value) => [`${value}h`, "Study Time"]}
            />
            <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}