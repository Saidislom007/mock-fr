import { useEffect, useState } from "react";

const Part3 = ({ data, onNext, isRecording, onStart, onStop }) => {
  const [prepTime, setPrepTime] = useState(null); // Boshlashdan oldin null
  const [timer, setTimer] = useState(0);

  // ⏱️ Tayyorlanish bosqichi
  useEffect(() => {
    if (prepTime > 0) {
      const id = setTimeout(() => setPrepTime((p) => p - 1), 1000);
      return () => clearTimeout(id);
    }

    if (prepTime === 0 && !isRecording && timer === 0) {
      // 1 minut tugagach recordingni 2 minutga yoqamiz
      onStart(data.title);
      setTimer(120);
    }
  }, [prepTime, isRecording, timer, data, onStart]);

  // 🎙️ Recording bosqichi
  useEffect(() => {
    if (timer > 0 && isRecording) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }

    if (timer === 0 && isRecording) {
      // Avtomatik stop
      onStop(data.title);
      onNext();
    }
  }, [timer, isRecording, data, onStop, onNext]);

  return (
    <div className="card">
      <h1>
        {/* <img src="./man.svg" alt="icon" className="h-10 inline-block mr-2" /> */}
        Speaking — Part 3
      </h1>
      <h2>{data.title}</h2>

      <ul className="text-lg">
        {data.questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>

      {/* Start tugmasi */}
      {prepTime === null && timer === 0 && !isRecording && (
        <button onClick={() => setPrepTime(60)} className="start-btn">
          🎤 Start
        </button>
      )}

      {/* Tayyorlanish vaqtini ko‘rsatish */}
      {prepTime > 0 && (
        <div className="timer preparing">🕐 Preparing: {prepTime}s</div>
      )}

      {/* Recording vaqtini ko‘rsatish */}
      {isRecording && timer > 0 && (
        <div className="timer recording">🎙️ Recording: {timer}s</div>
      )}

      {/* Qo‘lda stop tugmasi */}
      {isRecording && (
        <button
          onClick={() => {
            onStop(data.title);
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

export default Part3;
