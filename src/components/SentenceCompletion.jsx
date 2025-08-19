import { useState, useEffect, useMemo } from "react";

const SentenceCompletion = ({
  number,
  questionText,
  instruction,
  question,
  submitted = false,
  userAnswer = "",
  correctAnswer,
  onChange,
  onCorrectCountChange,
}) => {
  const [userValues, setUserValues] = useState({});

  const handleChange = (blankNum, value) => {
    const updated = { ...userValues, [blankNum]: value };
    setUserValues(updated);
    if (onChange) onChange(number, blankNum, value);
  };

  // ✅ Har doim qaysi blanklar to‘g‘ri ekanligini hisoblaymiz
  const correctMap = useMemo(() => {
    const map = {};

    // correctAnswer ni har doim massivga aylantiramiz
    const correctAnswersArray = Array.isArray(correctAnswer)
      ? correctAnswer
      : [correctAnswer];

    // hammasini trim + lowercase qilamiz
    const normalizedAnswers = correctAnswersArray.map((ans) =>
      (ans || "").toString().trim().toLowerCase()
    );

    const blanks = [...questionText.matchAll(/\[\[(\d+)\]\]/g)];
    blanks.forEach((match) => {
      const blankNum = match[1];
      const userAnsNorm = (userValues[blankNum] || "")
        .toString()
        .trim()
        .toLowerCase();

      // foydalanuvchi javobi massivdagi istalgan biriga mos bo‘lsa to‘g‘ri
      map[blankNum] = normalizedAnswers.includes(userAnsNorm);
    });

    return map;
  }, [userValues, correctAnswer, questionText]);

  // 📤 Har safar correctMap o‘zgarsa, umumiy hisobni yuboramiz
  useEffect(() => {
    if (onCorrectCountChange) {
      const correctCount = Object.values(correctMap).filter(Boolean).length;
      onCorrectCountChange(correctCount, number); // qNum ham yuborilyapti
    }
  }, [correctMap, number, onCorrectCountChange]);

  const parts = questionText.split(/(\[\[\d+\]\])/g);

  return (
    <div className="instruction">
      {instruction && (
        <p
          style={{
            color: "black",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {instruction}
        </p>
      )}

      <div
        className="sentence-completion"
        style={{
          border: "1px solid #ccc",
          padding: 15,
          borderRadius: 8,
          backgroundColor: "#f9f9f9",
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: 0 }}>
          {parts.map((part, idx) => {
            const match = part.match(/\[\[(\d+)\]\]/);
            if (match) {
              const blankNum = match[1];
              const isTrue = correctMap[blankNum] === true;
              const hasValue = userValues[blankNum]?.length > 0;

              return (
                <input
                  key={blankNum}
                  type="text"
                  placeholder={`Q${blankNum}`}
                  className="border border-gray-300 p-1 mx-1 rounded"
                  value={userValues[blankNum] || ""}
                  disabled={submitted} // submit bo‘lsa yozishni to‘xtatamiz
                  autoComplete="off"
                  onChange={(e) => handleChange(blankNum, e.target.value)}
                  style={{
                    borderColor:
                      submitted && hasValue
                        ? isTrue
                          ? "green"
                          : "red"
                        : undefined,
                    backgroundColor:
                      submitted && isTrue ? "#d4edda" : undefined,
                  }}
                />
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </p>
      </div>
    </div>
  );
};

export default SentenceCompletion;
