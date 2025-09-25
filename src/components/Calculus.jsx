import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DERIVATIVE_RULES = {
  'power': 'Power Rule: d/dx[x^n] = nx^(n-1)',
  'chain': 'Chain Rule: d/dx[f(g(x))] = f\'(g(x)) · g\'(x)',
  'product': 'Product Rule: d/dx[f(x)·g(x)] = f\'(x)·g(x) + f(x)·g\'(x)',
  'quotient': 'Quotient Rule: d/dx[f(x)/g(x)] = [f\'(x)·g(x) - f(x)·g\'(x)] / [g(x)]²',
  'constant': 'Constant Rule: d/dx[c] = 0',
  'sum': 'Sum Rule: d/dx[f(x) + g(x)] = f\'(x) + g\'(x)',
  'ln': 'Natural Log: d/dx[ln(x)] = 1/x',
  'sin': 'Sine: d/dx[sin(x)] = cos(x)',
  'cos': 'Cosine: d/dx[cos(x)] = -sin(x)',
  'exp': 'Exponential: d/dx[e^x] = e^x'
};

const PROBLEMS = [
  {
    function: 'x³',
    derivative: '3x²',
    rule: 'power',
    explanation: 'Using the power rule: d/dx[x³] = 3x²'
  },
  {
    function: 'sin(x)',
    derivative: 'cos(x)',
    rule: 'sin',
    explanation: 'The derivative of sin(x) is cos(x)'
  },
  {
    function: 'ln(x)',
    derivative: '1/x',
    rule: 'ln',
    explanation: 'The derivative of ln(x) is 1/x'
  },
  {
    function: 'cos(x)',
    derivative: '-sin(x)',
    rule: 'cos',
    explanation: 'The derivative of cos(x) is -sin(x)'
  },
  {
    function: 'e^x',
    derivative: 'e^x',
    rule: 'exp',
    explanation: 'The derivative of e^x is e^x'
  },
  {
    function: '(x + 2)(x - 1)',
    derivative: '2x + 1',
    rule: 'product',
    explanation: 'Using the product rule: d/dx[(x+2)(x-1)] = 1·(x-1) + (x+2)·1 = x-1+x+2 = 2x+1'
  },
  {
    function: 'sin(x²)',
    derivative: '2x·cos(x²)',
    rule: 'chain',
    explanation: 'Using the chain rule: d/dx[sin(x²)] = cos(x²) · 2x = 2x·cos(x²)'
  },
  {
    function: 'x²/(x + 1)',
    derivative: '(2x(x+1) - x²) / (x+1)²',
    rule: 'quotient',
    explanation: 'Using the quotient rule: d/dx[x²/(x+1)] = [2x(x+1) - x²] / (x+1)²'
  },
  {
    function: 'x⁴',
    derivative: '4x³',
    rule: 'power',
    explanation: 'Using the power rule: d/dx[x⁴] = 4x³'
  },
  {
    function: 'ln(x²)',
    derivative: '2/x',
    rule: 'chain',
    explanation: 'Using the chain rule: d/dx[ln(x²)] = (1/x²) · 2x = 2x/x² = 2/x'
  }
];

export default function Calculus() {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [selectedRule, setSelectedRule] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    generateNewProblem();
  }, []);

  function generateNewProblem() {
    const problem = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    setCurrentProblem(problem);
    setSelectedRule('');
    setShowResult(false);
  }

  function handleRuleSelect(rule) {
    if (showResult) return;
    setSelectedRule(rule);
  }

  function handleSubmit() {
    if (!selectedRule) return;
    
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    
    if (selectedRule === currentProblem.rule) {
      setScore(prev => prev + 1);
    }
  }

  function handleNext() {
    generateNewProblem();
  }

  // Generate wrong answers (other rules that could apply)
  function getAvailableRules() {
    if (!currentProblem) return [];
    
    const allRules = Object.keys(DERIVATIVE_RULES);
    const wrongRules = allRules.filter(rule => rule !== currentProblem.rule);
    
    // Randomly select 2 wrong answers
    const shuffled = wrongRules.sort(() => Math.random() - 0.5);
    const selectedWrong = shuffled.slice(0, 2);
    
    return [currentProblem.rule, ...selectedWrong].sort(() => Math.random() - 0.5);
  }

  return (
    <div className="calculus-container">
      <header className="section-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Calculus Practice</h1>
        <div className="score">
          Score: {score}/{totalQuestions}
        </div>
      </header>

      <div className="calculus-content">
        {currentProblem && (
          <div className="problem-container">
            <div className="function-display">
              <h2>Find the derivative of:</h2>
              <div className="function-box">
                f(x) = {currentProblem.function}
              </div>
            </div>

            <div className="question">
              <h3>Which rule should you use to find the derivative?</h3>
            </div>

            <div className="rules-grid">
              {getAvailableRules().map((rule, index) => (
                <button
                  key={index}
                  className={`rule-button ${
                    selectedRule === rule ? 'selected' : ''
                  } ${
                    showResult 
                      ? rule === currentProblem.rule 
                        ? 'correct' 
                        : selectedRule === rule 
                          ? 'incorrect' 
                          : ''
                      : ''
                  }`}
                  onClick={() => handleRuleSelect(rule)}
                >
                  <div className="rule-name">{DERIVATIVE_RULES[rule].split(':')[0]}</div>
                  <div className="rule-formula">{DERIVATIVE_RULES[rule].split(':')[1]}</div>
                </button>
              ))}
            </div>

            {!showResult ? (
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={!selectedRule}
              >
                Submit Answer
              </button>
            ) : (
              <div className="result-container">
                <div className={`result ${selectedRule === currentProblem.rule ? 'correct' : 'incorrect'}`}>
                  {selectedRule === currentProblem.rule ? '✅ Correct!' : '❌ Incorrect!'}
                </div>
                
                <div className="solution">
                  <h4>Solution:</h4>
                  <div className="derivative-display">
                    f'(x) = {currentProblem.derivative}
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

        <div className="rules-reference">
          <h3>Derivative Rules Reference</h3>
          <div className="rules-list">
            {Object.entries(DERIVATIVE_RULES).map(([key, rule]) => (
              <div key={key} className="rule-item">
                <strong>{rule.split(':')[0]}:</strong> {rule.split(':')[1]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
