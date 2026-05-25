// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { cn } from "../lib/utils";
import { format } from "date-fns";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export default function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("focus"); // "focus" | "break"
  const [subject, setSubject] = useState("");
  const intervalRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery({
    queryKey: ["focusSessions"],
    queryFn: () => api.entities.FocusSession.list("-created_date", 20),
  });

  const createSession = useMutation({
    mutationFn: (data) => api.entities.FocusSession.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["focusSessions"] }),
  });

  const totalDuration = mode === "focus" ? FOCUS_DURATION : BREAK_DURATION;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const saveSession = useCallback(() => {
    const elapsed = totalDuration - timeLeft;
    if (elapsed > 0) {
      createSession.mutate({
        duration_minutes: Math.round(elapsed / 60),
        session_type: mode,
        subject: subject || "General",
        completed: timeLeft === 0,
        date: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [totalDuration, timeLeft, mode, subject]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      saveSession();
      // Auto switch mode
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(BREAK_DURATION);
      } else {
        setMode("focus");
        setTimeLeft(FOCUS_DURATION);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, mode, saveSession]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? FOCUS_DURATION : BREAK_DURATION);
  };

  const switchMode = (newMode) => {
    if (isRunning) {
      saveSession();
    }
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === "focus" ? FOCUS_DURATION : BREAK_DURATION);
  };

  const circumference = 2 * Math.PI * 120;
  const offset = circumference - (progress / 100) * circumference;

  const todaySessions = sessions.filter(
    (s) => s.date === format(new Date(), "yyyy-MM-dd") && s.session_type === "focus"
  );
  const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold">Focus Timer</h1>
        <p className="text-muted-foreground text-sm mt-1">Stay focused with the Pomodoro technique</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center"
        >
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-8">
            <Button
              variant={mode === "focus" ? "default" : "outline"}
              className="gap-2"
              onClick={() => switchMode("focus")}
            >
              <Brain className="w-4 h-4" /> Focus
            </Button>
            <Button
              variant={mode === "break" ? "default" : "outline"}
              className="gap-2"
              onClick={() => switchMode("break")}
            >
              <Coffee className="w-4 h-4" /> Break
            </Button>
          </div>

          {/* Circle Timer */}
          <div className="relative w-64 h-64 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
              <circle cx="130" cy="130" r="120" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
              <motion.circle
                cx="130" cy="130" r="120"
                fill="none"
                stroke={mode === "focus" ? "hsl(var(--primary))" : "hsl(var(--chart-3))"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold tracking-tight tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <span className="text-sm text-muted-foreground capitalize mt-1">
                {mode === "focus" ? "Focus Time" : "Break Time"}
              </span>
            </div>
          </div>

          {/* Subject */}
          <Input
            placeholder="What are you studying?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="max-w-xs text-center mb-6"
          />

          {/* Controls */}
          <div className="flex items-center gap-3">
            <Button size="lg" variant="outline" className="w-12 h-12 p-0 rounded-full" onClick={resetTimer}>
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className={cn("w-16 h-16 p-0 rounded-full shadow-lg", mode === "break" && "bg-chart-3 hover:bg-chart-3/90")}
              onClick={toggleTimer}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </Button>
          </div>
        </motion.div>

        {/* Stats & History */}
        <div className="space-y-4">
          {/* Today Stats */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-4">Today's Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-primary">{todaySessions.length}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-accent">{todayMinutes}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold mb-4">Recent Sessions</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {sessions.slice(0, 10).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    {s.session_type === "focus" ? (
                      <Brain className="w-4 h-4 text-primary" />
                    ) : (
                      <Coffee className="w-4 h-4 text-chart-3" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{s.subject || "General"}</p>
                      <p className="text-xs text-muted-foreground">{s.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{s.duration_minutes}m</span>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  Start a focus session to see history
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}