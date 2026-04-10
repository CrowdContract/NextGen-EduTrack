import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const DashboardLayout = ({ userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] pt-16 transition-colors duration-300">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userRole={userRole} />

      <div className="flex">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} userRole={userRole} />

        <main
          className="flex-1 transition-all duration-300"
          style={{ marginLeft: sidebarOpen ? 220 : 64 }}
        >
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
