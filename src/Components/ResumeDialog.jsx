import React from "react";
import { useQuiz } from "../contexts/Quizcontext";

export default function ResumeDialog() {
  const { status, dispatch } = useQuiz();

  if (status !== "resume-prompt") return null;

  return (
    <div className="resume-overlay">
      <div className="resume-dialog">
        <h2>Resume Quiz?</h2>
        <p>You have an unfinished quiz. Would you like to continue?</p>
        <div className="resume-buttons">
          <button
            onClick={() => dispatch({ type: "discardResume" })}
            className="resume-btn cancel"
          >
            Start Over
          </button>
          <button
            onClick={() => dispatch({ type: "resumeQuiz" })}
            className="resume-btn continue"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
