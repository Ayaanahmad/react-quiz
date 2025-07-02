import React from "react";
import { useQuiz } from "../contexts/Quizcontext";

const Progress = () => {
  const { index, numQuestions, points, maxPoints, answer } = useQuiz();

  return (
    <header className="progress">
      <progress value={index + Number(answer !== null)} max={numQuestions} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints} points
      </p>
    </header>
  );
};

export default Progress;
