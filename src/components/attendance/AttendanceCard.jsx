import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export default function AttendanceCard({ record, onUpdate, onDelete, index }) {
  const percentage = record.total_classes > 0
    ? Math.round((record.attended_classes / record.total_classes) * 100)
    : 0;

  const getColor = (p) => {
    if (p >= 75) return "text-chart-3";
    if (p >= 60) return "text-chart-4";
    return "text-destructive";
  };

  const getBarColor = (p) => {
    if (p >= 75) return "bg-chart-3";
    if (p >= 60) return "bg-chart-4";
    return "bg-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl border border-border p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold">{record.subject}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {record.attended_classes} / {record.total_classes} classes
          </p>
        </div>
        <span className={cn("text-2xl font-bold", getColor(percentage))}>{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", getBarColor(percentage))}
        />
      </div>

      {/* Warning */}
      {percentage < 75 && (
        <p className="text-xs text-destructive mb-3">
          ⚠️ Need {Math.ceil(record.total_classes * 0.75) - record.attended_classes} more classes to reach 75%
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Attended:</span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() =>
                record.attended_classes > 0 &&
                onUpdate(record.id, { attended_classes: record.attended_classes - 1 })
              }
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{record.attended_classes}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() =>
                onUpdate(record.id, {
                  attended_classes: record.attended_classes + 1,
                  total_classes: Math.max(record.total_classes, record.attended_classes + 1),
                })
              }
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Total:</span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() =>
                record.total_classes > record.attended_classes &&
                onUpdate(record.id, { total_classes: record.total_classes - 1 })
              }
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{record.total_classes}</span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() => onUpdate(record.id, { total_classes: record.total_classes + 1 })}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive ml-2"
            onClick={() => onDelete(record.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}