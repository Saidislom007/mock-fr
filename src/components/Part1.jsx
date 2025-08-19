import { useEffect } from "react";


const Part1 = ({
  data,
  questionIndex,
  onNext,
  isRecording,
  prepTime,
  timer,
  onStart,
  onStop,
}) => {
  // ⏱️ Tayyorlanish tugagach yozishni boshlash
  useEffect(() => {
    if (prepTime === 0 && !isRecording && timer > 0) {
      onStart(data[questionIndex]); // recording start
    }
  }, [prepTime, isRecording, timer, data, questionIndex, onStart]);

  // ⏹️ Yozish tugasa avtomatik to‘xtash va navbatdagi savolga o‘tish
  useEffect(() => {
    if (timer === 0 && isRecording) {
      onStop(data[questionIndex]);
      onNext();
    }
  }, [timer, isRecording, data, questionIndex, onStop, onNext]);

  return (
    <div className="card">
      <h1>🗣️ Speaking — Part 1</h1>

      <div className="question-box">
        <h3>Question {questionIndex + 1}</h3>
        <h2>{data[questionIndex]}</h2>
      </div>

      {/* Tayyorlanish vaqti */}
      {prepTime > 0 && (
        <div className="timer preparing">🕐 Preparing: {prepTime}s</div>
      )}

      {/* Recording jarayoni */}
      {isRecording && timer > 0 && (
        <div className="timer recording">🎙️ Recording: {timer}s</div>
      )}

      {/* Tayyor tugagach va vaqt ham yo‘q bo‘lsa qo‘l bilan Start */}
      {!isRecording && prepTime === 0 && timer === 0 && (
        <button
          onClick={() => onStart(data[questionIndex])}
          className="start-btn"
        >
          🎤 Start
        </button>
      )}

      {/* Agar recording bo‘lsa Stop tugmasi */}
      {isRecording && (
        <button
          onClick={() => {
            onStop(data[questionIndex]);
            onNext();
          }}
          className="stop-btn"
        >
          ⏹️ Stop
        </button>
      )}
    </div>
  );
};

export default Part1;
