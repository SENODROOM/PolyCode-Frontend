import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./features/navigation/components/Navbar";
import Sidebar from "./features/navigation/components/Sidebar";
import { PlaygroundProvider } from "./features/playground/context/PlaygroundContext";
import { AuthProvider } from "./features/auth/context/AuthContext";
import SelectionPins from "./shared/components/SelectionPins";
import { LearnNavProvider } from "./features/learn/shared/LearnNavContext";
import GlobalAssistant from "./features/assistant/components/GlobalAssistant";
import { AssistantProvider } from "./features/assistant/context/AssistantContext";
import "./App.css";
import "./styles/theme-light.css";
import "./styles/stack-picker-dark.css";
import "./styles/responsive.css";

import LandingShell from "./features/landing/LandingShell";

const LandingPage = lazy(() => import("./features/landing/pages/LandingPage"));
const LanguageLandingPage = lazy(
  () => import("./features/language/pages/LanguageLandingPage"),
);
const HomePage = lazy(() => import("./features/docs/pages/Home/HomePage"));
const DocumentPage = lazy(() => import("./features/docs/pages/DocumentPage"));
const CategoryPage = lazy(() => import("./features/docs/pages/CategoryPage"));
const SearchPage = lazy(() => import("./features/docs/pages/SearchPage"));
const PlaygroundPage = lazy(
  () => import("./features/playground/pages/PlaygroundPage"),
);
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("./features/auth/pages/SignupPage"));
const DailyChallenge = lazy(() => import("./pages/DailyChallenges"));
const ProfilePage = lazy(() => import("./features/profile/ProfilePage"));

// Learn — OOP C++ pages
const OopsHub = lazy(() => import("./features/learn/oops-cpp/pages/OopsHub"));
const LessonPage = lazy(
  () => import("./features/learn/oops-cpp/pages/LessonPage"),
);
const PointersHub = lazy(
  () => import("./features/learn/pointers-cpp/pages/PointersHub"),
);
const PointersLessonPage = lazy(
  () => import("./features/learn/pointers-cpp/pages/PointersLessonPage"),
);
const NumpyHub = lazy(() => import("./features/learn/numpy-py/pages/NumpyHub"));
const NumpyLessonPage = lazy(
  () => import("./features/learn/numpy-py/pages/NumpyLessonPage"),
);
const PandasHub = lazy(
  () => import("./features/learn/pandas-py/pages/PandasHub"),
);
const PandasLessonPage = lazy(
  () => import("./features/learn/pandas-py/pages/PandasLessonPage"),
);
const JsFundamentalsHub = lazy(
  () => import("./features/learn/js-fundamentals/pages/JsFundamentalsHub"),
);
const JsFundamentalsLessonPage = lazy(
  () => import("./features/learn/js-fundamentals/pages/JsFundamentalsLessonPage"),
);
const SqlHub = lazy(() => import("./features/learn/sql/pages/SqlHub"));
const SqlLessonPage = lazy(
  () => import("./features/learn/sql/pages/SqlLessonPage"),
);
const PowerShellHub = lazy(() => import("./features/learn/powershell/pages/PowerShellHub"));
const PowerShellLessonPage = lazy(
  () => import("./features/learn/powershell/pages/PowerShellLessonPage"),
);

const PageFallback = () => (
  <div className="loading">
    <div className="spinner-container">
      <div className="spinner" />
    </div>
  </div>
);

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <a
          className="app-footer-brand"
          href="https://www.quantumlogicslimited.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Quantum Logics"
        >
          <img
            src="https://www.quantumlogicslimited.com/logo.png"
            alt="Quantum Logics logo"
            className="app-footer-logo"
          />
          <span>Quantum Logics</span>
        </a>
        <span className="app-footer-divider" />
        <span className="app-footer-project">Polycode</span>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  React.useLayoutEffect(() => {
    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document
      .querySelectorAll(".main-content, .learn-content")
      .forEach((node) => {
        node.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });

    return () => {
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [pathname, search]);

  return null;
}

function MainApp({
  selectedLanguage,
  onLanguageSelect,
  onGoToStackPicker,
  theme,
  onToggleTheme,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setIsSidebarOpen((o) => !o);
  const closeSidebar = () => setIsSidebarOpen(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const lock = isSidebarOpen && mq.matches;
    document.body.classList.toggle("sidebar-open", lock);
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <>
      <Navbar
        toggleSidebar={toggleSidebar}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onGoToStackPicker={onGoToStackPicker}
        selectedLanguage={selectedLanguage}
      />
      <div className="layout">
        {isSidebarOpen && <div className="backdrop" onClick={closeSidebar} />}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          selectedLanguage={selectedLanguage}
          onLanguageSelect={onLanguageSelect}
          onGoToStackPicker={onGoToStackPicker}
        />
        <main className="main-content">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route
                path="/hub"
                element={<HomePage selectedLanguage={selectedLanguage} />}
              />
              <Route
                path="/doc/*"
                element={
                  <DocumentPage
                    selectedLanguage={selectedLanguage}
                    theme={theme}
                  />
                }
              />
              <Route
                path="/category/*"
                element={<CategoryPage selectedLanguage={selectedLanguage} />}
              />
              <Route
                path="/search"
                element={<SearchPage selectedLanguage={selectedLanguage} />}
              />
              <Route
                path="/playground"
                element={
                  <PlaygroundPage
                    theme={theme}
                    onToggleSidebar={toggleSidebar}
                    sidebarOpen={isSidebarOpen}
                  />
                }
              />
              <Route
                path="/daily-challenge"
                element={<DailyChallenge theme={theme} />}
              />
              <Route path="*" element={<Navigate to="/hub" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </>
  );
}

function LearnShell({
  theme,
  onToggleTheme,
  onGoToStackPicker,
  selectedLanguage,
  children,
}) {
  const location = useLocation();
  const [learnMenuOpen, setLearnMenuOpen] = React.useState(false);
  const isLessonRoute = /\/lesson\//.test(location.pathname);
  const toggleLearnMenu = () => setLearnMenuOpen((open) => !open);
  const closeLearnMenu = () => setLearnMenuOpen(false);

  React.useEffect(() => {
    if (!location.pathname.startsWith("/learn/")) return;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.querySelector(".main-content.learn-content")?.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });
  }, [location.pathname]);

  React.useEffect(() => {
    closeLearnMenu();
  }, [location.pathname]);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const lock = learnMenuOpen && mq.matches && isLessonRoute;
    document.body.classList.toggle("learn-sidebar-open", lock);
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.classList.remove("learn-sidebar-open");
      document.body.style.overflow = "";
    };
  }, [learnMenuOpen, isLessonRoute]);

  return (
    <LearnNavProvider menuOpen={learnMenuOpen} closeMenu={closeLearnMenu}>
      <Navbar
        toggleSidebar={isLessonRoute ? toggleLearnMenu : undefined}
        showMobileMenu={isLessonRoute}
        mobileMenuOpen={learnMenuOpen}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onGoToStackPicker={onGoToStackPicker}
        selectedLanguage={selectedLanguage}
      />
      {learnMenuOpen && isLessonRoute && (
        <div
          className="backdrop learn-backdrop"
          onClick={closeLearnMenu}
          aria-hidden="true"
        />
      )}
      <main className="main-content learn-content">{children}</main>
    </LearnNavProvider>
  );
}

function ThemedShell({ theme, children }) {
  return (
    <div className={`app ${theme === "light" ? "theme-light" : ""}`}>
      {children}
      <AppFooter />
    </div>
  );
}

/** Language picker is always dark — overrides global light theme on html/body */
function StackPickerShell({ children, savedTheme }) {
  React.useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.setAttribute("data-theme", "dark");
    body.classList.remove("light-theme");
    html.style.backgroundColor = "#03050a";
    body.style.backgroundColor = "#03050a";

    return () => {
      html.style.backgroundColor = "";
      body.style.backgroundColor = "";
      // Restore the real theme when leaving the stack picker
      html.setAttribute("data-theme", savedTheme);
      body.classList.toggle("light-theme", savedTheme === "light");
    };
  }, [savedTheme]);

  return (
    <div className="app stack-picker-dark">
      {children}
      <AppFooter />
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    () => localStorage.getItem("selectedLanguage") || null,
  );
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem("theme") || "dark",
  );

  const handleLanguageSelect = React.useCallback(
    (language, options = {}) => {
      setSelectedLanguage(language);
      localStorage.setItem("selectedLanguage", language);
      if (!options.stay) {
        navigate(`/language/${encodeURIComponent(language)}`, {
          replace: true,
        });
      }
    },
    [navigate],
  );

  const goToStackPicker = React.useCallback(() => {
    navigate("/select-language");
  }, [navigate]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  React.useEffect(() => {
    const path = location.pathname;
    if (
      path.startsWith("/learn/numpy-py") ||
      path.startsWith("/learn/pandas-py")
    ) {
      handleLanguageSelect("Python", { stay: true });
    } else if (path.startsWith("/learn/js-fundamentals")) {
      handleLanguageSelect("JavaScript", { stay: true });
    } else if (
      path.startsWith("/learn/oops-cpp") ||
      path.startsWith("/learn/pointers-cpp")
    ) {
      handleLanguageSelect("C++", { stay: true });
    } else if (path.startsWith("/learn/sql")) {
      handleLanguageSelect("SQL", { stay: true });
    } else if (path.startsWith("/learn/powershell")) {
      handleLanguageSelect("PowerShell", { stay: true });
    }
  }, [location.pathname, handleLanguageSelect]);

  React.useEffect(() => {
    localStorage.setItem("theme", theme);
    // LandingShell and StackPickerShell manage document theme while mounted.
    if (location.pathname === "/" || location.pathname === "/select-language") {
      return;
    }
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("light-theme", theme === "light");
  }, [theme, location.pathname]);

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route
          path="/login"
          element={
            <ThemedShell theme={theme}>
              <LoginPage />
            </ThemedShell>
          }
        />
        <Route
          path="/"
          element={
            <LandingShell
              savedTheme={theme}
              footer={<AppFooter />}
              onLanguageSelect={handleLanguageSelect}
              continueLanguage={selectedLanguage}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <ThemedShell theme={theme}>
              <SignupPage />
            </ThemedShell>
          }
        />
        <Route
          path="/select-language"
          element={
            <StackPickerShell savedTheme={theme}>
              <LandingPage
                onLanguageSelect={handleLanguageSelect}
                continueLanguage={selectedLanguage}
              />
            </StackPickerShell>
          }
        />
        <Route
          path="/language/:language"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <LanguageLandingPage
                  selectedLanguage={selectedLanguage}
                  onLanguageSelect={handleLanguageSelect}
                />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/oops-cpp"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <OopsHub />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/oops-cpp/lesson/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <LessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/oops-cpp/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <LessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/pointers-cpp"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PointersHub />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/pointers-cpp/lesson/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PointersLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/pointers-cpp/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PointersLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/numpy-py"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <NumpyHub />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/numpy-py/lesson/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <NumpyLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/numpy-py/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <NumpyLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/pandas-py"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PandasHub />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/pandas-py/lesson/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PandasLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/pandas-py/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PandasLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/js-fundamentals"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <JsFundamentalsHub />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/js-fundamentals/lesson/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <JsFundamentalsLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/js-fundamentals/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <JsFundamentalsLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/sql"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <SqlHub />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/sql/lesson/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <SqlLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/sql/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <SqlLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/powershell"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PowerShellHub />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/powershell/lesson/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PowerShellLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/learn/powershell/:lessonId"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <PowerShellLessonPage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/profile"
          element={
            <ThemedShell theme={theme}>
              <LearnShell
                theme={theme}
                onToggleTheme={toggleTheme}
                onGoToStackPicker={goToStackPicker}
                selectedLanguage={selectedLanguage}
              >
                <ProfilePage />
              </LearnShell>
            </ThemedShell>
          }
        />
        <Route
          path="/*"
          element={
            <ThemedShell theme={theme}>
              {selectedLanguage ? (
                <MainApp
                  selectedLanguage={selectedLanguage}
                  onLanguageSelect={handleLanguageSelect}
                  onGoToStackPicker={goToStackPicker}
                  theme={theme}
                  onToggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/select-language" replace />
              )}
            </ThemedShell>
          }
        />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <PlaygroundProvider>
        <Router>
          <AssistantProvider>
            <SelectionPins />
            <ScrollToTop />
            <AppRoutes />
            <GlobalAssistant />
          </AssistantProvider>
        </Router>
      </PlaygroundProvider>
    </AuthProvider>
  );
}

export default App;
