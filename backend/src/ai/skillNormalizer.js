const TOOL_CATEGORIES = ["tool"];

const GENERIC_SKILLS = [
  "web development",
  "full stack",
  "full-stack development",
  "software development",
  "programming",
  "artificial intelligence",
  "data science",
];

const ALLOWED_TOOL_EXCEPTIONS = ["docker", "power bi"];

const CATEGORY_MULTIPLIER = {
  "programming language": 0.85,
  "framework": 0.8,
  "database": 0.8,
  "machine learning": 0.9,
  "devops": 0.9,
  "cloud": 0.85,
  "other": 0.8,
};

export const normalizeSkills = (skills, limit = 12) => {
  return skills
    .map((s) => {
      const category = (s.category || "Other").toLowerCase();
      const multiplier = CATEGORY_MULTIPLIER[category] ?? 0.8;

      const calibratedScore = Math.round(
        Math.min(Math.max(s.score, 20), 95) * multiplier
      );

      return {
        name: s.name.trim(),
        score: calibratedScore,
        category: s.category,
        source: "resume",
      };
    })
    .filter((s) => {
      const name = s.name.toLowerCase();
      const category = s.category.toLowerCase();

      if (GENERIC_SKILLS.includes(name)) return false;

      if (
        TOOL_CATEGORIES.includes(category) &&
        !ALLOWED_TOOL_EXCEPTIONS.includes(name)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};