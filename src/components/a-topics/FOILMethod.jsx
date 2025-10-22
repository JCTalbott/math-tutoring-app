import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './FOILMethod.module.css';


function generatePolynomialProblem() {
  const range = (n) => Array.from({ length: n }, (_, i) => i + 1);
  const coefficients = [0, ...range(3).flatMap(n => [-n, n])];
  const constants = [0, ...range(5).flatMap(n => [-n, n])];

  const a = coefficients[Math.floor(Math.random() * coefficients.length)];
  const b = constants[Math.floor(Math.random() * constants.length)];
  const c = coefficients[Math.floor(Math.random() * coefficients.length)];
  const d = constants[Math.floor(Math.random() * constants.length)];
  const factor1 = formatFactor(a, b);
  const factor2 = formatFactor(c, d);
  const answer = multiplyPolynomials(a, b, c, d);
  return {
    factor1,
    factor2,
    answer,
    coeffAnswers: [a*c, a*d+b*c, b*d],
    explanation: getExplanation(a, b, c, d)
  };
}

function formatFactor(coefficient, constant) {
  if (coefficient === 0) return constant.toString();
  if (constant === 0) return coefficient === 1 ? 'x' : coefficient === -1 ? '-x' : `${coefficient}x`;
  const xPart = coefficient === 1 ? 'x' : coefficient === -1 ? '-x' : `${coefficient}x`;
  const sign = constant > 0 ? '+' : '';
  return `(${xPart}${sign}${constant})`;
}

function multiplyPolynomials(a, b, c, d) {
  const xSquared = a * c;
  const x = a * d + b * c;
  const constant = b * d;
  return formatAnswer(xSquared, x, constant);
}

function formatAnswer(xSquared, x, constant) {
  let result = '';
  if (xSquared !== 0) {
    if (xSquared === 1) result += 'x²';
    else if (xSquared === -1) result += '-x²';
    else result += `${xSquared}x²`;
  }
  if (x !== 0) {
    if (result && x > 0) result += ' + ';
    else if (result && x < 0) result += ' - ';
    else if (x < 0) result += '-';
    
    const absX = Math.abs(x);
    if (absX === 1) result += 'x';
    else result += `${absX}x`;
  }
  if (constant !== 0) {
    if (result && constant > 0) result += ' + ';
    else if (result && constant < 0) result += ' - ';
    else if (constant < 0) result += '-';
    
    result += Math.abs(constant).toString();
  }

  return result || '0';
}

function getExplanation(a, b, c, d) {
  return `Using the FOIL method: (${a}x + ${b})(${c}x + ${d}) = ${a * c}x² + (${a * d} + ${b * c})x + ${b * d} = ${multiplyPolynomials(a, b, c, d)}`;
}

export default function FOILMethod() {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState(["", "", ""]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    generateNewProblem();
  }, []);

  function generateNewProblem() {
    const problem = generatePolynomialProblem();
    console.log(problem.coeffAnswers)
    setCurrentProblem(problem);
    setUserAnswer(["", "", ""]);
    setShowResult(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowResult(true);
    setTotalQuestions(prev => prev + 1);

    const numericAnswer = userAnswer.map(val => Number(val));
    const isCorrect = numericAnswer.every(
      (val, i) => val === currentProblem.coeffAnswers[i]
    );
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  }

  function handleNext() {
    generateNewProblem();
  }

  const handleChange = (index, value) => {
    const updated = [...userAnswer];
    updated[index] = value;
    setUserAnswer(updated);
  };

  return (
    <div className="algebra-container">
      <header className="section-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Algebra Practice</h1>
        <div className="score">
          Score: {score}/{totalQuestions}
        </div>
      </header>

      <div className="algebra-content">
        {currentProblem && (
          <div className="problem-container">
            <div className="problem-display">
              <h2>Multiply the following polynomials:</h2>
              <div className="polynomial-box">
                {currentProblem.factor1} × {currentProblem.factor2}
              </div>
            </div>

            <div className={styles.equation}>
              <label>
                <input
                  type="number"
                  className={styles.coefInput}
                  placeholder="a"
                  max={999}
                  value={userAnswer[0]}
                  onChange={(e) => handleChange(0, e.target.value)}
                /> x² + 
              </label>

              <label>
                <input
                  type="number"
                  className={styles.coefInput}
                  placeholder="b"
                  max={999}
                  value={userAnswer[1]}
                  onChange={(e) => handleChange(1, e.target.value)}
                /> x +
              </label>

              <label>
                <input
                  type="number"
                  className={styles.coefInput}
                  placeholder="c"
                  max={999}
                  value={userAnswer[2]}
                  onChange={(e) => handleChange(2, e.target.value)}
                />
              </label>
            </div>


            {!showResult ? (
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={userAnswer.some(val => isNaN(Number(val)) || val.trim() === "")}
              >
                Submit Answer
              </button>
            ) : (
              <div className="result-container">
                <div
                  className={`result ${
                    userAnswer.map(Number).every((val, i) => val === currentProblem.coeffAnswers[i]) ? "correct" : "incorrect"
                  }`}
                >
                  {userAnswer.map(Number).every((val, i) => val === currentProblem.coeffAnswers[i]) ? "✅ Correct!" : "❌ Incorrect!"}
                </div>
                
                <div className="solution">
                  <h4>Correct Answer:</h4>
                  <div className="correct-answer">
                    {currentProblem.answer}
                  </div>
                  <p className="explanation">{currentProblem.explanation}</p>
                </div>

                <button className="next-button" onClick={handleNext}>
                  Next Problem
                </button>
              </div>
            )}
          </div>
        )}

        <div className="foil-reference">
          <h3>FOIL Method Reference</h3>
          <div className="foil-explanation">
            <p><strong>FOIL</strong> stands for:</p>
            <ul>
              <li><strong>F</strong>irst: Multiply the first terms in each binomial</li>
              <li><strong>O</strong>uter: Multiply the outer terms</li>
              <li><strong>I</strong>nner: Multiply the inner terms</li>
              <li><strong>L</strong>ast: Multiply the last terms</li>
            </ul>
            <div className="foil-example">
              <strong>Example:</strong> (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
