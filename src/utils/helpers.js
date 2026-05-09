export const randomQuote = (quotes) => quotes[Math.floor(Math.random() * quotes.length)];

export const calculateCourseProgress = (roadmap) => {
  if (!roadmap.length) return 0;
  const total = roadmap.reduce((sum, item) => sum + item.progress, 0);
  return Math.round(total / roadmap.length);
};

export const getTodayKey = () => new Date().toISOString().split("T")[0];
