import { useState } from "react";
import type { QuizQuestion } from "../types/quiz";
import { speak } from "../lib/tts";
import SpeakerButton from "./SpeakerButton";

interface QuestionCardProps {
  question: QuizQuestion;
  speechLang: string;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
}

export default function QuestionCard({ question, speechLang, onAnswered, onNext }: QuestionCardProps) {
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [stagedOrder, setStagedOrder] = useState<number[]>([]);
  const [scrambleChecked, setScrambleChecked] = useState(false);
  const [scrambleCorrect, setScrambleCorrect] = useState(false);

  const answered = question.kind === "scramble" ? scrambleChecked : chosenIndex !== null;

  function chooseOption(index: number) {
    if (chosenIndex !== null) return;
    setChosenIndex(index);
    const correct =
      question.kind === "meaning-to-word" || question.kind === "listen-to-word"
        ? index === question.correctIndex
        : false;
    onAnswered(correct);
  }

  function toggleLetter(idx: number) {
    if (scrambleChecked || question.kind !== "scramble") return;
    if (stagedOrder.includes(idx)) {
      setStagedOrder(stagedOrder.filter((i) => i !== idx));
    } else {
      setStagedOrder([...stagedOrder, idx]);
    }
  }

  function checkScramble() {
    if (question.kind !== "scramble") return;
    const attempt = stagedOrder.map((i) => question.letters[i]).join("");
    const correct = attempt === question.answer;
    setScrambleChecked(true);
    setScrambleCorrect(correct);
    onAnswered(correct);
  }

  if (question.kind === "meaning-to-word") {
    return (
      <div className="question-card">
        <div className="question-prompt">"{question.prompt}" kelimesinin İngilizcesi nedir?</div>
        <div className="options-grid">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex;
            const isChosen = i === chosenIndex;
            const cls = answered
              ? isCorrect
                ? "option option--correct"
                : isChosen
                  ? "option option--wrong"
                  : "option"
              : "option";
            return (
              <button key={i} type="button" className={cls} onClick={() => chooseOption(i)}>
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <button type="button" className="btn btn--primary" onClick={onNext}>
            Devam Et
          </button>
        )}
      </div>
    );
  }

  if (question.kind === "listen-to-word") {
    return (
      <div className="question-card">
        <div className="question-prompt">Sesi dinle ve doğru kelimeyi seç</div>
        <div className="listen-speaker">
          <SpeakerButton text={question.speakText} langCode={speechLang} size="large" />
        </div>
        <div className="options-grid">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex;
            const isChosen = i === chosenIndex;
            const cls = answered
              ? isCorrect
                ? "option option--correct"
                : isChosen
                  ? "option option--wrong"
                  : "option"
              : "option";
            return (
              <button key={i} type="button" className={cls} onClick={() => chooseOption(i)}>
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <button type="button" className="btn btn--primary" onClick={onNext}>
            Devam Et
          </button>
        )}
      </div>
    );
  }

  // scramble
  const poolIndices = question.letters.map((_, i) => i).filter((i) => !stagedOrder.includes(i));

  return (
    <div className="question-card">
      <div className="question-prompt">
        Harfleri doğru sıraya diz: <strong>"{question.meaningHint}"</strong>
      </div>
      <button
        type="button"
        className="scramble-listen"
        onClick={() => speak(question.answer, speechLang)}
      >
        🔊 Sesi dinle
      </button>

      <div className={`scramble-answer ${scrambleChecked ? (scrambleCorrect ? "scramble-answer--correct" : "scramble-answer--wrong") : ""}`}>
        {stagedOrder.length === 0 && <span className="scramble-answer__placeholder">harflere dokun</span>}
        {stagedOrder.map((idx, pos) => (
          <button key={pos} type="button" className="letter-tile letter-tile--staged" onClick={() => toggleLetter(idx)}>
            {question.letters[idx]}
          </button>
        ))}
      </div>

      <div className="letter-pool">
        {poolIndices.map((idx) => (
          <button key={idx} type="button" className="letter-tile" onClick={() => toggleLetter(idx)}>
            {question.letters[idx]}
          </button>
        ))}
      </div>

      {scrambleChecked && !scrambleCorrect && (
        <div className="scramble-correction">Doğrusu: {question.answer}</div>
      )}

      {!scrambleChecked ? (
        <button
          type="button"
          className="btn btn--primary"
          disabled={stagedOrder.length !== question.letters.length}
          onClick={checkScramble}
        >
          Kontrol Et
        </button>
      ) : (
        <button type="button" className="btn btn--primary" onClick={onNext}>
          Devam Et
        </button>
      )}
    </div>
  );
}
