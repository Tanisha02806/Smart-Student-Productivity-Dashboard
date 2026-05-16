import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import AttendanceCard from "@/components/attendance/AttendanceCard";
import AttendanceChart from "@/components/attendance/AttendanceChart";

export default function AttendancePage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", total_classes: 0, attended_classes: 0 });
  const queryClient = useQueryClient();

  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => base44.entities.Attendance.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Attendance.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      setForm({ subject: "", total_classes: 0, attended_classes: 0 });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Attendance.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Attendance.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
            <p className="text-muted-foreground text-sm mt-1">Monitor your class attendance</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> Add Subject</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader><DialogTitle>Add Subject</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject Name</Label>
                  <Input placeholder="e.g. Physics" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Classes</Label>
                    <Input type="number" min={0} value={form.total_classes} onChange={(e) => setForm({ ...form, total_classes: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Attended</Label>
                    <Input type="number" min={0} value={form.attended_classes} onChange={(e) => setForm({ ...form, attended_classes: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <Button type="submit" className="w-full">Add Subject</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <AttendanceChart attendance={attendance} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attendance.map((record, i) => (
          <AttendanceCard
            key={record.id}
            record={record}
            index={i}
            onUpdate={(id, data) => updateMutation.mutate({ id, data })}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        ))}
        {attendance.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <p className="text-lg">No subjects added yet</p>
            <p className="text-sm mt-1">Click "Add Subject" to start tracking attendance</p>
          </div>
        )}
      </div>
    </div>
  );
}