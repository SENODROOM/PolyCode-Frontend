import {
  Boxes,
  FileText,
  Grid3x3,
  Layers3,
  Play,
  Brain,
  Table2,
} from "lucide-react";

export function languageKey(value = "") {
  return value.toLowerCase().replace(/\s+/g, "");
}

export const generalCourses = [
  {
    title: "Core Documentation Path",
    tag: "Docs",
    icon: FileText,
    description:
      "Read curated guides, examples, syntax notes, and reference material.",
    href: "/hub",
  },
  {
    title: "Practice Playground",
    tag: "Hands-on",
    icon: Play,
    description: "Experiment with code, run snippets, and test ideas as you learn.",
    href: "/playground",
  },
  {
    title: "Daily Challenge",
    tag: "Routine",
    icon: Brain,
    description: "Build a steady habit with small problems and feedback.",
    href: "/daily-challenge",
  },
];

/** Interactive courses shown on /language/:language (language-specific only). */
export const languageCourses = {
  cpp: [
    {
      title: "OOPs C++",
      tag: "Interactive Course",
      icon: Boxes,
      description:
        "Classes, constructors, inheritance, polymorphism, design principles, and real coding challenges.",
      href: "/learn/oops-cpp",
      accent: "#ffe566",
    },
    {
      title: "Pointers C++",
      tag: "Memory Course",
      icon: Layers3,
      description:
        "Addresses, dereferencing, nullptr, arrays, 2D arrays, smart pointers, callbacks, and safety.",
      href: "/learn/pointers-cpp",
      accent: "#00d4ff",
    },
  ],
  "c++": [
    {
      title: "OOPs C++",
      tag: "Interactive Course",
      icon: Boxes,
      description:
        "Classes, constructors, inheritance, polymorphism, design principles, and real coding challenges.",
      href: "/learn/oops-cpp",
      accent: "#ffe566",
    },
    {
      title: "Pointers C++",
      tag: "Memory Course",
      icon: Layers3,
      description:
        "Addresses, dereferencing, nullptr, arrays, 2D arrays, smart pointers, callbacks, and safety.",
      href: "/learn/pointers-cpp",
      accent: "#00d4ff",
    },
  ],
  python: [
    {
      title: "NumPy · py",
      tag: "Data Course",
      icon: Grid3x3,
      description:
        "ndarray basics, shape, dtype, vector math, and hands-on Python challenges with NumPy.",
      href: "/learn/numpy-py",
      accent: "#4dabdc",
    },
    {
      title: "Pandas · py",
      tag: "Data Course",
      icon: Table2,
      description:
        "Series, DataFrames, filtering, cleaning, groupby, merges, and CSV workflows with Pandas.",
      href: "/learn/pandas-py",
      accent: "#059669",
    },
  ],
  javascript: [
    {
      title: "JavaScript Fundamentals",
      tag: "Interactive Course",
      icon: Grid3x3,
      description:
        "Variables, logic, functions, arrays, and objects with friendly theory and hands-on JS challenges.",
      href: "/learn/js-fundamentals",
      accent: "#f59e0b",
    },
  ],
  sql: [
    {
      title: "SQL Interactive Course",
      tag: "Data Course",
      icon: Table2,
      description: "Intro to SQL, Querying Data, Filtering, and hands-on SQL challenges.",
      href: "/learn/sql",
      accent: "#3b82f6",
    },
  ],
  powershell: [
    {
      title: "PowerShell Interactive Course",
      tag: "Automation Course",
      icon: Boxes,
      description: "Intro to PowerShell, Cmdlets & Aliases, Pipelines, and hands-on PowerShell challenges.",
      href: "/learn/powershell",
      accent: "#5391fe",
    },
  ],
};

/** Navbar learn links per language (mirrors languageCourses). */
export const learnNavByLanguage = {
  cpp: [
    { label: "OOPs", to: "/learn/oops-cpp" },
    { label: "Pointers", to: "/learn/pointers-cpp" },
  ],
  "c++": [
    { label: "OOPs", to: "/learn/oops-cpp" },
    { label: "Pointers", to: "/learn/pointers-cpp" },
  ],
  python: [
    { label: "NumPy", to: "/learn/numpy-py" },
    { label: "Pandas", to: "/learn/pandas-py" },
  ],
  javascript: [{ label: "JS Basics", to: "/learn/js-fundamentals" }],
  sql: [{ label: "SQL Course", to: "/learn/sql" }],
  powershell: [{ label: "PowerShell", to: "/learn/powershell" }],
};

/** Infer stack from an active /learn/* route when language is not set. */
export function inferLanguageFromLearnPath(pathname = "") {
  if (
    pathname.startsWith("/learn/oops-cpp") ||
    pathname.startsWith("/learn/pointers-cpp")
  ) {
    return "cpp";
  }
  if (
    pathname.startsWith("/learn/numpy-py") ||
    pathname.startsWith("/learn/pandas-py")
  ) {
    return "python";
  }
  if (pathname.startsWith("/learn/js-fundamentals")) {
    return "javascript";
  }
  if (pathname.startsWith("/learn/sql")) {
    return "sql";
  }
  if (pathname.startsWith("/learn/powershell")) {
    return "powershell";
  }
  return null;
}

export function getLearnNavLinks(selectedLanguage, pathname = "") {
  const key =
    languageKey(selectedLanguage || "") ||
    inferLanguageFromLearnPath(pathname) ||
    "";
  return learnNavByLanguage[key] || [];
}

export function getLanguageLandingCourses(languageKeyValue) {
  return [
    ...(languageCourses[languageKeyValue] || []),
    ...generalCourses,
  ];
}
