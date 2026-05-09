import { motion } from "framer-motion";

const Sidebar = ({ sections, active, onChange }) => (
  <aside className="w-full rounded-2xl border border-white/15 bg-slate-900/55 p-3 backdrop-blur-xl md:w-64">
    <h1 className="mb-4 bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-xl font-extrabold text-transparent">
      AI ML Journey Tracker
    </h1>
    <nav className="flex gap-2 overflow-auto md:flex-col">
      {sections.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(item.id)}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
            active === item.id
              ? "bg-gradient-to-r from-cyan-500 to-indigo-500 font-semibold text-white shadow-glow"
              : "bg-white/5 text-slate-200 hover:bg-white/15"
          }`}
        >
          <item.icon />
          {item.label}
        </motion.button>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
