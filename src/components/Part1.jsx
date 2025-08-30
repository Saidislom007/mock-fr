import { useEffect, useState, useRef } from "react";

const Part1 = ({ data, onStart, onStop, onFinish }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [prepTime, setPrepTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [started, setStarted] = useState(false);

  const prepRef = useRef(null);
  const timerRef = useRef(null);

  // 🔹 Savol o'zgarganda interval'larni tozalash
  useEffect(() => {
    clearInterval(prepRef.current);
    clearInterval(timerRef.current);
  }, [questionIndex]);

  // 🔹 Prep time sanash
  useEffect(() => {
    if (prepTime > 0) {
      prepRef.current = setInterval(() => {
        setPrepTime((prev) => {
          if (prev === 1) {
            clearInterval(prepRef.current);
            setIsRecording(true);
            setTimer(30);
            onStart && onStart(data[questionIndex]);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(prepRef.current);
  }, [prepTime, data, questionIndex, onStart]);

  // 🔹 Recording sanash
  useEffect(() => {
    if (isRecording && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current);
            setIsRecording(false);

            setTimeout(() => {
              onStop && onStop(data[questionIndex]);

              if (questionIndex < data.length - 1) {
                setQuestionIndex((prevIdx) => prevIdx + 1);
                setPrepTime(5); // Keyingi savol uchun prepTime
              } else {
                // Oxirgi savol tugaganda prepTime ni 0 qilamiz
                setPrepTime(0);
                onFinish && onFinish();
              }
            }, 0);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording, timer, data, questionIndex, onStop, onFinish]);

  return (
    <div className="card">
      <h1>Speaking — Part 1</h1>

      <div className="question-box">
        <h3>Question {questionIndex + 1} of {data.length}</h3>
        <h2>{data[questionIndex]}</h2>
      </div>

      {!started && (
        <button
          onClick={() => {
            setPrepTime(5);
            setStarted(true);
          }}
          className="start-btn"
        >
          🎤 Start
        </button>
      )}

      {prepTime > 0 && <div className="timer preparing">🕐 Preparing: {prepTime}s</div>}
      {isRecording && timer > 0 && <div className="timer recording">🎙️ Recording: {timer}s</div>}

      {isRecording && (
        <button
          onClick={() => {
            clearInterval(timerRef.current);
            setIsRecording(false);
            onStop && onStop(data[questionIndex]);

            if (questionIndex < data.length - 1) {
              setQuestionIndex((prevIdx) => prevIdx + 1);
              setPrepTime(5);
            } else {
              // Oxirgi savol tugaganda prepTime ni 0 qilamiz
              setPrepTime(0);
              onFinish && onFinish();
            }
          }}
          className="stop-btn"
        >
          ⏹ Stop
        </button>
      )}
    </div>
  );
};

export default Part1;
