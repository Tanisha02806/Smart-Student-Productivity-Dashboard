import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityStyles = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-chart-4/10 text-chart-4",
  low: "bg-chart-3/10 text-chart-3",
};

const statusNext = {
  todo: "in_progress",
  in_progress: "completed",
};

export default function AssignmentCard({ assignment, onUpdate, onDelete }) {
  const { title, subject, priority, due_date, status, description } = assignment;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold text-sm truncate", status === "completed" && "line-through text-muted-foreground")}>
            {title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">{subject}</p>
        </div>
        <Badge className={cn("text-[10px] ml-2 flex-shrink-0", priorityStyles[priority])}>
          {priority}
        </Badge>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{description}</p>
      )}

      <div className="flex items-center justify-between">
        {due_date && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(due_date), "MMM d")}
          </span>
        )}
        <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          {statusNext[status] && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs gap-1"
              onClick={() => onUpdate(assignment.id, { status: statusNext[status] })}
            >
              <ArrowRight className="w-3 h-3" />
              {statusNext[status] === "in_progress" ? "Start" : "Done"}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(assignment.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}