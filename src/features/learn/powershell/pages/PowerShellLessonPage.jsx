import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NumpyIntroTheory from "../../numpy-py/components/NumpyIntroTheory";
import OopsSidebar from "../../oops-cpp/components/OopsSidebar";
import LearnProfileMenu from "../../shared/LearnProfileMenu";
import LessonContentShell from "../../shared/LessonContentShell";
import PowerShellCodeChallenge from "../components/PowerShellCodeChallenge";
import {
  POWERSHELL_CHAPTERS,
  POWERSHELL_LESSONS,
  POWERSHELL_TOTAL_XP,
} from "../data/powershellCurriculum";
import usePowerShellProgress from "../hooks/usePowerShellProgress";
import { useLessonAssistantContext } from "../../../assistant/hooks/useLessonAssistantContext";

const BASE_PATH = "/learn/powershell";

export default function PowerShellLessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("theory");
  const [focusMode, setFocusMode] = useState(false);
  const [confidence, setConfidence] = useState("");
  const {
    user,
    isAuthenticated,
    completedMap: progress,
    savedCodeMap,
    getLessonNote,
    bookmarks,
    completeLesson,
    rememberLesson,
    saveCode,
    saveNote,
    toggleBookmark,
  } = usePowerShellProgress();
  const [noteDraft, setNoteDraft] = useState("");
  const codeSaveTimer = useRef(null);

  const lesson = POWERSHELL_LESSONS.find((item) => item.id === lessonId);
  const lessonIdx = POWERSHELL_LESSONS.findIndex(
    (item) => item.id === lessonId,
  );
  const prev = POWERSHELL_LESSONS[lessonIdx - 1];
  const next = POWERSHELL_LESSONS[lessonIdx + 1];

  useLessonAssistantContext({
    course: "PowerShell Interactive Course",
    language: "PowerShell",
    lesson,
    chapter: lesson?.chapterTitle,
    tab,
    code: savedCodeMap[lessonId] || "",
  });

  useEffect(() => {
    setTab("theory");
  }, [lessonId]);

  useEffect(() => {
    if (lessonId) rememberLesson(lessonId);
  }, [lessonId, rememberLesson]);

  useEffect(() => {
    setNoteDraft(getLessonNote(lessonId));
  }, [lessonId, getLessonNote]);

  useEffect(() => {
    setConfidence(
      localStorage.getItem(`POWERSHELL_confidence_${lessonId}`) || "",
    );
  }, [lessonId]);

  useEffect(
    () => () => {
      window.clearTimeout(codeSaveTimer.current);
    },
    [],
  );

  if (!lesson) {
    return (
      <div className="oops-not-found">
        <p>PowerShell lesson not found.</p>
        <button type="button" onClick={() => navigate(BASE_PATH)}>
          ← Back to PowerShell Interactive Course
        </button>
      </div>
    );
  }

  const isCompleted = isAuthenticated && !!progress[lessonId];
  const isBookmarked = bookmarks.includes(lessonId);
  const completedCount = Object.keys(progress).length;
  const earnedXP = POWERSHELL_LESSONS.filter((item) => progress[item.id]).reduce(
    (sum, item) => sum + item.xp,
    0,
  );

  async function handleChallengeComplete() {
    await completeLesson(lesson);
  }

  function handleSaveNote() {
    saveNote(lessonId, noteDraft);
  }

  function handleCodeChange(code) {
    window.clearTimeout(codeSaveTimer.current);
    codeSaveTimer.current = window.setTimeout(() => {
      saveCode(lessonId, code).catch(() => {});
    }, 700);
  }

  function handleConfidenceChange(value) {
    setConfidence(value);
    localStorage.setItem(`POWERSHELL_confidence_${lessonId}`, value);
  }

  return (
    <div className={`oops-lesson-page ${focusMode ? "oops-focus-mode" : ""}`}>
      <OopsSidebar
        currentLessonId={lessonId}
        progress={progress}
        chapters={POWERSHELL_CHAPTERS}
        basePath={BASE_PATH}
        title="PowerShell Interactive Course"
      />

      <div className="oops-lesson-main">
        <div className="oops-lesson-topbar">
          <button
            type="button"
            className="oops-back-btn"
            onClick={() => navigate(BASE_PATH)}
          >
            ← PowerShell Interactive Course
          </button>
          <div className="oops-lesson-breadcrumb">
            <span style={{ color: lesson.chapterColor }}>
              {lesson.chapterTitle}
            </span>
            <span className="oops-bc-sep">›</span>
            <span>{lesson.title}</span>
          </div>
          {isCompleted && (
            <span className="oops-completed-badge">✓ Completed</span>
          )}
          <button
            type="button"
            className={`oops-bookmark-btn ${isBookmarked ? "active" : ""}`}
            onClick={() => toggleBookmark(lessonId)}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
          <button
            type="button"
            className={`oops-focus-btn ${focusMode ? "active" : ""}`}
            onClick={() => setFocusMode((v) => !v)}
          >
            {focusMode ? "Exit Focus" : "Focus"}
          </button>
          <LearnProfileMenu
            user={user}
            trackTitle="PowerShell Interactive Course"
            syncLabel={
              isAuthenticated
                ? "PowerShell progress saved to your account"
                : "Sign in to save progress"
            }
            completedCount={completedCount}
            totalLessons={POWERSHELL_LESSONS.length}
            earnedXP={earnedXP}
            totalXP={POWERSHELL_TOTAL_XP}
            bookmarksCount={bookmarks.length}
            streak={0}
          />
        </div>

        <div className="oops-tabs">
          <button
            type="button"
            className={`oops-tab ${tab === "theory" ? "active" : ""}`}
            onClick={() => setTab("theory")}
          >
            Theory
          </button>
          <button
            type="button"
            className={`oops-tab ${tab === "challenge" ? "active" : ""}`}
            onClick={() => setTab("challenge")}
          >
            Challenge <span className="oops-tab-xp">+{lesson.xp} XP</span>
          </button>
        </div>

        <LessonContentShell
          storageKey={`powershell:${lessonId}`}
          videoUrl={lesson.videoUrl}
          videoTitle={`${lesson.title} — PowerShell`}
        >
          {tab === "theory" ? (
            <NumpyIntroTheory
              lesson={lesson}
              noteDraft={noteDraft}
              onNoteChange={setNoteDraft}
              onSaveNote={handleSaveNote}
              confidence={confidence}
              onConfidenceChange={handleConfidenceChange}
              onGoChallenge={() => setTab("challenge")}
            />
          ) : (
            <PowerShellCodeChallenge
              challenge={lesson.challenge}
              accentColor={lesson.chapterColor}
              isCompleted={isCompleted}
              onComplete={handleChallengeComplete}
              initialCode={savedCodeMap[lessonId]}
              onCodeChange={handleCodeChange}
            />
          )}
        </LessonContentShell>

        <div className="oops-lesson-nav">
          {prev ? (
            <button
              type="button"
              className="oops-nav-btn"
              onClick={() => navigate(`${BASE_PATH}/lesson/${prev.id}`)}
            >
              ← {prev.title}
            </button>
          ) : (
            <div />
          )}
          {next ? (
            <button
              type="button"
              className="oops-nav-btn oops-nav-next"
              onClick={() => navigate(`${BASE_PATH}/lesson/${next.id}`)}
            >
              {next.title} →
            </button>
          ) : (
            <button
              type="button"
              className="oops-nav-btn oops-nav-next"
              onClick={() => navigate(BASE_PATH)}
            >
              Finish Course →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
