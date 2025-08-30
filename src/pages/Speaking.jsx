// src/pages/SpeakingPage.jsx
import { useEffect, useState } from "react";
import Part1 from "../components/Part1";
import Part2 from "../components/Part2";
import Part3 from "../components/Part3";
import { useRecorder } from "../common/Recorder";
import "./speaking.css";

const SpeakingPage = () => {
  const [data, setData] = useState(null);
  const [part, setPart] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);

  const {
    isRecording,
    prepTime,
    timer,
    setPrepTime,
    setTimer,
    startRecording,
    stopRecording,
    startPrepAndRecording,
  } = useRecorder({ part, questionIndex });

  // 🔹 API dan testlarni olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/speaking-tests/`
        );
        const result = await res.json();
        const test = result[0];

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
          part3: test.part3_questions.map((q) => ({
            title: q.title,
            questions: q.question_text
              .split("\r\n")
              .map((qq) => qq.trim())
              .filter(Boolean),
          })),
        };

        setData(parsed);
      } catch (err) {
        console.error("API xatosi:", err);
      }
    };

    fetchData();
  }, []);

  // 🔹 Prep time tugaganda recording boshlash
  useEffect(() => {
    if (prepTime > 0) {
      const id = setTimeout(() => setPrepTime((p) => p - 1), 1000);
      return () => clearTimeout(id);
    }
    if (prepTime === 0 && !isRecording && timer > 0) {
      startRecording();
    }
  }, [prepTime]);

  // 🔹 Timer tugaganda recording to‘xtatish
  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }
    if (timer === 0 && isRecording) stopRecording();
  }, [timer]);

  // 🔹 Keyingi savolga o‘tish yoki part o‘zgartirish
  const handleNextQuestion = () => {
    if (!data) return;

    if (part === 1) {
      if (questionIndex < data.part1.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        setQuestionIndex(0);
        setPart(2); // Part2 ga o‘tadi
      }
    } else if (part === 2) {
      setQuestionIndex(0);
      setPart(3); // Part3 ga o‘tadi
    } else if (part === 3) {
      if (questionIndex < data.part3.length - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        console.log("✅ Test tugadi"); // Hammasi tugadi
      }
    }
  };

  if (!data) return <div>Yuklanmoqda...</div>;

  return (
    <div className="speaking-container">
      {part === 1 && (
        <Part1
          data={data.part1}
          onStart={startPrepAndRecording}
          onStop={stopRecording}
          onFinish={() => {
            setPart(2); // Faqat part ni o'zgartiramiz
            console.log("Finished Part 1")
          }}
        />
      )}

      {part === 2 && (
        <Part2
          data={data.part2}
          questionIndex={questionIndex}
          onNext={() => {
            setQuestionIndex(0);
            setPart(3);
          }}
          isRecording={isRecording}
          prepTime={prepTime}
          timer={timer}
          onStart={startPrepAndRecording}
          onStop={stopRecording}
          onFinish={() => {
            setQuestionIndex(0);
            setPart(3);
          }}
        />
      )}

      {part === 3 && (
        <Part3
          data={data.part3[questionIndex]}
          questionIndex={questionIndex}
          onNext={handleNextQuestion}
          isRecording={isRecording}
          prepTime={prepTime}
          timer={timer}
          onStart={startPrepAndRecording}
          onStop={stopRecording}
          onFinish={() => console.log("✅ Speaking test tugadi")}
        />
      )}
    </div>
  );
};

export default SpeakingPage;
