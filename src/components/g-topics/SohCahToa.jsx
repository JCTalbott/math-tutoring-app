import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [7, 24, 25],
];
const svgWidth = 400;
const svgHeight = 400;
const thetaOffset = 15.0;
const potentialQuestions = ['sin', 'cos', 'tan'];

function generateLineCoords(triple, width, height) {
  const [a, b, _] = triple;
  const x_padding = width * 0.1;
  const y_padding = height * 0.15;
  const smallerSideLength = width * 0.8 * (a / b);
  return [
    { x1: x_padding, y1: height - smallerSideLength, x2: x_padding, y2: height - y_padding }, // vertical
    { x1: x_padding, y1: height - y_padding, x2: width - x_padding, y2: height - y_padding }, // horizontal
    { x1: x_padding, y1: height - smallerSideLength, x2: width - x_padding, y2: height - y_padding }, // hypotenuse
  ];
}

function produceAnswer(func, thetaCorner, triple) {
  const indices = {
    sin: [1 ^ thetaCorner, 2],
    cos: [0 ^ thetaCorner, 2],
    tan: [1 ^ thetaCorner, 0 ^ thetaCorner],
  }[func];
  const [num, den] = indices.map((i) => triple[i]);
  return `${num}/${den}`;
}

export default function Geometry() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  const lineCoords = useMemo(() => {
    if (!currentQuestion?.triple) return null;
    return generateLineCoords(currentQuestion.triple, svgWidth, svgHeight);
  }, [currentQuestion?.triple]);

  useEffect(() => {
    generateNewQuestion();
  }, []);

  function generateNewQuestion() {
    const trigFunc = potentialQuestions[Math.floor(Math.random() * potentialQuestions.length)];
    const triple = TRIPLES[Math.floor(Math.random() * TRIPLES.length)];
    const thetaLocation = Math.floor(Math.random() * 2);
    const correctAnswer = produceAnswer(trigFunc, thetaLocation, triple);

    setCurrentQuestion({
      trigFunc,
      triple,
      thetaLocation,
      userAnswer: '',
      correctAnswer,
    });
    setShowResult(false);
  }

  function handleChange(e) {
    setCurrentQuestion((prev) => ({
      ...prev,
      userAnswer: e.target.value,
    }));
  }

  function handleSubmit() {
    if (!currentQuestion.userAnswer) return;
    setShowResult(true);
    setTotalQuestions((prev) => prev + 1);
    if (currentQuestion.userAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNext() {
    generateNewQuestion();
  }

  // Theta coordinates using angle bisector
  let thetaPos = null;
  if (currentQuestion && lineCoords) {
    // Determine corner lines based on thetaLocation
    const cornerLines = currentQuestion.thetaLocation === 0
      ? [lineCoords[0], lineCoords[1]] // top-left
      : [lineCoords[1], lineCoords[2]]; // bottom-right (adjust if needed)

    // Compute corner vertex
    const cx = cornerLines[0].x1 === cornerLines[1].x1 || cornerLines[0].x1 === cornerLines[1].x2
      ? cornerLines[0].x1
      : cornerLines[0].x2;
    const cy = cornerLines[0].y1 === cornerLines[1].y1 || cornerLines[0].y1 === cornerLines[1].y2
      ? cornerLines[0].y1
      : cornerLines[0].y2;

    // Vectors along edges
    const v1 = { x: cornerLines[0].x2 - cx, y: cornerLines[0].y2 - cy };
    const v2 = { x: cornerLines[1].x2 - cx, y: cornerLines[1].y2 - cy };

    // Normalize
    const len1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
    const len2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
    const n1 = { x: v1.x / len1, y: v1.y / len1 };
    const n2 = { x: v2.x / len2, y: v2.y / len2 };

    // Angle bisector
    const bx = n1.x + n2.x;
    const by = n1.y + n2.y;
    const blen = Math.sqrt(bx ** 2 + by ** 2);
    thetaPos = { x: cx + (bx / blen) * thetaOffset, y: cy + (by / blen) * thetaOffset };
  }

  return (
    <div className="geometry-container">
      <header className="section-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>SohCahToa Practice</h1>
        <div className="score">
          Score: {score}/{totalQuestions}
        </div>
      </header>

      <div className="geometry-content">
        <div className="diagram-container">
          <svg viewBox="0 0 400 400" className="geometry-diagram">
            {lineCoords?.map((line, i) => (
              <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="black" />
            ))}
            {thetaPos && (
              <text
                x={thetaPos.x}
                y={thetaPos.y}
                fontSize="16"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                θ
              </text>
            )}
          </svg>
        </div>

        {currentQuestion && (
          <div className="question-container">
            <h2>
              Find the {currentQuestion.trigFunc}(θ)
            </h2>
            <input
              value={currentQuestion.userAnswer}
              onChange={handleChange}
              placeholder="Your answer"
            />

            {!showResult ? (
              <button className="submit-button" onClick={handleSubmit} disabled={!currentQuestion.userAnswer}>
                Submit Answer
              </button>
            ) : (
              <div className="result-container">
                <div
                  className={`result ${
                    currentQuestion.userAnswer === currentQuestion.correctAnswer
                      ? 'correct'
                      : 'incorrect'
                  }`}
                >
                  {currentQuestion.userAnswer === currentQuestion.correctAnswer
                    ? '✅ Correct!'
                    : `❌ Incorrect! (Answer: ${currentQuestion.correctAnswer})`}
                </div>
                <button className="next-button" onClick={handleNext}>
                  Next Question
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
