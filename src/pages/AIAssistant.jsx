import { useState } from "react";
import api from "../api/api";
import { motion } from "framer-motion";
import { Sparkles, Loader2, BookOpen, HelpCircle, Layers } from "lucide-react";
import ReactMarkdown from "react-markdown";

const modes = [
  { key: "summarize", label: "Summarize", icon: BookOpen, prompt: "Summarize the following study material concisely with key points and takeaways:\n\n" },
  { key: "questions", label: "Generate Questions", icon: HelpCircle, prompt: "Generate 5-10 study questions based on the following material. Include a mix of multiple choice and short answer:\n\n" },
  { key: "flashcards", label: "Flashcards", icon: Layers, prompt: "Create 8-10 flashcards (Q&A format) from the following material. Format each as:\n**Q:** question\n**A:** answer\n\n" },
];

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("summarize");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  /** @param {import("react").ChangeEvent<HTMLTextAreaElement>} e */
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult("");
    const currentMode = modes.find((m) => m.key === mode) || modes[0];

    try {
      const response = await api.post("/ai", {
        prompt: currentMode.prompt + input,
      });
      setResult(response?.data ?? response ?? "");
    } catch (error) {
      setResult("Failed to generate AI content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentMode = modes.find((m) => m.key === mode) || modes[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold">AI Study Assistant</h1>
        <p className="text-muted-foreground text-sm mt-1">Let AI help you study smarter</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Input Material
          </h3>

          {/* Mode Selector */}
          <div className="flex flex-wrap gap-2">
            {modes.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition ${
                  mode === m.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-transparent text-muted-foreground hover:border-primary hover:text-primary"
                }`}
                onClick={() => setMode(m.key)}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Paste your study material, notes, or text here..."
            value={input}
            onChange={handleInputChange}
            className="w-full h-64 rounded-2xl border border-border bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Generating..." : `Generate ${currentMode.label}`}
          </button>
        </div>

        {/* Output */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Result</h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">AI is working on it...</p>
            </div>
          ) : result ? (
            <div className="prose prose-sm max-w-none dark:prose-invert max-h-[500px] overflow-y-auto">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Your AI-generated content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}