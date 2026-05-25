import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";

const AnyDialog = /** @type {any} */ (Dialog);
const AnyDialogContent = /** @type {any} */ (DialogContent);
const AnyDialogHeader = /** @type {any} */ (DialogHeader);
const AnyDialogTitle = /** @type {any} */ (DialogTitle);
const AnyDialogTrigger = /** @type {any} */ (DialogTrigger);
const AnyButton = /** @type {any} */ (Button);
const AnyInput = /** @type {any} */ (Input);
const AnyTextarea = /** @type {any} */ (Textarea);
const AnySelect = /** @type {any} */ (Select);
const AnySelectContent = /** @type {any} */ (SelectContent);
const AnySelectItem = /** @type {any} */ (SelectItem);
const AnySelectTrigger = /** @type {any} */ (SelectTrigger);
const AnySelectValue = /** @type {any} */ (SelectValue);
const AnyLabel = /** @type {any} */ (Label);

/**
 * @param {{ onAdd: (assignment: any) => Promise<void> | void }} props
 */
export default function AddAssignmentDialog({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", subject: "", description: "", priority: "medium", due_date: "", status: "todo"
  });

  /** @param {import("react").FormEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject) return;
    await onAdd(form);
    setForm({ title: "", subject: "", description: "", priority: "medium", due_date: "", status: "todo" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Assignment title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              placeholder="e.g. Mathematics"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="h-20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Create Assignment</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}