import { useEffect, useState } from "react";
import Options from "./Options";
function Question({ question, dispatch, answer }) {
  // console.log(question);
  const { options, correctOption, points } = question;

  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        options={options}
        dispatch={dispatch}
        answer={answer}
        correctOption={correctOption}
      />
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
