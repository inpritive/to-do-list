export const randomQuote = (quotes) => quotes[Math.floor(Math.random() * quotes.length)];

export const calculateCourseProgress = (roadmap) => {
  if (!roadmap.length) return 0;
  const total = roadmap.reduce((sum, item) => sum + (Number(item.progress) || 0), 0);
  return Math.round(total / roadmap.length);
};

export const getTodayKey = () => new Date().toISOString().split("T")[0];

export const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const deriveRoadmapProgress = (subtopics = []) => {
  if (!subtopics.length) return 0;
  const completed = subtopics.filter((topic) => topic.completed).length;
  return Math.round((completed / subtopics.length) * 100);
};

export const deriveRoadmapStatus = (progress) => {
  if (progress <= 0) return "Not Started";
  if (progress >= 100) return "Completed";
  return "Ongoing";
};

export const normalizeRoadmapItem = (item = {}) => {
  const subtopics = Array.isArray(item.subtopics)
    ? item.subtopics
        .map((topic) => ({
          id: topic?.id || createId(),
          title: topic?.title || "",
          completed: Boolean(topic?.completed),
        }))
        .filter((topic) => topic.title.trim())
    : [];

  const resources = Array.isArray(item.resources)
    ? item.resources
        .map((resource) => {
          if (typeof resource === "string") {
            return {
              id: createId(),
              label: resource,
              url: "",
            };
          }
          return {
            id: resource?.id || createId(),
            label: resource?.label || resource?.name || resource?.url || "",
            url: resource?.url || "",
          };
        })
        .filter((resource) => resource.label.trim())
    : [];

  const title = item.title || item.category || "Untitled Roadmap";
  const description =
    item.description ||
    item.course ||
    `Focus area: ${title}. Add your subtopics and resources to create a clear learning journey.`;

  const progress = deriveRoadmapProgress(subtopics);

  return {
    id: item.id || createId(),
    title,
    description,
    subtopics,
    resources,
    progress,
    status: deriveRoadmapStatus(progress),
  };
};

export const normalizeRoadmap = (roadmap = []) =>
  Array.isArray(roadmap) ? roadmap.map((item) => normalizeRoadmapItem(item)) : [];
