import React from "react";

const NextButton = ({ dispatch, answer, index, numOfQuestions }) => {
  const hasAnswered = answer !== null;
  if (index < numOfQuestions - 1) {
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
  if (index === numOfQuestions - 1) {
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
