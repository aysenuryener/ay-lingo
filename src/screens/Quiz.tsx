import { useState } from "react";
import type { LoadedLanguage } from "../types/language";
import type { Profile } from "../types/profile";
import { buildQuiz, buildQuizFrom } from "../lib/quiz";
import { getProgress, recordAnswer } from "../lib/progressStore";
import QuestionCard from "../components/QuestionCard";

interface QuizProps {
  profile: Profile;
  language: LoadedLanguage;
  onBack: () => void;
}

interface AnsweredEntry {
  wordId: string;
  correct: boolean;
}

export default function Quiz({ profile, language, onBack }: QuizProps) {
  const [questions, setQuestions] = useState(() =>
    buildQuiz(language.words, getProgress(profile.id, language.meta.code), 10)
  );
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnsweredEntry[]>([]);
  const [finished, setFinished] = useState(false);

  const current = questions[index];

  function handleAnswered(correct: boolean) {
    recordAnswer(profile.id, language.meta.code, current.wordId, correct ? "correct" : "wrong");
    setAnswers((prev) => [...prev, { wordId: current.wordId, correct }]);
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  }

  function retryWrong(wrongIds: string[]) {
    const retryCount = Math.max(1, wrongIds.length);
    setQuestions(buildQuizFrom(language.words, wrongIds, retryCount));
    setAnswers([]);
    setIndex(0);
    setFinished(false);
  }

  function retryAll() {
    setQuestions(buildQuiz(language.words, getProgress(profile.id, language.meta.code), 10));
    setAnswers([]);
    setIndex(0);
    setFinished(false);
  }

  if (finished) {
    const correctCount = answers.filter((a) => a.correct).length;
    const wrongIds = answers.filter((a) => !a.correct).map((a) => a.wordId);
    const wrongWords = language.words.filter((w) => wrongIds.includes(w.id));

    return (
      <div className="screen">
        <div className="screen-header">
          <button type="button" className="back-button" onClick={onBack} aria-label="Geri">
            ←
          </button>
          <h2>Quiz Sonucu</h2>
        </div>

        <div className="quiz-score">
          {correctCount} / {answers.length}
        </div>

        {wrongWords.length > 0 ? (
          <>
            <p className="subtitle">Yanlış yaptıkların:</p>
            <ul className="wrong-list">
              {wrongWords.map((w) => (
                <li key={w.id}>
                  <strong>{w.word}</strong> — {w.meaning}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn--primary" onClick={() => retryWrong(wrongIds)}>
              Yanlışları Tekrar Et
            </button>
          </>
        ) : (
          <p className="subtitle">Hepsi doğru! 🎉</p>
        )}

        <button type="button" className="btn btn--ghost" onClick={retryAll}>
          Yeni Quiz Başlat
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button type="button" className="back-button" onClick={onBack} aria-label="Geri">
          ←
        </button>
        <h2>Quiz</h2>
        <span className="quiz-progress">
          {index + 1} / {questions.length}
        </span>
      </div>

      <QuestionCard
        key={`${current.wordId}-${current.kind}-${index}`}
        question={current}
        speechLang={language.meta.speechLang}
        onAnswered={handleAnswered}
        onNext={handleNext}
      />
    </div>
  );
}
