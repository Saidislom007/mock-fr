import React from "react";

const instructions = {
  listening: {
    title: "Listening Instructions",
    content: [
      "You will hear four recordings. Each recording will be played once only.",
      "Answer all the questions as you listen.",
      "Write your answers on the answer sheet provided.",
      "Focus on spelling and grammar for written answers."
    ]
  },
  reading: {
    title: "Reading Instructions",
    content: [
      "You have 60 minutes to read the passages and answer the questions.",
      "Do not spend too much time on one question.",
      "All answers must be written on the answer sheet.",
      "Check your answers for spelling and grammar."
    ]
  },
  writing: {
    title: "Writing Instructions",
    content: [
      "You have 60 minutes for two writing tasks.",
      "Task 1: Describe visual information in at least 150 words.",
      "Task 2: Write an essay of at least 250 words.",
      "Pay attention to task achievement, coherence, grammar, and vocabulary."
    ]
  },
  speaking: {
    title: "Speaking Instructions",
    content: [
      "The speaking test is recorded and lasts 11-14 minutes.",
      "Part 1: Introduction and interview (4-5 mins).",
      "Part 2: Long turn — speak on a topic for 1-2 minutes.",
      "Part 3: Discussion with examiner on related topics."
    ]
  }
};

const InstructionPage = ({ section }) => {
  const sectionInstructions = instructions[section];

  if (!sectionInstructions) return <p>Section not found.</p>;

  return (
    <div className="instruction-page">
      <h1>{sectionInstructions.title}</h1>
      <ul>
        {sectionInstructions.content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default InstructionPage;
