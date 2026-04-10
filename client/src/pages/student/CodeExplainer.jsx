import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Sparkles, X, Copy, Check, Wand2 } from "lucide-react";
import {
  explainCode, clearCodeExplanation,
  generateCode, clearGeneratedCode,
} from "../../store/slices/aiSlice";

const LANGUAGES = ["Auto-detect", "JavaScript", "Python", "Java", "C++", "C", "TypeScript", "PHP", "Go", "Rust", "SQL", "Bash"];

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 transition-all"
      style={{ background: "var(--neu-bg)", boxShadow: "2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)" }}
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const OutputPanel = ({ title, content, onClear, loading, emptyIcon, emptyText }) => (
  <div
    className="rounded-2xl overflow-hidden transition-all duration-300"
    style={{ background: "var(--neu-bg)", boxShadow: "6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light)" }}
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/40 dark:border-white/10">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
      {content && (
        <div className="flex gap-2">
          <CopyButton text={content} />
          <button onClick={onClear} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={14} />
          </button>
        </div>
      )}
    </div>

    <div className="h-80 overflow-y-auto p-4">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-3 justify-center">
            {[80, 55, 90, 45, 70, 60].map((w, i) => (
              <div key={i} className="skeleton h-3.5 rounded" style={{ width: `${w}%` }} />
            ))}
          </motion.div>
        ) : content ? (
          <motion.pre
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono"
          >
            {content}
          </motion.pre>
        ) : (
          <motion.div key="empty" className="h-full flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 0 20px rgba(34,197,94,0.3)" }}>
              {emptyIcon}
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm">{emptyText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const CodeExplainer = () => {
  const dispatch = useDispatch();
  const { codeExplanation, generatedCode, loading } = useSelector((s) => s.ai);
  const [tab, setTab] = useState("explain"); // "explain" | "generate"
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("Auto-detect");

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #059669, #0d9488)", boxShadow: "0 8px 30px rgba(5,150,105,0.35), 6px 6px 14px var(--neu-shadow-dark)" }}
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <Code2 size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Code Tools</h1>
            <p className="text-emerald-100 text-sm mt-0.5">
              Explain existing code or generate new code from a description
            </p>
          </div>
        </div>
      </motion.div>

      {/* TABS */}
      <div
        className="flex rounded-2xl p-1 gap-1"
        style={{ background: "var(--neu-bg)", boxShadow: "inset 3px 3px 8px var(--neu-shadow-dark), inset -3px -3px 8px var(--neu-shadow-light)" }}
      >
        {[
          { id: "explain", label: "Explain Code", icon: <Code2 size={15} /> },
          { id: "generate", label: "Generate Code", icon: <Wand2 size={15} /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200"
            style={tab === t.id ? {
              background: "linear-gradient(135deg, #059669, #0d9488)",
              color: "white",
              boxShadow: "0 4px 12px rgba(5,150,105,0.4), 3px 3px 8px var(--neu-shadow-dark)"
            } : {
              color: "var(--tw-text-opacity, #64748b)"
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* PANELS */}
      <AnimatePresence mode="wait">
        {tab === "explain" ? (
          <motion.div
            key="explain"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* Input */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--neu-bg)", boxShadow: "6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light)" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/40 dark:border-white/10">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Your Code</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs px-2 py-1 rounded-lg focus:outline-none text-slate-700 dark:text-slate-300"
                  style={{ background: "var(--neu-bg)", boxShadow: "2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)" }}
                >
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your code here..."
                className="w-full h-72 p-4 bg-transparent text-sm font-mono text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-none"
              />
              <div className="px-4 py-3 border-t border-slate-200/40 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">{code.length} chars</span>
                <div className="flex gap-2">
                  {code && (
                    <button onClick={() => setCode("")} className="text-xs px-3 py-1.5 rounded-lg text-slate-500 transition-all"
                      style={{ background: "var(--neu-bg)", boxShadow: "2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)" }}>
                      Clear
                    </button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => code.trim() && dispatch(explainCode({ code, language: language === "Auto-detect" ? "" : language }))}
                    disabled={!code.trim() || loading}
                    className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white rounded-xl disabled:opacity-60 transition-all"
                    style={{ background: "linear-gradient(135deg, #059669, #0d9488)", boxShadow: "0 4px 12px rgba(5,150,105,0.35)" }}
                  >
                    <Sparkles size={13} />
                    {loading ? "Analyzing..." : "Explain Code"}
                  </motion.button>
                </div>
              </div>
            </div>

            <OutputPanel
              title="AI Explanation"
              content={codeExplanation}
              onClear={() => dispatch(clearCodeExplanation())}
              loading={loading && !codeExplanation}
              emptyIcon={<Code2 size={22} className="text-white" />}
              emptyText="Paste your code and click Explain"
            />
          </motion.div>
        ) : (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* Prompt Input */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--neu-bg)", boxShadow: "6px 6px 14px var(--neu-shadow-dark), -6px -6px 14px var(--neu-shadow-light)" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/40 dark:border-white/10">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Describe What You Need</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs px-2 py-1 rounded-lg focus:outline-none text-slate-700 dark:text-slate-300"
                  style={{ background: "var(--neu-bg)", boxShadow: "2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)" }}
                >
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe what you want to build...\n\nExamples:\n• A function to sort an array of objects by a key\n• REST API endpoint for user authentication\n• Binary search tree implementation\n• React hook for debouncing input`}
                className="w-full h-72 p-4 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
              />

              <div className="px-4 py-3 border-t border-slate-200/40 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">{prompt.length} chars</span>
                <div className="flex gap-2">
                  {prompt && (
                    <button onClick={() => setPrompt("")} className="text-xs px-3 py-1.5 rounded-lg text-slate-500 transition-all"
                      style={{ background: "var(--neu-bg)", boxShadow: "2px 2px 5px var(--neu-shadow-dark), -2px -2px 5px var(--neu-shadow-light)" }}>
                      Clear
                    </button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => prompt.trim() && dispatch(generateCode({ prompt, language: language === "Auto-detect" ? "" : language }))}
                    disabled={!prompt.trim() || loading}
                    className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white rounded-xl disabled:opacity-60 transition-all"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}
                  >
                    <Wand2 size={13} />
                    {loading ? "Generating..." : "Generate Code"}
                  </motion.button>
                </div>
              </div>
            </div>

            <OutputPanel
              title="Generated Code"
              content={generatedCode}
              onClear={() => dispatch(clearGeneratedCode())}
              loading={loading && !generatedCode}
              emptyIcon={<Wand2 size={22} className="text-white" />}
              emptyText="Describe what you need and click Generate"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CodeExplainer;
