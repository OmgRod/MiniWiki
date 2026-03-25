import { useMemo, useState } from 'react';

const DEFAULT_QUESTIONS = [
  {
    type: 'mcq',
    prompt: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter'],
    correctIndex: 1,
    explanation: 'Mars is the Red Planet due to iron oxide-rich dust.',
  },
  {
    type: 'mcq',
    prompt: 'What does HTTP stand for?',
    options: ['HyperText Transfer Protocol', 'HighText Transit Process', 'Hyper Transfer Text Program'],
    correctIndex: 0,
    explanation: 'HTTP means HyperText Transfer Protocol.',
  },
  {
    type: 'input',
    prompt: 'What is the chemical symbol for gold?',
    answer: 'Au',
    answers: ['au'],
    explanation: 'Gold is represented by Au.',
  },
  {
    type: 'input',
    prompt: 'How many continents are there on Earth?',
    answer: '7',
    answers: ['seven'],
    explanation: 'The standard count is seven continents.',
  },
  {
    type: 'matching',
    prompt: 'Match each scientist to their contribution.',
    pairs: [
      { left: 'Isaac Newton', right: 'Laws of motion' },
      { left: 'Marie Curie', right: 'Radioactivity research' },
      { left: 'Alan Turing', right: 'Foundations of computing' },
    ],
    explanation: 'These are canonical pairings in science and computing history.',
  },
];

function normalizeQuestions(questions = []) {
  const source = Array.isArray(questions) && questions.length > 0 ? questions : DEFAULT_QUESTIONS;

  return source.map((question, index) => ({
    id: question?.id || `q-${index + 1}`,
    type: question?.type || 'mcq',
    prompt: question?.prompt || `Question ${index + 1}`,
    options: Array.isArray(question?.options) ? question.options : [],
    correctIndex:
      Number.isInteger(question?.correctIndex) && question.correctIndex >= 0
        ? question.correctIndex
        : 0,
    answer: typeof question?.answer === 'string' ? question.answer : '',
    answers: Array.isArray(question?.answers) ? question.answers : [],
    caseSensitive: question?.caseSensitive === true,
    pairs: Array.isArray(question?.pairs) ? question.pairs : [],
    explanation: question?.explanation || '',
  }));
}

function normalizeInput(value = '', caseSensitive = false) {
  const normalized = String(value || '').trim();
  return caseSensitive ? normalized : normalized.toLowerCase();
}

function isQuestionAnswered(question, answer) {
  if (question.type === 'input') {
    return typeof answer === 'string' && answer.trim().length > 0;
  }

  if (question.type === 'matching') {
    if (!answer || typeof answer !== 'object') {
      return false;
    }

    return question.pairs.every((pair) => {
      const left = String(pair?.left || '');
      return typeof answer[left] === 'string' && answer[left].trim().length > 0;
    });
  }

  return Number.isInteger(answer);
}

function isQuestionCorrect(question, answer) {
  if (question.type === 'input') {
    if (typeof answer !== 'string') {
      return false;
    }

    const accepted = [question.answer, ...question.answers]
      .filter((value) => typeof value === 'string' && value.trim().length > 0)
      .map((value) => normalizeInput(value, question.caseSensitive));

    const normalizedAnswer = normalizeInput(answer, question.caseSensitive);
    return accepted.includes(normalizedAnswer);
  }

  if (question.type === 'matching') {
    if (!answer || typeof answer !== 'object') {
      return false;
    }

    return question.pairs.every((pair) => {
      const left = String(pair?.left || '');
      const expected = String(pair?.right || '').trim();
      return String(answer[left] || '').trim() === expected;
    });
  }

  return answer === question.correctIndex;
}

export default function Quiz({
  questions = [],
  showScore = true,
  className = '',
}) {
  const parsedQuestions = useMemo(() => normalizeQuestions(questions), [questions]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = parsedQuestions.length;
  const score = parsedQuestions.reduce((count, question) => {
    if (isQuestionCorrect(question, answers[question.id])) {
      return count + 1;
    }

    return count;
  }, 0);

  function updateAnswer(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function updateInputAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function updateMatchingAnswer(questionId, left, value) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [left]: value,
      },
    }));
  }

  return (
    <div className={`my-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40 ${className}`}>
      <div className="space-y-5">
        {parsedQuestions.map((question, questionIndex) => {
          const answer = answers[question.id];
          const isAnswered = isQuestionAnswered(question, answer);
          const isCorrect = isAnswered && isQuestionCorrect(question, answer);

          const matchingOptions =
            question.type === 'matching'
              ? question.options.length
                ? question.options
                : question.pairs.map((pair) => pair.right)
              : [];

          return (
            <section key={question.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {questionIndex + 1}. {question.prompt}
              </p>

              {question.type === 'input' ? (
                <input
                  type="text"
                  value={typeof answer === 'string' ? answer : ''}
                  onChange={(event) => updateInputAnswer(question.id, event.target.value)}
                  placeholder="Type your answer..."
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              ) : null}

              {question.type === 'matching' ? (
                <div className="space-y-2">
                  {question.pairs.map((pair, pairIndex) => {
                    const left = String(pair?.left || `Item ${pairIndex + 1}`);
                    const selectedValue = answer?.[left] || '';

                    return (
                      <div key={`${question.id}-pair-${pairIndex}`} className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                        <span className="rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                          {left}
                        </span>
                        <span className="hidden text-xs text-slate-400 sm:inline">→</span>
                        <select
                          value={selectedValue}
                          onChange={(event) => updateMatchingAnswer(question.id, left, event.target.value)}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                        >
                          <option value="">Select match...</option>
                          {matchingOptions.map((option, optionIndex) => (
                            <option key={`${question.id}-match-opt-${optionIndex}`} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {question.type === 'mcq' ? (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const chosen = answer === optionIndex;

                    return (
                      <label
                        key={`${question.id}-${optionIndex}`}
                        className={`flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition ${
                          chosen
                            ? 'border-blue-400 bg-blue-50 text-blue-900 dark:border-blue-600 dark:bg-blue-950/30 dark:text-blue-100'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900'
                        }`}
                      >
                        <input
                          type="radio"
                          className="h-3.5 w-3.5"
                          name={`quiz-${question.id}`}
                          checked={chosen}
                          onChange={() => updateAnswer(question.id, optionIndex)}
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              ) : null}

              {submitted && isAnswered ? (
                <p className={`mt-2 text-xs ${isCorrect ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                  {isCorrect ? 'Correct.' : 'Not quite.'}
                  {question.explanation ? ` ${question.explanation}` : ''}
                </p>
              ) : null}
            </section>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Check answers
        </button>

        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setSubmitted(false);
          }}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Reset
        </button>

        {submitted && showScore ? (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Score: {score}/{total}
          </span>
        ) : null}
      </div>
    </div>
  );
}
