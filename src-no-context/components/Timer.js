import { useEffect, useState } from "react";
function Timer({ dispatch, secondsRemaining }) {
  const time = secondsRemaining;
  if (time === 0) dispatch({ type: "finished" });
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  useEffect(
    function () {
      const id = setInterval(() => {
        //   console.log("working");
        //   setTime((tim) => tim - 1 / 2);
        dispatch({ type: "tick" });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <p className="timer">
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </p>
  );
}

export default Timer;
