import { useEffect } from "react";
import { useQuiz } from "../context/QuizContext";

function NextButton() {
  const { index, diffQuestions, dispatch } = useQuiz();
  const numQuestions = diffQuestions.length;
  // const lastPage = index < numQuestions - 1;
  useEffect(
    function () {
      if (index === numQuestions - 1) dispatch({ type: "finished" });
    },
    [index, numQuestions, dispatch]
  );
  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  // else
  //   return (
  //     <button
  //       className="btn btn-ui"
  //       onClick={() => dispatch({ type: "finished" })}
  //     >
  //       Finish
  //     </button>
  //   );
}

export default NextButton;
