// @ts-nocheck
import { useState } from "react";
import api from "../api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import AssignmentCard from "../components/assignments/AssignmentCard";
import AddAssignmentDialog from "../components/assignments/AddAssignmentDialog";

const columns = [
  { key: "todo", label: "To Do", color: "bg-muted-foreground" },
  { key: "in_progress", label: "In Progress", color: "bg-primary" },
  { key: "completed", label: "Completed", color: "bg-chart-3" },
];

export default function Assignments() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => api.get("/assignments?sort=-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/assignments", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/assignments/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/assignments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments"] }),
  });

  const subjects = [...new Set(assignments.map((a) => a.subject).filter(Boolean))];

  const filtered = assignments.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || a.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground text-sm mt-1">Track and manage your coursework</p>
          </div>
          <AddAssignmentDialog onAdd={(data) => createMutation.mutateAsync(data)} />
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Kanban Board */}
      <div className="grid md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const items = filtered.filter((a) => a.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                <AnimatePresence>
                  {items.map((a) => (
                    <AssignmentCard
                      key={a.id}
                      assignment={a}
                      onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                      onDelete={(id) => deleteMutation.mutate(id)}
                    />
                  ))}
                </AnimatePresence>
                {items.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-xs border border-dashed border-border rounded-xl">
                    No assignments
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}