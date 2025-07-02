import React from "react";

const Options = ({ questions, answer, dispatch }) => {
  const hasAnswered = answer !== null;
  return (
    <div>
      <div className="options">
        {questions.options.map((option, index) => (
          <button
            className={`btn btn-option ${index === answer ? "answer" : ""} ${
              hasAnswered
                ? index === questions.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
            key={option}
            disabled={hasAnswered}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Options;
