import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AttendanceChart({ attendance }) {
  const data = attendance.map((a) => ({
    subject: a.subject.length > 10 ? a.subject.slice(0, 10) + "..." : a.subject,
    percentage: a.total_classes > 0 ? Math.round((a.attended_classes / a.total_classes) * 100) : 0,
  }));

  const getColor = (p) => {
    if (p >= 75) return "hsl(var(--chart-3))";
    if (p >= 60) return "hsl(var(--chart-4))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Subject-wise Attendance</h3>
      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">Add subjects to see your chart</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="subject" width={90} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12 }}
                formatter={(v) => [`${v}%`, "Attendance"]}
              />
              <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={getColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}