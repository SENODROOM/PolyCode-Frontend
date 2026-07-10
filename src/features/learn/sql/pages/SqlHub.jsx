import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SQL_CHAPTERS,
  SQL_LESSONS,
  SQL_TOTAL_XP,
} from "../data/sqlCurriculum";
import useSqlProgress from "../hooks/useSqlProgress";

const BASE_PATH = "/learn/sql";

function lessonPlainText(lesson) {
  return lesson.theory
    .filter((block) => block.type === "text" || block.type === "callout")
    .map((block) => block.content.replace(/\*\*/g, "").replace(/`/g, ""))
    .join(" ");
}

export default function SqlHub() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const {
    isAuthenticated,
    completedMap: progress,
    bookmarks,
    lastLessonId,
  } = useSqlProgress();

  const completedCount = Object.keys(progress).length;
  const earnedXP = SQL_LESSONS.filter((lesson) => progress[lesson.id]).reduce(
    (sum, lesson) => sum + lesson.xp,
    0,
  );
  const pct =
    Math.round((completedCount / SQL_LESSONS.length) * 100) || 0;
  const nextLesson =
    SQL_LESSONS.find((lesson) => !progress[lesson.id]) ||
    SQL_LESSONS[0];
  const resumeLesson =
    SQL_LESSONS.find((lesson) => lesson.id === lastLessonId) ||
    nextLesson;
  const completedChapters = SQL_CHAPTERS.filter((chapter) =>
    chapter.lessons.every((lesson) => progress[lesson.id]),
  ).length;
  const bookmarkedLessons = bookmarks
    .map((id) => SQL_LESSONS.find((lesson) => lesson.id === id))
    .filter(Boolean);

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase();
    return SQL_LESSONS.filter((lesson) => {
      const matchesQuery =
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.chapterTitle.toLowerCase().includes(query) ||
        lessonPlainText(lesson).toLowerCase().includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "todo" && !progress[lesson.id]) ||
        (filter === "done" && progress[lesson.id]) ||
        (filter === "bookmarked" && bookmarks.includes(lesson.id));
      return matchesQuery && matchesFilter;
    });
  }, [bookmarks, filter, progress, search]);

  return (
    <div className="oops-hub sql-hub">
      <div className="oops-hero sql-hero">
        <Link
          to="/language/SQL"
          className="oops-back-btn"
          style={{ marginBottom: "0.75rem", display: "inline-flex" }}
        >
          ← SQL courses
        </Link>
        <div className="oops-hero-badge">SQL \· DATA TRACK</div>
        <h1 className="oops-hero-title">
          SQL
          <br />
          <span className="oops-hero-accent">Fundamentals</span>
        </h1>
        <p className="oops-hero-sub">
          Master variables, logic, functions, arrays, and objects with friendly
          theory, quizzes, and hands-on SQL challenges.
        </p>

        <div className="oops-hero-grid">
          <div className="oops-xp-bar-wrap">
            <div className="oops-xp-meta">
              <span>
                {isAuthenticated
                  ? `${completedCount}/${SQL_LESSONS.length} lessons · ${earnedXP}/${SQL_TOTAL_XP} XP`
                  : `Sign in to track progress · ${SQL_LESSONS.length} lessons`}
              </span>
              <span>{isAuthenticated ? `${pct}%` : "—"}</span>
            </div>
            <div className="oops-xp-track">
              <div
                className="oops-xp-fill"
                style={{ width: isAuthenticated ? `${pct}%` : "0%" }}
              />
            </div>
          </div>

          {!isAuthenticated && (
            <div className="oops-auth-gate oops-auth-gate-hub">
              <p>
                Create a free account to run challenges, earn XP, and save your
                place in the course.
              </p>
              <div className="oops-auth-gate-actions">
                <Link to="/login" className="oops-auth-gate-btn">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="oops-auth-gate-btn oops-auth-gate-btn-primary"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}

          <div className="oops-resume-panel">
            <span className="oops-sync-pill">
              {isAuthenticated
                ? "Progress saved to your account"
                : "Browse lessons — sign in to save progress"}
            </span>
            <h2>{resumeLesson.title}</h2>
            <p>
              {resumeLesson.chapterTitle} · {resumeLesson.xp} XP
            </p>
            <button
              type="button"
              onClick={() => navigate(`${BASE_PATH}/lesson/${resumeLesson.id}`)}
            >
              {completedCount > 0 ? "Resume SQL" : "Start SQL"}
            </button>
          </div>
        </div>
      </div>

      <div className="oops-guide-tools">
        <div className="oops-tool-panel oops-tool-panel-main">
          <span className="oops-interactive-label">Find a SQL topic</span>
          <div className="oops-search-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search functions, arrays, loops..."
              aria-label="Search SQL lessons"
            />
            <div
              className="oops-filter-tabs"
              aria-label="Filter SQL lessons"
            >
              {[
                ["all", "All"],
                ["todo", "To do"],
                ["done", "Done"],
                ["bookmarked", "Saved"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={filter === value ? "active" : ""}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="oops-search-results">
            {filteredLessons.slice(0, 6).map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                className="oops-search-result"
                style={{ "--ch-color": lesson.chapterColor }}
                onClick={() => navigate(`${BASE_PATH}/lesson/${lesson.id}`)}
              >
                <span>{progress[lesson.id] ? "✓" : "○"}</span>
                <strong>{lesson.title}</strong>
                <small>{lesson.chapterTitle}</small>
              </button>
            ))}
            {filteredLessons.length === 0 && (
              <p className="oops-empty-copy">No lessons match that search.</p>
            )}
          </div>
        </div>

        <div className="oops-tool-panel">
          <span className="oops-interactive-label">Recommended</span>
          <h2>{nextLesson.title}</h2>
          <p>
            Next in {nextLesson.chapterTitle}. Earn {nextLesson.xp} XP.
          </p>
          <button
            type="button"
            onClick={() => navigate(`${BASE_PATH}/lesson/${nextLesson.id}`)}
          >
            Open next lesson
          </button>
        </div>

        <div className="oops-tool-panel">
          <span className="oops-interactive-label">Bookmarks</span>
          {bookmarkedLessons.length > 0 ? (
            <div className="oops-bookmark-list">
              {bookmarkedLessons.slice(0, 3).map((lesson) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => navigate(`${BASE_PATH}/lesson/${lesson.id}`)}
                >
                  <strong>{lesson.title}</strong>
                  <small>{lesson.chapterTitle}</small>
                </button>
              ))}
            </div>
          ) : (
            <p>Bookmark lessons to review them here.</p>
          )}
        </div>
      </div>

      <div className="oops-dashboard-strip">
        <div className="oops-stat-tile">
          <span>Lessons</span>
          <strong>
            {completedCount}/{SQL_LESSONS.length}
          </strong>
        </div>
        <div className="oops-stat-tile">
          <span>Chapters</span>
          <strong>
            {completedChapters}/{SQL_CHAPTERS.length}
          </strong>
        </div>
        <div className="oops-stat-tile">
          <span>XP</span>
          <strong>
            {earnedXP}/{SQL_TOTAL_XP}
          </strong>
        </div>
        <div className="oops-stat-tile">
          <span>Bookmarks</span>
          <strong>{bookmarks.length}</strong>
        </div>
      </div>

      <div className="oops-path-overview">
        {SQL_CHAPTERS.map((chapter, index) => {
          const done = chapter.lessons.filter((l) => progress[l.id]).length;
          const active = done > 0 && done < chapter.lessons.length;
          return (
            <button
              key={chapter.id}
              type="button"
              className={`oops-path-step ${active ? "active" : ""} ${
                done === chapter.lessons.length ? "done" : ""
              }`}
              style={{ "--ch-color": chapter.color }}
              onClick={() =>
                navigate(`${BASE_PATH}/lesson/${chapter.lessons[0].id}`)
              }
            >
              <span>{index + 1}</span>
              <strong>{chapter.title}</strong>
              <small>
                {done}/{chapter.lessons.length}
              </small>
            </button>
          );
        })}
      </div>

      <div className="oops-chapters">
        {SQL_CHAPTERS.map((chapter, index) => {
          const done = chapter.lessons.filter((l) => progress[l.id]).length;
          const chapterPct =
            Math.round((done / chapter.lessons.length) * 100) || 0;
          const firstUnfinished = chapter.lessons.find((l) => !progress[l.id]);
          const allDone = done === chapter.lessons.length;

          return (
            <div
              key={chapter.id}
              className={`oops-chapter-card ${allDone ? "oops-chapter-done" : ""}`}
              style={{ "--ch-color": chapter.color }}
            >
              <div className="oops-chapter-header">
                <span className="oops-chapter-icon">{chapter.icon}</span>
                <div>
                  <div className="oops-chapter-num">Chapter {index + 1}</div>
                  <div className="oops-chapter-title">{chapter.title}</div>
                </div>
                {allDone && <span className="oops-done-badge">✓ Done</span>}
              </div>
              <div className="oops-chapter-progress-track">
                <div
                  className="oops-chapter-progress-fill"
                  style={{ width: `${chapterPct}%` }}
                />
              </div>
              <div className="oops-chapter-meta">
                {done}/{chapter.lessons.length} lessons · {chapterPct}%
              </div>
              <ul className="oops-lesson-list">
                {chapter.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className={`oops-lesson-item ${progress[lesson.id] ? "done" : ""}`}
                    onClick={() => navigate(`${BASE_PATH}/lesson/${lesson.id}`)}
                  >
                    <span className="oops-lesson-status">
                      {progress[lesson.id] ? "✓" : "○"}
                    </span>
                    <span className="oops-lesson-name">{lesson.title}</span>
                    <span className="oops-lesson-xp">+{lesson.xp} XP</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="oops-chapter-cta"
                onClick={() =>
                  navigate(
                    `${BASE_PATH}/lesson/${
                      firstUnfinished ? firstUnfinished.id : chapter.lessons[0].id
                    }`,
                  )
                }
              >
                {allDone ? "Review Chapter →" : done > 0 ? "Continue →" : "Start →"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
