import React from "react";
import Header from "./Components/Header";
import "./index.css";
import Main from "./Components/Main";
import Loader from "./Components/Loader";
import Error from "./Components/Error";
import StartQuiz from "./Components/StartScreen";
import { useEffect } from "react";
import { useReducer } from "react";
import Questions from "./Components/Questions";
import NextButton from "./Components/NextButton";
import Progress from "./Components/Progress";
import FinishedScreen from "./Components/FinishedScreen";
import Footer from "./Components/Footer";
import Timer from "./Components/Timer";

const initialState = {
  questions: [],
  // "loading", "ready", "finished", "inprogress"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const SECS_PER_QUESTION = 30;

const reducer = (state, action) => {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return { ...state, status: "active", secondsRemaining: state.questions.length * SECS_PER_QUESTION };

    case "finished":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };

    case "tick":
      return { ...state, secondsRemaining: state.secondsRemaining-1, status: state.secondsRemaining === 0 ? "finished"  :state.status };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    default:
      throw new Error("Data not received");
  }
};
const App = () => {
  const [{ questions, status, index, answer, points, highScore, secondsRemaining }, dispatch] =
    useReducer(reducer, initialState);

  const numOfQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://raw.githubusercontent.com/Ayaanahmad/json-server/refs/heads/main/db.json");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        console.log(data)
        dispatch({ type: "dataRecieved", payload: data });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    }
    fetchData();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartQuiz dispatch={dispatch} numOfQuestions={numOfQuestions} />
        )}
        {status === "active" && (
          <>
            <Progress
              numOfQuestions={numOfQuestions}
              index={index}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Questions
              questions={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numOfQuestions={numOfQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
