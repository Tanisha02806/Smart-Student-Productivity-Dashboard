import React, { useState } from "react";
import { base44 } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Trash2, FileText, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Notes() {
  const [search, setSearch] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", subject: "", tags: "" });
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: () => base44.entities.Note.list("-updated_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Note.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setForm({ title: "", content: "", subject: "", tags: "" });
      setAddOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Note.update(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Note.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNote(null);
    },
  });

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.subject || "").toLowerCase().includes(search.toLowerCase()) ||
    (n.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Notes</h1>
            <p className="text-muted-foreground text-sm mt-1">Your study notes in one place</p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> New Note</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Create Note</DialogTitle></DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const tags = form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
                createMutation.mutate({ ...form, tags });
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Note title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="e.g. Biology" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Content (Markdown supported)</Label>
                  <Textarea placeholder="Write your notes..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="h-40 font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>Tags (comma separated)</Label>
                  <Input placeholder="exam, chapter1, important" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">Create Note</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {filtered.map((note) => (
              <motion.button
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => { setSelectedNote(note); setEditing(false); }}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  selectedNote?.id === note.id
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card border-border hover:border-primary/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm truncate">{note.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{note.subject || "No subject"}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(note.updated_date), "MMM d, h:mm a")}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-12">No notes found</p>
          )}
        </div>

        {/* Note Detail */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                {editing ? (
                  <Input
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                    className="text-xl font-bold"
                  />
                ) : (
                  <h2 className="text-xl font-bold">{selectedNote.title}</h2>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (editing) {
                        updateMutation.mutate({ id: selectedNote.id, data: { title: selectedNote.title, content: selectedNote.content } });
                      } else {
                        setEditing(true);
                      }
                    }}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    {editing ? "Save" : "Edit"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deleteMutation.mutate(selectedNote.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {selectedNote.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedNote.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">{t}</span>
                  ))}
                </div>
              )}
              {editing ? (
                <Textarea
                  value={selectedNote.content || ""}
                  onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                  className="h-96 font-mono text-sm"
                />
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{selectedNote.content || "*No content*"}</ReactMarkdown>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Select a note to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}