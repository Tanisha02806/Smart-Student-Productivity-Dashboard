import React from "react";
import { motion } from "framer-motion";
import { format, differenceInDays, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityStyles = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  low: "bg-chart-3/10 text-chart-3 border-chart-3/20",
};

export default function UpcomingDeadlines({ assignments }) {
  const upcoming = assignments
    .filter((a) => a.status !== "completed" && a.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
        <p className="text-muted-foreground text-sm text-center py-8">No upcoming deadlines — nice!</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
      <div className="space-y-3">
        {upcoming.map((a, i) => {
          const daysLeft = differenceInDays(new Date(a.due_date), new Date());
          const overdue = isPast(new Date(a.due_date));
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.subject}</p>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <Badge variant="outline" className={cn("text-[10px]", priorityStyles[a.priority])}>
                  {a.priority}
                </Badge>
                <span className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  overdue ? "text-destructive" : daysLeft <= 2 ? "text-chart-5" : "text-muted-foreground"
                )}>
                  {overdue ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {overdue ? "Overdue" : daysLeft === 0 ? "Today" : `${daysLeft}d`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}