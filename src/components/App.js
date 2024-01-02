import Header from "./Header.js";
import Main from "./Main.js";

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
import { useQuiz } from "../context/QuizContext.js";

export default function App() {
  const { status, answer } = useQuiz();
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />} {status === "error" && <Error />}{" "}
        {status === "initialSettings" && <AdditionalStartScreen />}
        {status === "ready" && (
          <>
            {" "}
            {/* <AdditionalStartScreen dispatch={dispatch} questions={questions} /> */}
            {/* <StartScreen numQuestions={numQuestions} dispatch={dispatch} /> */}
            <StartScreen />
          </>
        )}
        {status === "active" && (
          <Footer>
            {" "}
            <Progress />
            <Question />
            <Timer />
            {answer !== null && <NextButton />}
          </Footer>
        )}
        {/* {status === "finished" && <Finished />} */}
        {status === "finished" && <Finished />}
      </Main>
    </div>
  );
}
