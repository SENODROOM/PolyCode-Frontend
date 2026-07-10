import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useAuth } from "../../../auth/context/AuthContext";
import {
  definePolycodeMonacoTheme,
  getVSCodeEditorOptions,
  POLYCODE_VSCODE_THEME,
} from "../../../../shared/utils/monacoTheme";

function normalizeWhitespace(value = "") {
  return value.replace(/\s+/g, "");
}

function testPasses(test, code) {
  if (test.regex) {
    return new RegExp(test.regex.source, test.regex.flags || "").test(code);
  }
  return true;
}

export default function PowerShellCodeChallenge({
  challenge,
  accentColor,
  isCompleted,
  onComplete,
  initialCode,
  onCodeChange,
}) {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const canRun = isAuthenticated && !authLoading;

  const [code, setCode] = useState(initialCode || challenge.defaultCode || "");
  const [results, setResults] = useState(null);
  const [output, setOutput] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [running, setRunning] = useState(false);
  const activeChallengeId = useRef(challenge?.id);
  const runTestsRef = useRef(null);

  useEffect(() => {
    if (!challenge) return;
    const challengeChanged = activeChallengeId.current !== challenge.id;
    if (challengeChanged) {
      activeChallengeId.current = challenge.id;
      setCode(initialCode || challenge.defaultCode || "");
      setResults(null);
      setOutput(null);
      setShowSolution(false);
      return;
    }

    if (typeof initialCode === "string") {
      setCode((currentCode) =>
        currentCode === (challenge.defaultCode || "") ? initialCode : currentCode,
      );
    }
  }, [challenge?.id, challenge?.defaultCode, initialCode]);

  function runTests() {
    if (!canRun || running || showSolution || !challenge) return;

    setRunning(true);
    setResults(null);
    setOutput({
      status: "running",
      stdout: "Running PowerShell checks…",
    });

    window.setTimeout(() => {
      const testResults = (challenge.tests || []).map((test) => ({
        ...test,
        passed: testPasses(test, code),
      }));

      const allPassed = testResults.every((test) => test.passed);

      setResults({ passed: allPassed, tests: testResults });
      setOutput({
        status: allPassed ? "pass" : "fail",
        stdout: allPassed ? "Script executed successfully!" : "Script failed or did not meet requirements.",
      });

      if (allPassed && !isCompleted) {
        Promise.resolve(onComplete()).catch((error) => {
          console.error("Unable to save lesson progress:", error);
        });
      }

      setRunning(false);
    }, 600);
  }

  useEffect(() => {
    runTestsRef.current = runTests;
  });

  function handleEditorMount(editor, monaco) {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (canRun) runTestsRef.current?.();
    });
  }

  function resetCode() {
    if (!challenge) return;
    setCode(challenge.defaultCode || "");
    onCodeChange?.(challenge.defaultCode || "");
    setResults(null);
    setOutput(null);
    setShowSolution(false);
  }

  if (!challenge) return null;

  return (
    <div className="oops-challenge">
      <div className="oops-problem-panel">
        <div className="oops-problem-header">
          <h3 className="oops-problem-title">{challenge.title}</h3>
          {canRun && isCompleted && (
            <span
              className="oops-problem-solved"
              style={{ color: accentColor }}
            >
              ✓ Solved
            </span>
          )}
        </div>
        {Array.isArray(challenge.description) ? (
          <div className="oops-problem-desc">
            {challenge.description.map((block, i) => {
              if (block.type === "text")
                return (
                  <p key={i} style={{ marginBottom: "10px" }}>
                    {block.content}
                  </p>
                );
              if (block.type === "code")
                return (
                  <pre
                    key={i}
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      padding: "10px 14px",
                      borderRadius: "7px",
                      fontSize: "0.82rem",
                      margin: "8px 0",
                      overflowX: "auto",
                    }}
                  >
                    <code>{block.content}</code>
                  </pre>
                );
              return null;
            })}
          </div>
        ) : (
          <p className="oops-problem-desc">{challenge.description}</p>
        )}
        
        {challenge.instructions && (
          <div className="oops-problem-desc" style={{marginTop: "1rem"}}>
            <strong>Instructions:</strong>
            <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
               {challenge.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
            </ul>
          </div>
        )}

        {!canRun && (
          <div className="oops-auth-gate">
            <p>
              You can write code in the editor. Sign in or create an account to
              run, submit, save progress, and mark lessons complete.
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

        <div className="oops-test-cases">
          <div className="oops-test-cases-label">Acceptance Tests</div>
          {(results ? results.tests : challenge.tests).map((t) => (
            <div
              key={t.id}
              className={`oops-test-row ${
                results ? (t.passed ? "oops-test-pass" : "oops-test-fail") : ""
              }`}
            >
              <span className="oops-test-icon">
                {results ? (t.passed ? "✓" : "✗") : "○"}
              </span>
              <span className="oops-test-label">{t.description || t.label}</span>
              {results && !t.passed && t.errorMessage && (
                <span className="oops-test-hint">Hint: {t.errorMessage}</span>
              )}
            </div>
          ))}
        </div>

        <div
          className={`oops-output-panel ${
            output?.status ? `oops-output-${output.status}` : ""
          }`}
        >
          <div className="oops-output-head">
            <span>Output</span>
            <small>{output ? "after last run" : "waiting for run"}</small>
          </div>
          <pre className="oops-output-body">
            {output?.stdout || "Run your script to see output here."}
          </pre>
        </div>
      </div>

      <div className="oops-editor-panel">
        <div className="oops-editor-topbar">
          <span className="oops-editor-lang">PowerShell · script.ps1</span>
          <div className="oops-editor-actions">
            <button
              type="button"
              className="oops-editor-action"
              onClick={resetCode}
            >
              ↺ Reset
            </button>
            <button
              type="button"
              className="oops-editor-action"
              onClick={() => setShowSolution(!showSolution)}
              disabled={!canRun || !challenge.solutionCode}
            >
              {showSolution ? "Hide Solution" : "💡 Solution"}
            </button>
          </div>
        </div>

        <div className="oops-editor">
          <Editor
            height="100%"
            language="powershell"
            value={showSolution ? challenge.solutionCode : code}
            beforeMount={definePolycodeMonacoTheme}
            onMount={handleEditorMount}
            theme={POLYCODE_VSCODE_THEME}
            onChange={(value) => {
              if (!showSolution) {
                const next = value || "";
                setCode(next);
                if (isAuthenticated) onCodeChange?.(next);
              }
            }}
            options={getVSCodeEditorOptions({
              fontSize: 14,
              readOnly: showSolution,
            })}
          />
        </div>

        <div className="oops-run-bar">
          {results && (
            <div
              className={`oops-verdict ${results.passed ? "oops-verdict-pass" : "oops-verdict-fail"}`}
            >
              {results.passed
                ? "✓ All tests passed!"
                : `${results.tests.filter((t) => t.passed).length}/${challenge.tests.length} tests passed`}
            </div>
          )}
          <button
            type="button"
            className="oops-run-btn"
            style={{ "--accent": accentColor }}
            onClick={runTests}
            disabled={!canRun || running || showSolution}
            title={!canRun ? "Sign in or sign up to run and submit" : undefined}
          >
            {authLoading
              ? "Checking sign-in…"
              : running
                ? "⟳ Running…"
                : canRun
                  ? "▶ Run & Submit"
                  : "Sign in to run & submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
