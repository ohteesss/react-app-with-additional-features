import { useEffect } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import { useReducer } from "react";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import Finished from "./FinishScreen.js";
import Footer from "./Footer.js";
import Timer from "./Timer.js";
import AdditionalStartScreen from "./AdditionalStartScreenFeatures.js";
const SECS_PER_QUESTION = 10;
const initialState = {
  questions: [],
  diffQuestions: [],

  // 'loading' , 'error', ready', 'active',finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  maxQuestions: 1,
  difficulty: 0,
  secs_per_question: 5,
};
function reducer(state, action) {
  // if (state.index === 14) return { ...state, status: "finished" };
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        // status: "ready",
        status: "initialSettings",
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "quizStarted":
      let diffQuestions;
      const easyQuestion = state.questions.filter((q) => q.points === 10);
      const mediumQuestion = state.questions.filter((q) => q.points === 20);
      const hardQuestion = state.questions.filter((q) => q.points === 30);

      function settingQuestions() {
        switch (state.difficulty) {
          case 0:
            return (diffQuestions = state.questions.slice(
              0,
              state.maxQuestions
            ));
          case 1:
            return (diffQuestions = easyQuestion.slice(0, state.maxQuestions));
          case 2:
            return (diffQuestions = mediumQuestion.slice(
              0,
              state.maxQuestions
            ));
          case 3:
            return (diffQuestions = hardQuestion.slice(0, state.maxQuestions));

          default:
            throw new Error("Something went wrong");
        }
      }
      settingQuestions();
      console.log(state);
      return {
        ...state,
        status: "active",
        diffQuestions: diffQuestions,
        secondsRemaining: state.maxQuestions * state.secs_per_question,
      };
    case "questionAnswered":
      const question = state.diffQuestions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          question?.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finished":
      const savedHighscore = localStorage.getItem("highscore");
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > savedHighscore ? state.points : savedHighscore,
      };
    case "restarted":
      function highScoreSettings() {
        !localStorage.getItem("highscore") &&
          localStorage.setItem("highscore", state.highScore);
        +localStorage.getItem("highscore") < state.highScore &&
          localStorage.setItem("highscore", state.highScore);
      }
      highScoreSettings();
      return {
        ...initialState,
        status: "initialSettings",
        questions: state.questions,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        // status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "settings":
      return {
        ...state,
        status: "ready",
        maxQuestions: action.payload.numberQuest,
        difficulty: action.payload.difficulty,
        secs_per_question: action.payload.secsPerQuest,
      };
    default:
      throw new Error("Action Unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining,
      maxQuestions,
      diffQuestions,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = diffQuestions.length;
  const totalPoints = diffQuestions
    .map((el) => el.points)
    .reduce((acc, cur) => acc + cur, 0);
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />} {status === "error" && <Error />}{" "}
        {status === "initialSettings" && (
          <AdditionalStartScreen dispatch={dispatch} questions={questions} />
        )}
        {status === "ready" && (
          <>
            {" "}
            {/* <AdditionalStartScreen dispatch={dispatch} questions={questions} /> */}
            {/* <StartScreen numQuestions={numQuestions} dispatch={dispatch} /> */}
            <StartScreen numQuestions={maxQuestions} dispatch={dispatch} />
          </>
        )}
        {status === "active" && (
          <Footer>
            {" "}
            <Progress
              index={index}
              points={points}
              totalPoints={totalPoints}
              numQuestions={numQuestions}
              answer={answer}
            />
            <Question
              dispatch={dispatch}
              question={diffQuestions[index]}
              answer={answer}
            />
            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            {answer !== null && (
              <NextButton
                dispatch={dispatch}
                index={index}
                numQuestions={numQuestions}
              />
            )}
          </Footer>
        )}
        {status === "finished" && (
          <Finished
            points={points}
            totalPoints={totalPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
