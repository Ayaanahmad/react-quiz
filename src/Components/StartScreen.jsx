import React from "react";
import { useQuiz } from "../contexts/Quizcontext";

const StartScreen = () => {
  const { numQuestions, dispatch } = useQuiz();

  return (
    <div className="start">
      <h2>Welcome to the React Quiz</h2>
      <h3>{numQuestions} questions to test your react mastery</h3>
      <button
        className="btn btn-start"
        onClick={() => dispatch({ type: "start", status: "active" })}
      >
        Let's Start
      </button>
    </div>
  );
};

export default StartScreen;
