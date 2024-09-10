import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();
// const SECS_PER_QUESTION = 10;
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

function QuizProvider({ children }) {
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
      difficulty,
      secs_per_question,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const totalPoints = diffQuestions
    .map((el) => el.points)
    .reduce((acc, cur) => acc + cur, 0);
  useEffect(function () {
    fetch("http://localhost:7000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <QuizContext.Provider
      value={{
        questions,
        diffQuestions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining,
        maxQuestions,
        dispatch,
        difficulty,
        secs_per_question,
        totalPoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("Context not available at this point");
  return context;
}

export { QuizProvider, useQuiz };
