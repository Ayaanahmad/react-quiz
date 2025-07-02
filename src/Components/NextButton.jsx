import React from "react";
import { useQuiz } from "../contexts/Quizcontext";

const NextButton = () => {
  const { dispatch, answer, index, numQuestions } = useQuiz();

  const hasAnswered = answer !== null;
  if (index < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
        disabled={!hasAnswered}
      >
        Next
      </button>
    );
  }
  
  if (index === numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finished" })}
        disabled={!hasAnswered}
      >
        Finish
      </button>
    );
  }
};

export default NextButton;
