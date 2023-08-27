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

  // 'loading' , 'error', ready', 'active',finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  maxQuestions: 1,
  difficulty: 1,
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
      function settingQuestions() {
        switch (state.difficulty) {
          case 0:
            return (diffQuestions = state.questions);
          case 1:
            return (diffQuestions = state.questions.filter(
              (q) => q.points === 10
            ));
          case 2:
            return (diffQuestions = state.questions.filter(
              (q) => q.points === 20
            ));
          case 3:
            return (diffQuestions = state.questions.filter(
              (q) => q.points === 30
            ));

          default:
            throw new Error("Something went wrong");
        }
      }
      settingQuestions();
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        questions: diffQuestions,
      };
    case "questionAnswered":
      const question = state.questions[state.index];
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
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restarted":
      return { ...initialState, status: "ready", questions: state.questions };
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
        maxQuestions: action.payload.numberQuests,
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
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const totalPoints = questions
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
              question={questions[index]}
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
