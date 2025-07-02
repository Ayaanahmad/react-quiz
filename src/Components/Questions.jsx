import React from "react";
import Options from "./Options";
import { useQuiz } from "../contexts/Quizcontext";

const Questions = () => {
  const { questions, index } = useQuiz();
  const question = questions.at(index);

  console.log(question)

  return (
    <div className="question">
      <h4>{question.question}</h4>
      <Options questions={question} />
    </div>
  );
};

export default Questions;
