import React, { useState } from "react";

const MultipleSelect = ({ question, onCorrectCountChange }) => {
  // 🔑 Correct answers normalize qilish
  const correctAnswers = Object.fromEntries(
    Object.entries(question.correct_answer || {}).map(([key, val]) => [
      key,
      val.trim().toLowerCase(),
    ])
  );

  const answerKeys = Object.keys(correctAnswers); // masalan: ["21","22","23"]
  const maxSelect = answerKeys.length; // nechta tanlash mumkin

  const [selected, setSelected] = useState([]); // foydalanuvchi tanlagan variantlar

  const handleToggle = (opt) => {
    let updated = [...selected];

    if (updated.includes(opt)) {
      // allaqachon bor bo‘lsa -> olib tashlash
      updated = updated.filter((o) => o !== opt);
    } else {
      if (updated.length < maxSelect) {
        updated.push(opt);
      }
    }

    setSelected(updated);

    if (onCorrectCountChange) {
      let score = 0;
      // ✅ Har bir tanlangan variantni tartib bo‘yicha tekshirish
      updated.forEach((ans, idx) => {
        const qNum = answerKeys[idx]; // 0->21, 1->22, ...
        if (qNum && ans.trim().toLowerCase() === correctAnswers[qNum]) {
          score++;
        }
      });

      onCorrectCountChange(score, question.question_number);
    }
  };

  return (
    <div className="mb-6 p-3">
      {question.instruction && (
        <p           style={{
            color: "black",
            marginBottom: 20,
            fontSize: 20,
            fontWeight: "bold",
          }}>{question.instruction}</p>
      )}

      {question.options.map((opt, i) => {
        const isSelected = selected.includes(opt);

        // rang chiqarish
        let bg = "";
        if (isSelected) {
          const index = selected.indexOf(opt);
          const qNum = answerKeys[index]; // index → qNum
          if (qNum && correctAnswers[qNum] === opt.trim().toLowerCase()) {
            bg = "transparent"; // to‘g‘ri yashil
          } else {
            bg = "transparent"; // noto‘g‘ri qizil
          }
        }

        return (
          <label
            key={i}
            className="block mb-2 cursor-pointer rounded-lg px-2 py-1"
            style={{ backgroundColor: bg }}
          >
            <input
              type="checkbox"
              value={opt}
              checked={isSelected}
              disabled={selected.length === maxSelect && !isSelected}
              onChange={() => handleToggle(opt)}
              className="mr-2"
            />
            {opt}
          </label>
        );
      })}
    </div>
  );
};

export default MultipleSelect;
