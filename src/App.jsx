import "./App.css";
import "./index.css";
import DateCounter from "./components/DateCounter";
// import Header from "../components/Header";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Question from "./components/Question";
import Error from "./components/Error";
import MainSection from "./components/MainSection";
import { question } from "./questions";
import { createContext, useEffect, useReducer } from "react";
import StartScreen from "./StartScreen";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: 300,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "NewAnswer":
      // const currentQuestion = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === state.questions.at(state.index).correctAnswer
            ? state.points + state.questions.at(state.index).points
            : state.points,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points < state.highScore ? state.points : state.highScore,
      };
    case "startagain":
      return {
        ...state,
        index: 0,
        answer: null,
        status: "active",
        points: 0,
        highScore: 0,
        secondsRemaining: 300,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw Error("action is Unknown");
  }
}
export const PuntlandContext = createContext();
function App() {
  const [
    { status, questions, index, answer, secondsRemaining, points, highScore },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  const totalPoints = questions.reduce(
    (sum, question) => sum + question.points,
    0
  );

  useEffect(function () {
    dispatch({ type: "dataReceived", payload: question });
  }, []);

  return (
    <div className="app">
      <PuntlandContext.Provider
        value={{
          numQuestions,
          dispatch,
          index,
          totalPoints,
          points,
          answer,
          questions: questions[index],
          minutes: secondsRemaining,
          allQuestions: questions,
        }}
      >
        <Header />

        <MainSection className="main">
          {status === "loading" && <Loader />}
          {status === "ready" && <StartScreen />}
          {status === "error" && <Error />}
          {status === "active" && (
            <>
              <Progress />
              <Question />
              <Footer>
                <NextButton />
                <Timer />
              </Footer>
            </>
          )}
          {status === "finished" && <FinishScreen />}
        </MainSection>
      </PuntlandContext.Provider>
    </div>
  );
}

export default App;
