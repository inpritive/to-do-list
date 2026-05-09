import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import {
  FaBook,
  FaBullseye,
  FaCircleCheck,
  FaClock,
  FaListCheck,
  FaMoon,
  FaNoteSticky,
  FaPlay,
  FaPlus,
  FaSearch,
  FaSun,
  FaTrash,
} from "react-icons/fa6";
import GlassCard from "../components/GlassCard";
import { roadmapData, quotes } from "../data/roadmapData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { calculateCourseProgress, getTodayKey, randomQuote } from "../utils/helpers";
import { useTheme } from "../context/ThemeContext";

const debugLog = (hypothesisId, message, data = {}, runId = "pre-fix") => {
  fetch("http://127.0.0.1:7843/ingest/7a4d52b4-ee87-4a24-94ae-4ee7a73399c7", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "acbfb6",
    },
    body: JSON.stringify({
      sessionId: "acbfb6",
      runId,
      hypothesisId,
      location: "src/pages/DashboardPage.jsx",
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
};

const DashboardPage = () => {
  const [roadmap, setRoadmap] = useLocalStorage("aiml-roadmap", roadmapData);
  const [tasks, setTasks] = useLocalStorage("aiml-tasks", []);
  const [notes, setNotes] = useLocalStorage("aiml-notes", []);
  const [goals, setGoals] = useLocalStorage("aiml-goals", {
    shortTerm: [],
    longTerm: [],
    dreamCompanies: [],
    internshipTargets: [],
  });
  const [studyHours, setStudyHours] = useLocalStorage("aiml-study-hours", { days: {} });
  const [streak, setStreak] = useLocalStorage("aiml-streak", { count: 0, lastDate: null });
  const [activeFilter, setActiveFilter] = useState("All");
  const [taskSearch, setTaskSearch] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [pomodoro, setPomodoro] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [section, setSection] = useState("dashboard");
  const { theme, toggleTheme } = useTheme();
  const [quote] = useState(randomQuote(quotes));

  // #region agent log
  debugLog("H1", "DashboardPage render reached", { theme, section, tasksCount: tasks.length });
  // #endregion

  const [taskInput, setTaskInput] = useState({ title: "", priority: "Medium", dueDate: "" });
  const [noteInput, setNoteInput] = useState({ title: "", body: "" });
  const [goalInput, setGoalInput] = useState({ type: "shortTerm", value: "" });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const courseProgress = calculateCourseProgress(roadmap);

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      activeFilter === "All" ||
      (activeFilter === "Completed" && task.completed) ||
      (activeFilter === "Pending" && !task.completed);
    const textMatch = task.title.toLowerCase().includes(taskSearch.toLowerCase());
    return statusMatch && textMatch;
  });

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.body.toLowerCase().includes(noteSearch.toLowerCase())
  );

  useEffect(() => {
    // #region agent log
    debugLog("H2", "DashboardPage mounted", {
      roadmapItems: roadmap.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.completed).length,
    });
    // #endregion
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPomodoro((prev) => {
        if (!running) return prev;
        if (prev <= 1) {
          setRunning(false);
          toast.success("Pomodoro complete! Great focus session.");
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const addTask = () => {
    if (!taskInput.title.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), ...taskInput, completed: false }]);
    setTaskInput({ title: "", priority: "Medium", dueDate: "" });
    toast.success("Task added");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const completed = !task.completed;
        if (completed) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2500);
          toast.success("Task completed. Keep going!");
          const today = getTodayKey();
          setStreak((s) => ({
            count: s.lastDate === today ? s.count : s.count + 1,
            lastDate: today,
          }));
        }
        return { ...task, completed };
      })
    );
  };

  const updateTaskTitle = (id, value) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, title: value } : task)));
  };

  const updateRoadmapProgress = (id) => {
    setRoadmap((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const progress = Math.min(item.progress + 10, 100);
        const status = progress === 100 ? "Completed" : "Ongoing";
        return { ...item, progress, status };
      })
    );
    toast.success("Roadmap progress updated");
  };

  const addNote = () => {
    if (!noteInput.title.trim() && !noteInput.body.trim()) return;
    setNotes((prev) => [...prev, { id: Date.now(), ...noteInput }]);
    setNoteInput({ title: "", body: "" });
  };

  const updateStudyHours = (value) => {
    const today = getTodayKey();
    const num = Math.max(0, Number(value) || 0);
    setStudyHours((prev) => ({ days: { ...prev.days, [today]: num } }));
  };

  const weekData = useMemo(() => {
    const entries = Object.entries(studyHours.days).slice(-7);
    return entries.map(([date, hours]) => ({ date: date.slice(5), hours }));
  }, [studyHours.days]);

  const addGoal = () => {
    if (!goalInput.value.trim()) return;
    setGoals((prev) => ({ ...prev, [goalInput.type]: [...prev[goalInput.type], goalInput.value] }));
    setGoalInput((p) => ({ ...p, value: "" }));
  };

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: FaBook },
    { id: "roadmap", label: "Roadmap", icon: FaBullseye },
    { id: "tasks", label: "Smart Tasks", icon: FaListCheck },
    { id: "notes", label: "Notes", icon: FaNoteSticky },
    { id: "tracker", label: "Consistency", icon: FaClock },
    { id: "goals", label: "Goals", icon: FaCircleCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-100 bg-hero-grid text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {showConfetti && <Confetti recycle={false} numberOfPieces={220} />}
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-3 md:flex-row md:p-6">
        <div className="md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
          <GlassCard className="h-full p-2">
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="font-bold">Sections</p>
              <button
                onClick={toggleTheme}
                className="rounded-lg bg-white/10 p-2 text-cyan-300 hover:bg-white/20"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            <div className="space-y-2">
              {sections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left ${
                    section === item.id
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <item.icon />
                  {item.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
        <main className="flex-1 space-y-4">
          <GlassCard className="bg-gradient-to-r from-cyan-600/30 to-indigo-700/30">
            <p className="text-sm uppercase tracking-widest text-cyan-300">Quote of the day</p>
            <h2 className="mt-1 text-2xl font-bold">Build your AI future one focused day at a time.</h2>
            <p className="mt-2 max-w-3xl text-slate-300">{quote}</p>
          </GlassCard>

          <AnimatePresence mode="wait">
            {section === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4 md:grid-cols-4">
                {[["Total Tasks", totalTasks], ["Completed", completedTasks], ["Pending", pendingTasks], ["Course %", `${courseProgress}%`]].map(([title, value]) => (
                  <GlassCard key={title}>
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                  </GlassCard>
                ))}
                <GlassCard className="md:col-span-2">
                  <p className="font-semibold">Pomodoro Timer</p>
                  <p className="my-3 text-4xl font-bold text-cyan-300">{formatTime(pomodoro)}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setRunning((p) => !p)} className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white">
                      <FaPlay className="mr-2 inline" />
                      {running ? "Pause" : "Start"}
                    </button>
                    <button onClick={() => setPomodoro(25 * 60)} className="rounded-xl bg-white/10 px-4 py-2 text-sm">Reset</button>
                  </div>
                </GlassCard>
                <GlassCard className="md:col-span-2">
                  <p className="mb-2 font-semibold">Weekly study chart</p>
                  <div className="flex h-32 items-end gap-2">
                    {weekData.length ? weekData.map((d) => (
                      <div key={d.date} className="flex flex-1 flex-col items-center">
                        <div className="w-full rounded-t bg-gradient-to-t from-cyan-400 to-indigo-500" style={{ height: `${Math.max(10, d.hours * 20)}px` }} />
                        <span className="mt-1 text-xs text-slate-400">{d.date}</span>
                      </div>
                    )) : <p className="text-sm text-slate-400">Add daily study hours in consistency section.</p>}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {section === "roadmap" && (
              <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-3 md:grid-cols-2">
                {roadmap.map((item) => (
                  <GlassCard key={item.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{item.category}</p>
                        <p className="text-sm text-slate-400">{item.course}</p>
                      </div>
                      <span className="rounded-lg bg-white/10 px-2 py-1 text-xs">{item.status}</span>
                    </div>
                    <p className="mt-2 text-sm">Platform: {item.platform} | {item.duration}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.start} to {item.end}</p>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: `${item.progress}%` }} />
                    </div>
                    <button onClick={() => updateRoadmapProgress(item.id)} className="mt-3 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-xs font-semibold text-white">
                      Update Progress
                    </button>
                  </GlassCard>
                ))}
              </motion.div>
            )}

            {section === "tasks" && (
              <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <GlassCard>
                  <div className="grid gap-2 md:grid-cols-4">
                    <input value={taskInput.title} onChange={(e) => setTaskInput((p) => ({ ...p, title: e.target.value }))} placeholder="Add AI/ML task" className="rounded-xl bg-white/10 px-3 py-2 outline-none" />
                    <select value={taskInput.priority} onChange={(e) => setTaskInput((p) => ({ ...p, priority: e.target.value }))} className="rounded-xl bg-white/10 px-3 py-2 outline-none">
                      <option>High</option><option>Medium</option><option>Low</option>
                    </select>
                    <input type="date" value={taskInput.dueDate} onChange={(e) => setTaskInput((p) => ({ ...p, dueDate: e.target.value }))} className="rounded-xl bg-white/10 px-3 py-2 outline-none" />
                    <button onClick={addTask} className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 font-semibold text-white"><FaPlus className="mr-1 inline" />Add Task</button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["All", "Completed", "Pending"].map((f) => (
                      <button key={f} onClick={() => setActiveFilter(f)} className={`rounded-lg px-3 py-1 text-xs ${activeFilter === f ? "bg-cyan-500 text-white" : "bg-white/10"}`}>{f}</button>
                    ))}
                    <div className="ml-auto flex items-center gap-2 rounded-lg bg-white/10 px-2">
                      <FaSearch className="text-xs text-slate-400" />
                      <input value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} placeholder="Search tasks" className="bg-transparent px-1 py-1 text-sm outline-none" />
                    </div>
                  </div>
                </GlassCard>
                <div className="space-y-2">
                  {filteredTasks.map((task) => (
                    <GlassCard key={task.id} className="flex flex-col gap-2 md:flex-row md:items-center">
                      <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                      <input value={task.title} onChange={(e) => updateTaskTitle(task.id, e.target.value)} className={`flex-1 bg-transparent outline-none ${task.completed ? "line-through text-slate-500" : ""}`} />
                      <span className={`rounded-full px-2 py-1 text-xs ${task.priority === "High" ? "bg-rose-500/30 text-rose-200" : task.priority === "Medium" ? "bg-amber-500/30 text-amber-200" : "bg-emerald-500/30 text-emerald-200"}`}>{task.priority}</span>
                      <span className="text-xs text-slate-400">{task.dueDate || "No date"}</span>
                      <button onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))} className="rounded-lg bg-white/10 p-2 hover:bg-rose-500/30"><FaTrash /></button>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            )}

            {section === "notes" && (
              <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <GlassCard>
                  <div className="grid gap-2">
                    <input value={noteInput.title} onChange={(e) => setNoteInput((p) => ({ ...p, title: e.target.value }))} placeholder="Note title" className="rounded-xl bg-white/10 px-3 py-2 outline-none" />
                    <textarea rows={4} value={noteInput.body} onChange={(e) => setNoteInput((p) => ({ ...p, body: e.target.value }))} placeholder="Write key learning notes..." className="rounded-xl bg-white/10 px-3 py-2 outline-none" />
                    <div className="flex items-center justify-between">
                      <button onClick={addNote} className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 font-semibold text-white">Save Note</button>
                      <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2">
                        <FaSearch className="text-xs text-slate-400" />
                        <input value={noteSearch} onChange={(e) => setNoteSearch(e.target.value)} placeholder="Search notes" className="bg-transparent py-1 text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                </GlassCard>
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredNotes.map((note) => (
                    <GlassCard key={note.id}>
                      <input value={note.title} onChange={(e) => setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, title: e.target.value } : n)))} className="w-full bg-transparent text-lg font-semibold outline-none" />
                      <textarea rows={4} value={note.body} onChange={(e) => setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, body: e.target.value } : n)))} className="mt-2 w-full bg-transparent text-sm outline-none" />
                      <button onClick={() => setNotes((prev) => prev.filter((n) => n.id !== note.id))} className="mt-2 rounded-lg bg-white/10 px-3 py-1 text-xs hover:bg-rose-500/30">Delete</button>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            )}

            {section === "tracker" && (
              <motion.div key="tracker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4 md:grid-cols-3">
                <GlassCard><p className="text-sm text-slate-400">Current streak</p><p className="text-4xl font-bold text-cyan-300">{streak.count} days</p></GlassCard>
                <GlassCard className="md:col-span-2">
                  <p className="font-semibold">Today's study hours</p>
                  <input type="number" min="0" step="0.5" value={studyHours.days[getTodayKey()] || ""} onChange={(e) => updateStudyHours(e.target.value)} className="mt-2 rounded-xl bg-white/10 px-3 py-2 outline-none" />
                </GlassCard>
                {["Code practice", "Revision", "Mock interview"].map((habit) => (
                  <GlassCard key={habit}>
                    <p className="font-medium">{habit}</p>
                    <p className="mt-2 text-xs text-slate-400">Track this daily and build consistency.</p>
                  </GlassCard>
                ))}
              </motion.div>
            )}

            {section === "goals" && (
              <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <GlassCard>
                  <div className="grid gap-2 md:grid-cols-3">
                    <select value={goalInput.type} onChange={(e) => setGoalInput((p) => ({ ...p, type: e.target.value }))} className="rounded-xl bg-white/10 px-3 py-2">
                      <option value="shortTerm">Short-term goals</option>
                      <option value="longTerm">Long-term goals</option>
                      <option value="dreamCompanies">Dream companies</option>
                      <option value="internshipTargets">Internship targets</option>
                    </select>
                    <input value={goalInput.value} onChange={(e) => setGoalInput((p) => ({ ...p, value: e.target.value }))} placeholder="Add your target" className="rounded-xl bg-white/10 px-3 py-2 outline-none md:col-span-2" />
                    <button onClick={addGoal} className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 font-semibold text-white md:col-span-3">Add Goal</button>
                  </div>
                </GlassCard>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(goals).map(([type, items]) => (
                    <GlassCard key={type}>
                      <p className="mb-2 text-lg font-semibold capitalize">{type.replace(/([A-Z])/g, " $1")}</p>
                      <ul className="space-y-2">
                        {items.map((goal, idx) => (
                          <li key={`${goal}-${idx}`} className="rounded-lg bg-white/10 px-3 py-2 text-sm">{goal}</li>
                        ))}
                      </ul>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
