import { useQuiz } from "../context/QuizContext";

function StartScreen() {
  const { maxQuestions: numQuestions, dispatch } = useQuiz();
  return (
    <div className="start">
      <h2>Welcome to The React Quiz</h2>
      <h3>
        {numQuestions} question{numQuestions === 1 ? "" : "s"} to test your GK
        and science mastery
      </h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "quizStarted" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
