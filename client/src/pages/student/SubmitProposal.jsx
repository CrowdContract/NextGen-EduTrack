import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FileText, Send } from "lucide-react";
import { submitProjectProposal } from "../../store/slices/studentSlice";

const SubmitProposal = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(submitProjectProposal(formData));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-lg"
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Submit Project Proposal</h1>
            <p className="text-blue-100 text-sm mt-0.5">
              Describe your FYP idea clearly and concisely
            </p>
          </div>
        </div>
      </motion.div>

      {/* FORM CARD — glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-2xl border border-white/10 dark:border-white/5 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-6 space-y-5"
      >
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your project title"
              required
              className="input-field"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of your project goals, methodology, and expected outcomes..."
              required
              rows={5}
              className="input-field resize-none"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 text-right">
              {formData.description.length}/200
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-md disabled:opacity-60 transition-all"
            >
              <Send size={15} />
              {isLoading ? "Submitting..." : "Submit Proposal"}
            </motion.button>
          </div>

        </form>
      </motion.div>

    </div>
  );
};

export default SubmitProposal;
