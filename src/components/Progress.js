import { useQuiz } from "../context/QuizContext";

function Progress() {
  const { index, diffQuestions, totalPoints, points, answer } = useQuiz();

  return (
    <header className="progress">
      <progress
        max={diffQuestions.length}
        value={index + Number(answer !== null)}
      />
      <p>
        Question <strong> {index + 1}</strong>/ {diffQuestions.length}
      </p>
      <p>
        {" "}
        <strong>{points}</strong>/ {totalPoints}{" "}
      </p>
    </header>
  );
}

export default Progress;
