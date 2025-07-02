// import { createContext, useContext, useReducer, useEffect } from "react";

// const QuizContext = createContext();

// const SECS_PER_QUESTION = 30;

// const initialState = {
//   questions: [],
//   status: "loading",
//   index: 0,
//   answer: null,
//   points: 0,
//   highscore: Number(localStorage.getItem("highscore")) || 0,
//   secondsRemaining: null,
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "dataRecieved":
//       return {
//         ...state,
//         questions: action.payload,
//         status: "ready",
//       };
//     case "dataFailed":
//       return {
//         ...state,
//         status: "error",
//       };
//     case "start":
//       return {
//         ...state,
//         status: "active",
//         secondsRemaining: state.questions.length * SECS_PER_QUESTION,
//       };
//     case "newAnswer":
//       const question = state.questions.at(state.index);
//       return {
//         ...state,
//         answer: action.payload,
//         points:
//           action.payload === question.correctOption
//             ? state.points + question.points
//             : state.points,
//       };
//     case "nextQuestion":
//       return { ...state, index: state.index + 1, answer: null };
//     case "finished":
//       const newHighscore = state.points > state.highscore ? state.points : state.highscore;
//       localStorage.setItem("highscore", newHighscore);
//       return {
//         ...state,
//         status: "finished",
//         highscore: newHighscore
//       };
//     case "restart":
//       return { ...initialState, questions: state.questions, status: "ready", highscore: state.highscore };

//     case "tick":
//       return {
//         ...state,
//         secondsRemaining: state.secondsRemaining - 1,
//         status: state.secondsRemaining === 0 ? "finished" : state.status,
//       };

//     default:
//       throw new Error("Action unkonwn");
//   }
// };

// const QuizProvider = ({ children }) => {
//   const [
//     { questions, status, index, answer, points, highscore, secondsRemaining },
//     dispatch,
//   ] = useReducer(reducer, initialState);

//   const numQuestions = questions.length;
//   const maxPossiblePoints = questions.reduce(
//     (prev, cur) => prev + cur.points,
//     0
//   );

//   useEffect(() => {
//     fetch(
//       "https://raw.githubusercontent.com/Ayaanahmad/json-server/refs/heads/main/db.json"
//     )
//       .then((res) => res.json())
//       .then((data) => dispatch({ type: "dataRecieved", payload: data }))
//       .catch((err) => dispatch({ type: "dataFailed" }));
//   }, []);

//   return (
//     <QuizContext.Provider
//       value={{
//         questions,
//         status,
//         index,
//         answer,
//         points,
//         highscore,
//         secondsRemaining,
//         numQuestions,
//         maxPossiblePoints,
//         dispatch,
//       }}
//     >
//       {children}
//     </QuizContext.Provider>
//   );
// };

// const useQuiz = () => {
//   const context = useContext(QuizContext);
//   if (context === undefined) {
//     throw new Error("QuizContext was used outside the QuizProvider");
//   }
//   return context;
// };

// export { QuizProvider, useQuiz };

import { createContext, useContext, useReducer, useEffect } from "react";

const QuizContext = createContext();
const SECS_PER_QUESTION = 30;

const saveToLocalStorage = (state) => {
  localStorage.setItem("quizState", JSON.stringify(state));
};

const getSavedState = () => {
  const saved = localStorage.getItem("quizState");
  return saved ? JSON.parse(saved) : null;
};

const savedState = getSavedState();

const initialState = savedState
  ? {
      ...savedState,
      status: "resume-prompt", // resume quiz if it was in progress
    }
  : {
      questions: [],
      status: "loading",
      index: 0,
      answer: null,
      points: 0,
      highscore: Number(localStorage.getItem("highscore")) || 0,
      secondsRemaining: null,
    };

const reducer = (state, action) => {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: state.questions.length ? state.status : "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      const startedState = {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
      saveToLocalStorage(startedState);
      return startedState;

    case "newAnswer": {
      const question = state.questions.at(state.index);
      const newState = {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
      saveToLocalStorage(newState);
      return newState;
    }

    case "nextQuestion": {
      const newState = {
        ...state,
        index: state.index + 1,
        answer: null,
      };
      saveToLocalStorage(newState);
      return newState;
    }

    case "finished": {
      const newHighscore =
        state.points > state.highscore ? state.points : state.highscore;

      localStorage.setItem("highscore", newHighscore);
      localStorage.removeItem("quizState"); // cleanup

      return {
        ...state,
        status: "finished",
        highscore: newHighscore,
      };
    }

    case "restart":
      localStorage.removeItem("quizState"); // cleanup
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore, // preserve highscore
      };

    case "tick": {
      const newTime = state.secondsRemaining - 1;
      const newState = {
        ...state,
        secondsRemaining: newTime,
        status: newTime === 0 ? "finished" : state.status,
      };
      saveToLocalStorage(newState);
      return newState;
    }
    case "resumeQuiz":
      return {
        ...state,
        status: "active", // continue the quiz normally
      };

    case "discardResume":
      localStorage.removeItem("quizState");
      return {
        ...state,
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        status: "ready",
        highscore: state.highscore,
      };

    default:
      throw new Error("Action unknown");
  }
};

const QuizProvider = ({ children }) => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Ayaanahmad/json-server/refs/heads/main/db.json"
    )
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("QuizContext was used outside the QuizProvider");
  }
  return context;
};

export { QuizProvider, useQuiz };
