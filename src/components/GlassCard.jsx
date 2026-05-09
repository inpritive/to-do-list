import { motion } from "framer-motion";

const GlassCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/45 ${className}`}
  >
    {children}
  </motion.div>
);

export default GlassCard;
