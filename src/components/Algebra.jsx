import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Generate polynomial multiplication problems
function generatePolynomialProblem() {
  const coefficients1 = [1, 2, 3, -1, -2, -3];
  const coefficients2 = [1, 2, 3, -1, -2, -3];
  const constants1 = [0, 1, 2, 3, -1, -2, -3];
  const constants2 = [0, 1, 2, 3, -1, -2, -3];
  
  const a = coefficients1[Math.floor(Math.random() * coefficients1.length)];
  const b = constants1[Math.floor(Math.random() * constants1.length)];
  const c = coefficients2[Math.floor(Math.random() * coefficients2.length)];
  const d = constants2[Math.floor(Math.random() * constants2.length)];
  
  // Create the problem
  const factor1 = formatFactor(a, b);
  const factor2 = formatFactor(c, d);
  
  // Calculate the answer
  const answer = multiplyPolynomials(a, b, c, d);
  
  return {
    factor1,
    factor2,
    answer,
    explanation: getExplanation(a, b, c, d)
  };
}

function formatFactor(coefficient, constant) {
  if (coefficient === 0) return constant.toString();
  if (constant === 0) return coefficient === 1 ? 'x' : coefficient === -1 ? '-x' : `${coefficient}x`;
  
  const xPart = coefficient === 1 ? 'x' : coefficient === -1 ? '-x' : `${coefficient}x`;
  const sign = constant >= 0 ? '+' : '';
  return `(${xPart}${sign}${constant})`;
}

function multiplyPolynomials(a, b, c, d) {
  // (ax + b)(cx + d) = acx² + (ad + bc)x + bd
  const xSquared = a * c;
  const x = a * d + b * c;
  const constant = b * d;
  
  return formatAnswer(xSquared, x, constant);
}

function formatAnswer(xSquared, x, constant) {
  let result = '';
  
  // x² term
  if (xSquared !== 0) {
    if (xSquared === 1) result += 'x²';
    else if (xSquared === -1) result += '-x²';
    else result += `${xSquared}x²`;
  }
  
  // x term
  if (x !== 0) {
    if (result && x > 0) result += ' + ';
    else if (result && x < 0) result += ' - ';
    else if (x < 0) result += '-';
    
    const absX = Math.abs(x);
    if (absX === 1) result += 'x';
    else result += `${absX}x`;
  }
  
  // constant term
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

export default function Algebra() {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    generateNewProblem();
  }, []);

  function generateNewProblem() {
    const problem = generatePolynomialProblem();
    setCurrentProblem(problem);
    setUserAnswer('');
    setShowResult(false);
  }

  function handleSubmit() {
    if (!userAnswer.trim()) return;
    
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    
    // Normalize the answer for comparison
    const normalizedUserAnswer = userAnswer.replace(/\s+/g, '').toLowerCase();
    const normalizedCorrectAnswer = currentProblem.answer.replace(/\s+/g, '').toLowerCase();
    
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      setScore(prev => prev + 1);
    }
  }

  function handleNext() {
    generateNewProblem();
  }

  function handleAnswerChange(e) {
    setUserAnswer(e.target.value);
  }

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

            <div className="input-section">
              <label htmlFor="answer-input">Your answer:</label>
              <input
                id="answer-input"
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Enter your answer (e.g., x² + 3x + 2)"
                className="answer-input"
                disabled={showResult}
              />
            </div>

            {!showResult ? (
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
              >
                Submit Answer
              </button>
            ) : (
              <div className="result-container">
                <div className={`result ${userAnswer.replace(/\s+/g, '').toLowerCase() === currentProblem.answer.replace(/\s+/g, '').toLowerCase() ? 'correct' : 'incorrect'}`}>
                  {userAnswer.replace(/\s+/g, '').toLowerCase() === currentProblem.answer.replace(/\s+/g, '').toLowerCase() ? '✅ Correct!' : '❌ Incorrect!'}
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
