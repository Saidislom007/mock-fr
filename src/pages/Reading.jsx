import React, { useState } from "react";
import Passage1 from "../components/Passage1";
import Passage2 from "../components/Passage2";
import Passage3 from "../components/Passage3";
import ReadingTimer from "../components/ReadingTimer";
import InstructionPage from "../components/InstructionPage";
import "./m.css";

const Reading = () => {
  const [results, setResults] = useState({
    passage1: 0,
    passage2: 0,
    passage3: 0,
  });

  const [fontSize, setFontSize] = useState(16);
  const [testFinished, setTestFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // 🔧 Font zoom funksiyalari
  const increaseFont = () => setFontSize((prev) => Math.min(prev + 2, 48));
  const decreaseFont = () => setFontSize((prev) => Math.max(prev - 2, 10));

  // Timer tugaganda chaqiriladigan funksiya
  const handleTimeUp = () => {
    alert("Time is up! Submitting your test automatically...");
    handleFinalSubmit();
  };

  // Passage natijalarini saqlash
  const handlePassageResult = (passageKey, correctCount) => {
    setResults((prev) => ({
      ...prev,
      [passageKey]: correctCount,
    }));
  };

  // Testni yakunlash va natijani serverga yuborish
  const handleFinalSubmit = () => {
    if (testFinished) return;
    setTestFinished(true);

    const total =
      (results.passage1 || 0) +
      (results.passage2 || 0) +
      (results.passage3 || 0);

    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Foydalanuvchi ma'lumoti topilmadi.");
      return;
    }

    const user = JSON.parse(userData);
    const userId = user.id;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/test-results/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userId,
        reading_correct_answers: total,
        listening_correct_answers: 0,
        speaking_score: 0,
        writing_score: 0,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Xatolik yuz berdi.");
        return response.json();
      })
      .then((data) => {
        console.log("Natija yuborildi:", data);
        alert("Test results sent successfully!");
      })
      .catch((error) => {
        console.error("Server xatosi:", error);
        alert("Natijalarni yuborishda xatolik yuz berdi.");
      });
  };

  // Testni boshlash
  const startTest = () => {
    setTestStarted(true);
    setTestFinished(false);
    setTimerKey((prev) => prev + 1); // timer reset
  };

  return (
    <div className="reading-main">
      {/* Yuqori panel: Timer va Font Zoom */}
      {testStarted && !testFinished && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <ReadingTimer
            key={timerKey}
            isRunning={testStarted && !testFinished}
            onTimeUp={handleTimeUp}
          />

          <div
            style={{
              background: "#f0f0f0",
              padding: "8px 16px",
              borderRadius: "6px",
              display: "flex",
              gap: 10,
              boxShadow: "0 0 6px rgba(0,0,0,0.1)",
            }}
          >
            <button onClick={decreaseFont}>-</button>
            <button onClick={increaseFont}>+</button>
          </div>
        </div>
      )}

      {/* Instruction Page: Test boshlanmagan bo‘lsa */}
      {!testStarted ? (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <InstructionPage section="reading" />
          <button className="nav-button" onClick={startTest}>
            Start Test
          </button>
        </div>
      ) : (
        <>
          {/* Passage 1 */}
          <div className="passage1">
            <Passage1
              fontSize={fontSize}
              onResultChange={(count) =>
                handlePassageResult("passage1", count)
              }
            />
          </div>

          {/* Passage 2 */}
          <div className="passage2">
            <Passage2
              fontSize={fontSize}
              onResultChange={(count) =>
                handlePassageResult("passage2", count)
              }
            />
          </div>

          {/* Passage 3 */}
          <div className="passage3">
            <Passage3
              fontSize={fontSize}
              onResultChange={(count) =>
                handlePassageResult("passage3", count)
              }
            />
          </div>

          {/* Manual Complete tugmasi */}
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button
              className="nav-button"
              onClick={handleFinalSubmit}
              disabled={testFinished}
            >
              Complete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reading;
