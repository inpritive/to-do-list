export const roadmapData = [
  {
    id: "rm-python",
    title: "Python",
    description: "Build strong Python fundamentals for AI/ML workflows.",
    subtopics: [
      { id: "py-1", title: "Core syntax and control flow", completed: true },
      { id: "py-2", title: "Functions, modules, and virtual environments", completed: true },
      { id: "py-3", title: "NumPy and Pandas basics", completed: false },
    ],
    resources: [
      { id: "py-r1", label: "Python for Everybody", url: "https://www.coursera.org/specializations/python" },
      { id: "py-r2", label: "Real Python", url: "https://realpython.com/" },
    ],
  },
  {
    id: "rm-dsa",
    title: "Data Structures",
    description: "Prepare for coding interviews and algorithmic thinking.",
    subtopics: [
      { id: "dsa-1", title: "Arrays and strings patterns", completed: false },
      { id: "dsa-2", title: "Linked lists and stacks", completed: false },
      { id: "dsa-3", title: "Trees and graphs", completed: false },
    ],
    resources: [{ id: "dsa-r1", label: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" }],
  },
  {
    id: "rm-ml",
    title: "Machine Learning",
    description: "Learn supervised and unsupervised ML from fundamentals to projects.",
    subtopics: [
      { id: "ml-1", title: "Linear regression from scratch", completed: true },
      { id: "ml-2", title: "Classification and metrics", completed: false },
      { id: "ml-3", title: "Model validation and tuning", completed: false },
    ],
    resources: [
      { id: "ml-r1", label: "Andrew Ng ML Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
    ],
  },
  {
    id: "rm-dl",
    title: "Deep Learning",
    description: "Go from neural network basics to modern DL architectures.",
    subtopics: [
      { id: "dl-1", title: "Neural network foundations", completed: false },
      { id: "dl-2", title: "CNN for vision tasks", completed: false },
      { id: "dl-3", title: "Transformers introduction", completed: false },
    ],
    resources: [
      { id: "dl-r1", label: "DeepLearning.AI Specialization", url: "https://www.coursera.org/specializations/deep-learning" },
    ],
  },
  {
    id: "rm-genai",
    title: "Generative AI",
    description: "Build practical GenAI skills including prompting and RAG patterns.",
    subtopics: [
      { id: "ga-1", title: "Prompt engineering basics", completed: true },
      { id: "ga-2", title: "Embeddings and vector stores", completed: false },
      { id: "ga-3", title: "RAG mini project", completed: false },
    ],
    resources: [{ id: "ga-r1", label: "OpenAI Cookbook", url: "https://cookbook.openai.com/" }],
  },
];

export const quotes = [
  "Discipline beats motivation. Show up daily.",
  "Small consistent steps build giant careers.",
  "Learn deeply. Build publicly. Improve relentlessly.",
  "The best AI engineer is the one who never stops shipping."
];
