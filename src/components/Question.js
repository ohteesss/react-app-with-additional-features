import Options from "./Options";
import { useQuiz } from "../context/QuizContext";
function Question() {
  // console.log(question);
  const { index, diffQuestions } = useQuiz();

  return (
    <div className="question-box">
      <h4>{diffQuestions[index].question}</h4>
      <Options />
      {/* {hasAnswered && (
        <button
          className="btn"
          onClick={() => dispatch({ type: "nextQuestion" })}
        >
          Next
        </button>
      )} */}
    </div>
  );
}

export default Question;
