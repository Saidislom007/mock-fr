import { useEffect, useState } from "react";
import Part1 from "../components/Part1";
import Part2 from "../components/Part2";
import Part3 from "../components/Part3";
import { useRecorder } from "../common/Recorder";
import InstructionPage from "../components/InstructionPage";
import "./speaking.css";

const SpeakingPage = () => {
  const [data, setData] = useState(null);
  const [part, setPart] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [testStarted, setTestStarted] = useState(false);

  const [prepTime, setPrepTime] = useState(0);
  const [timer, setTimer] = useState(0);

  const {
    isRecording,
    startRecording,
    stopRecording,
    startPrepAndRecording,
  } = useRecorder({ part, questionIndex });

  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "—",
    name: "Anon",
    last_name: "",
    middle_name: "",
    phone: "",
  };

  // 🔹 API dan speaking test ma’lumotlarini olish
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/speaking-tests/`)
      .then((res) => res.json())
      .then((data) => {
        const test = data[0];
        const parsed = {
          part1: test.part1_questions.flatMap((q) =>
            q.question_text
              .split("?")
              .map((q) => q.trim())
              .filter(Boolean)
              .map((q) => q + "?")
          ),
          part2: {
            topic: test.part2_cue_card[0]?.topic || "",
            points:
              test.part2_cue_card[0]?.description
                ?.split("\r\n")
                .filter(Boolean) || [],
          },
          part3: test.part3_questions.flatMap((q) =>
            q.question_text
              .split("?")
              .map((q) => q.trim())
              .filter(Boolean)
              .map((q) => q + "?")
          ),
        };
        setData(parsed);
      })
      .catch((err) => console.error("API xatosi:", err));
  }, []);

  // 🔹 LocalStorage progressni load qilish
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("speaking_test_progress"));
    const savedTimer = JSON.parse(localStorage.getItem("speaking_timer"));

    if (savedProgress) {
      setPart(savedProgress.part || 1);
      setQuestionIndex(savedProgress.questionIndex || 0);
      setTestStarted(savedProgress.testStarted || false);
    }
    if (savedTimer) {
      setPrepTime(savedTimer.prepTime || 0);
      setTimer(savedTimer.timer || 0);
    }
  }, []);

  // 🔹 PrepTime countdown
  useEffect(() => {
    if (!testStarted) return;

    if (prepTime > 0) {
      const id = setTimeout(() => setPrepTime((p) => p - 1), 1000);
      return () => clearTimeout(id);
    } else if (prepTime === 0 && !isRecording && timer > 0) {
      startRecording();
    }
  }, [prepTime, isRecording, timer, testStarted]);

  // 🔹 Answer timer countdown
  useEffect(() => {
    if (!testStarted) return;

    if (isRecording && timer > 0) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    } else if (timer === 0 && isRecording) {
      stopRecording();
    }
  }, [timer, isRecording, testStarted]);

  // 🔹 Timer va progressni localStorage saqlash
  useEffect(() => {
    if (testStarted) {
      localStorage.setItem(
        "speaking_test_progress",
        JSON.stringify({ part, questionIndex, testStarted })
      );
      localStorage.setItem(
        "speaking_timer",
        JSON.stringify({ prepTime, timer })
      );
    }
  }, [part, questionIndex, prepTime, timer, testStarted]);

  // 🔹 Start Test
  const startTest = () => {
    setTestStarted(true);
    setPrepTime(30); // Masalan, 30s prep
    setTimer(90); // Masalan, 90s answer
  };

  // 🔹 Next question / part
  const handleNextQuestion = () => {
    const totalQuestions = part === 1 ? data.part1.length : data.part3.length;
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setQuestionIndex(0);
      setPart((p) => p + 1);
    }
  };

  if (!data) return <div>Yuklanmoqda...</div>;

  return (
    <div className="speaking-container">
      {!testStarted ? (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <InstructionPage section={"speaking"} />
          <button className="nav-button" onClick={startTest}>
            Start Test
          </button>
        </div>
      ) : (
        <>
          {part === 1 && (
            <Part1
              data={data.part1}
              questionIndex={questionIndex}
              onNext={handleNextQuestion}
              isRecording={isRecording}
              prepTime={prepTime}
              timer={timer}
              onStart={() => startPrepAndRecording({ prepTime, timer })}
              onStop={stopRecording}
            />
          )}

          {part === 2 && (
            <Part2
              data={data.part2}
              onNext={() => setPart(3)}
              isRecording={isRecording}
              prepTime={prepTime}
              timer={timer}
              onStart={() => startPrepAndRecording({ prepTime, timer })}
              onStop={stopRecording}
            />
          )}

          {part === 3 && (
            <Part3
              data={data.part3}
              questionIndex={questionIndex}
              onNext={handleNextQuestion}
              isRecording={isRecording}
              prepTime={prepTime}
              timer={timer}
              onStart={() => startPrepAndRecording({ prepTime, timer })}
              onStop={stopRecording}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SpeakingPage;
