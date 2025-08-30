import { useEffect } from "react";


const Part2 = ({ data, onNext, isRecording, prepTime, timer, onStart, onStop }) => {
  // ⏱️ PrepTime tugagach recording start
  useEffect(() => {
    if (prepTime === 0 && !isRecording && timer > 0) {
      onStart(data.topic);
    }
  }, [prepTime, isRecording, timer, data, onStart]);

  // ⏹️ Timer tugagach recording stop va keyingi part
  useEffect(() => {
    if (timer === 0 && isRecording) {
      onStop(data.topic);
      onNext();
    }
  }, [timer, isRecording, data, onStop, onNext]);

  return (
    <div className="card">
      <h1> Speaking — Part 2</h1>
      <h2>{data.topic}</h2>
      <ul className="text-lg">
        {data.points.map((point, i) => (
          <li key={i}>{point}</li>
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
        <button onClick={() => onStart(data.topic)} className="start-btn">
          🎤 Start
        </button>
      )}

      {/* Qo‘l bilan stop */}
      {isRecording && (
        <button
          onClick={() => {
            onStop(data.topic);
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

export default Part2;
