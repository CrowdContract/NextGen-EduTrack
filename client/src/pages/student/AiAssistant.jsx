import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Trash2, Sparkles, User, FileText, CheckSquare, Square, ChevronDown } from "lucide-react";
import { sendChatMessage, addUserMessage, clearChat, summarizeProject } from "../../store/slices/aiSlice";
import { fetchProject } from "../../store/slices/studentSlice";

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? "bg-blue-600" : "bg-gradient-to-br from-purple-500 to-indigo-600"
      }`}>
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>
      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "bg-blue-600 text-white rounded-tr-sm"
          : "bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-tl-sm"
      }`}>
        {msg.content}
      </div>
    </motion.div>
  );
};

const AiAssistant = () => {
  const dispatch = useDispatch();
  const { chatMessages, chatLoading, summary, loading } = useSelector((s) => s.ai);
  const { project } = useSelector((s) => s.student);
  const [input, setInput] = useState("");
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [filesOpen, setFilesOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // auto-select all files when project loads
  useEffect(() => {
    if (project?.files?.length) {
      setSelectedFileIds(project.files.map((f) => f._id));
    }
  }, [project]);

  const toggleFile = (id) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedFileIds.length === project?.files?.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(project.files.map((f) => f._id));
    }
  };

  const dispatchChat = (text, history) => {
    dispatch(sendChatMessage({
      messages: history,
      projectId: project?._id,
      selectedFileIds,
    }));
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || chatLoading) return;
    setInput("");
    dispatch(addUserMessage(text));
    dispatchChat(text, [...chatMessages, { role: "user", content: text }]);
  };

  const handleQuick = (text) => {
    dispatch(addUserMessage(text));
    dispatchChat(text, [...chatMessages, { role: "user", content: text }]);
  };

  const files = project?.files || [];
  const hasFiles = files.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-white shadow-lg"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Project Assistant</h1>
              <p className="text-purple-200 text-sm mt-0.5">
                Powered by LLaMA 3.3 · Ask anything about your project
              </p>
            </div>
          </div>
          {project && (
            <div className="text-right text-xs text-purple-200">
              <p className="font-medium truncate max-w-[160px]">{project.title}</p>
              <p>{files.length} file{files.length !== 1 ? "s" : ""} · {selectedFileIds.length} selected</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* FILE SELECTOR */}
      {hasFiles && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 overflow-hidden"
        >
          <button
            onClick={() => setFilesOpen(!filesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-purple-500" />
              Context Files
              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs">
                {selectedFileIds.length}/{files.length} selected
              </span>
            </div>
            <ChevronDown
              size={15}
              className={`transition-transform ${filesOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {filesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="p-3 space-y-1">
                  {/* Select all */}
                  <button
                    onClick={toggleAll}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                  >
                    {selectedFileIds.length === files.length
                      ? <CheckSquare size={14} className="text-purple-500" />
                      : <Square size={14} />}
                    Select all files
                  </button>

                  {files.map((file) => {
                    const selected = selectedFileIds.includes(file._id);
                    return (
                      <button
                        key={file._id}
                        onClick={() => toggleFile(file._id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                          selected
                            ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                            : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5"
                        }`}
                      >
                        {selected
                          ? <CheckSquare size={14} className="text-purple-500 shrink-0" />
                          : <Square size={14} className="shrink-0" />}
                        <FileText size={13} className="shrink-0" />
                        <span className="truncate">{file.originalName}</span>
                        <span className="ml-auto text-slate-400 dark:text-slate-500 shrink-0">
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedFileIds.length > 0 && (
                  <div className="px-4 pb-3">
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      ✓ AI will read {selectedFileIds.length} file{selectedFileIds.length !== 1 ? "s" : ""} when answering
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* QUICK ACTIONS */}
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          <button
            onClick={() => project?._id && dispatch(summarizeProject(project._id))}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-all disabled:opacity-60"
          >
            <Sparkles size={14} className="text-purple-500" />
            {loading ? "Summarizing..." : "Summarize Project"}
          </button>
          <button
            onClick={() => handleQuick("What are the key challenges in my project based on the uploaded files?")}
            disabled={chatLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-all disabled:opacity-60"
          >
            Key Challenges
          </button>
          <button
            onClick={() => handleQuick("Suggest improvements for my project based on the uploaded files")}
            disabled={chatLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-all disabled:opacity-60"
          >
            Suggest Improvements
          </button>
        </motion.div>
      )}

      {/* SUMMARY */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-purple-500" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">AI Summary</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{summary}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 overflow-hidden"
      >
        <div className="h-96 overflow-y-auto p-5 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Bot size={28} className="text-white" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                {hasFiles && selectedFileIds.length > 0
                  ? `I have access to ${selectedFileIds.length} of your file${selectedFileIds.length !== 1 ? "s" : ""}. Ask me anything about them.`
                  : "Ask me anything about your project, methodology, or FYP guidance."}
              </p>
            </div>
          ) : (
            chatMessages.map((msg, i) => <MessageBubble key={i} msg={msg} />)
          )}

          {chatLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/10 dark:bg-white/5 border border-white/10">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-purple-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-white/10 p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={selectedFileIds.length > 0 ? `Ask about your project + ${selectedFileIds.length} file(s)...` : "Ask about your project..."}
            className="input-field flex-1"
          />
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || chatLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl disabled:opacity-50 transition-all"
            >
              <Send size={16} />
            </motion.button>
            {chatMessages.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(clearChat())}
                className="px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default AiAssistant;
