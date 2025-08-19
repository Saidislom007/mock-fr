import { useEffect } from "react";


const Part3 = ({
  data,
  onFinish,
  isRecording,
  prepTime,
  timer,
  onStart,
  onStop,
  setPrepTime,
  setTimer,
}) => {
  // 🔹 Boshlang‘ich tayyorlanish va recording vaqtlarini o‘rnatish
  useEffect(() => {
    setPrepTime(60);  // 1 daqiqa tayyorlanish
    setTimer(120);    // 2 daqiqa recording
  }, [setPrepTime, setTimer]);

  // 🔹 PrepTime tugagach avtomatik start
  useEffect(() => {
    if (prepTime === 0 && !isRecording && timer > 0) {
      onStart(data.join(" ")); // barcha savollarni bitta stringga birlashtirib yuboramiz
    }
  }, [prepTime, isRecording, timer, data, onStart]);

  // 🔹 Timer tugagach avtomatik stop va yakunlash
  useEffect(() => {
    if (timer === 0 && isRecording) {
      onStop(data.join(" "));
      alert("✅ Part 3 tugadi!");
      onFinish?.();
    }
  }, [timer, isRecording, data, onStop, onFinish]);

  return (
    <div className="card">
      <h1>🗣️ Speaking — Part 3</h1>

      <p><strong>Ko‘rsatma:</strong> Quyidagi savollarga 2 daqiqa davomida javob bering:</p>

      <ul className="question-list">
        {data.map((question, idx) => (
          <li key={idx}>
            <strong>Q{idx + 1}:</strong> {question}
          </li>
        ))}
      </ul>

      {/* Tayyorlanish vaqti */}
      {prepTime > 0 && (
        <div className="timer preparing">🕐 Preparing: {prepTime}s</div>
      )}

      {/* Recording */}
      {isRecording && timer > 0 && (
        <div className="timer recording">🎙️ Recording: {timer}s</div>
      )}

      {/* Qo‘l bilan start */}
      {!isRecording && prepTime === 0 && timer === 0 && (
        <button
          onClick={() => onStart(data.join(" "))}
          className="start-btn"
        >
          🎤 Start
        </button>
      )}

      {/* Qo‘l bilan stop */}
      {isRecording && (
        <button
          onClick={() => {
            onStop(data.join(" "));
            onFinish?.();
            alert("✅ Part 3 tugadi!");
          }}
          className="stop-btn"
        >
          ⏹️ Stop
        </button>
      )}
    </div>
  );
};

export default Part3;
