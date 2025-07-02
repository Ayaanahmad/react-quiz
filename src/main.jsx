import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Components/App";
import { QuizProvider } from "./contexts/Quizcontext";
import ResumeDialog from "./Components/ResumeDialog";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QuizProvider>
      <ResumeDialog/>
      <App />
    </QuizProvider>
  </React.StrictMode>
);
