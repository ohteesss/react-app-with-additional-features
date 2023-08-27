function Options({ options, dispatch, answer, correctOption }) {
  //   let answer = 2;
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {options.map((opt, i) => (
        <button
          className={`btn btn-option ${i === answer ? "answer" : ""} ${
            !hasAnswered ? "" : i === correctOption ? "correct" : "wrong"
          }`}
          key={i}
          onClick={() => {
            console.log(answer);
            dispatch({ type: "questionAnswered", payload: i });
          }}
          disabled={hasAnswered}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default Options;
