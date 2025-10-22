import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TRANSFORMATION_TYPES = {
  'reflection_x': 'Reflection over x-axis',
  'reflection_y': 'Reflection over y-axis', 
  'reflection_yx': 'Reflection over y = x',
  'reflection_ynx': 'Reflection over y = -x',
  'rotation_90_cw': 'Rotation 90° clockwise',
  'rotation_90_ccw': 'Rotation 90° counter-clockwise',
  'rotation_180': 'Rotation 180°',
  'rotation_270_cw': 'Rotation 270° clockwise',
  'rotation_270_ccw': 'Rotation 270° counter-clockwise',
  'translation': 'Translation'
};

function generateTransformationProblem() {
  // Generate a random point A within reasonable bounds (-5 to 5)
  const x = Math.floor(Math.random() * 13) - 6; // -5 to 5
  const y = Math.floor(Math.random() * 9) - 4; // -5 to 5
  
  // Avoid origin to make problems more interesting
  if (x === 0 && y === 0) {
    return generateTransformationProblem();
  }
  
  const pointA = { x, y };
  
  // Select a random transformation type
  const transformationTypes = Object.keys(TRANSFORMATION_TYPES);
  const transformationType = transformationTypes[Math.floor(Math.random() * transformationTypes.length)];
  
  let transformedPoint;
  let explanation;
  
  switch (transformationType) {
    case 'reflection_x':
      transformedPoint = { x: x, y: -y };
      explanation = `Reflection over x-axis: (x, y) → (x, -y). So (${x}, ${y}) → (${x}, ${-y})`;
      break;
      
    case 'reflection_y':
      transformedPoint = { x: -x, y: y };
      explanation = `Reflection over y-axis: (x, y) → (-x, y). So (${x}, ${y}) → (${-x}, ${y})`;
      break;
      
    case 'reflection_yx':
      transformedPoint = { x: y, y: x };
      explanation = `Reflection over y = x: (x, y) → (y, x). So (${x}, ${y}) → (${y}, ${x})`;
      break;
      
    case 'reflection_ynx':
      transformedPoint = { x: -y, y: -x };
      explanation = `Reflection over y = -x: (x, y) → (-y, -x). So (${x}, ${y}) → (${-y}, ${-x})`;
      break;
      
    case 'rotation_90_cw':
      transformedPoint = { x: y, y: -x };
      explanation = `Rotation 90° clockwise: (x, y) → (y, -x). So (${x}, ${y}) → (${y}, ${-x})`;
      break;
      
    case 'rotation_90_ccw':
      transformedPoint = { x: -y, y: x };
      explanation = `Rotation 90° counter-clockwise: (x, y) → (-y, x). So (${x}, ${y}) → (${-y}, ${x})`;
      break;
      
    case 'rotation_180':
      transformedPoint = { x: -x, y: -y };
      explanation = `Rotation 180°: (x, y) → (-x, -y). So (${x}, ${y}) → (${-x}, ${-y})`;
      break;
      
    case 'rotation_270_cw':
      transformedPoint = { x: -y, y: x };
      explanation = `Rotation 270° clockwise: (x, y) → (-y, x). So (${x}, ${y}) → (${-y}, ${x})`;
      break;
      
    case 'rotation_270_ccw':
      transformedPoint = { x: y, y: -x };
      explanation = `Rotation 270° counter-clockwise: (x, y) → (y, -x). So (${x}, ${y}) → (${y}, ${-x})`;
      break;
      
    case 'translation':
      const dx = Math.floor(Math.random() * 6) - 3; // -3 to 2
      const dy = Math.floor(Math.random() * 6) - 3; // -3 to 2
      transformedPoint = { x: x + dx, y: y + dy };
      explanation = `Translation by (${dx}, ${dy}): (x, y) → (x + ${dx}, y + ${dy}). So (${x}, ${y}) → (${x + dx}, ${y + dy})`;
      break;
      
    default:
      transformedPoint = { x: x, y: y };
      explanation = '';
  }
  
  return {
    pointA,
    transformationType,
    transformedPoint,
    explanation,
    transformationName: TRANSFORMATION_TYPES[transformationType]
  };
}

export default function GeometricTransformations() {
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState({ x: '', y: '' });
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [recentAnswers, setRecentAnswers] = useState([]); // Track last 4 answers
  const [transformationMastery, setTransformationMastery] = useState({}); // Track mastery per transformation
  const [showHint, setShowHint] = useState(false);
  const [hintContent, setHintContent] = useState('');
  const [showGridNumbers, setShowGridNumbers] = useState(true);
  const [showPointLabel, setShowPointLabel] = useState(true);
  const [hiddenRules, setHiddenRules] = useState(new Set());
  const [showPlaceholders, setShowPlaceholders] = useState({ x: true, y: true });
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const xInputRef = useRef(null);

  useEffect(() => {
    generateNewProblem();
  }, []);

  function generateNewProblem() {
    const problem = generateTransformationProblem();
    setCurrentProblem(problem);
    setUserAnswer({ x: '', y: '' });
    setShowResult(false);
    setShowPlaceholders({ x: true, y: true });
    
    // Focus the x input after a short delay to ensure the component has rendered
    setTimeout(() => {
      if (xInputRef.current) {
        xInputRef.current.focus();
      }
    }, 100);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowResult(true);
    setTotalQuestions(prev => prev + 1);

    const userX = Number(userAnswer.x);
    const userY = Number(userAnswer.y);
    const isCorrect = userX === currentProblem.transformedPoint.x && 
                     userY === currentProblem.transformedPoint.y;
    
    // Update recent answers (keep last 4)
    const newRecentAnswers = [...recentAnswers, isCorrect].slice(-4);
    setRecentAnswers(newRecentAnswers);
    
    // Check if user should lose grid assistance (3 of last 4 correct)
    if (newRecentAnswers.length >= 4) {
      const correctCount = newRecentAnswers.filter(answer => answer).length;
      if (correctCount >= 3 && showGridNumbers) {
        setShowGridNumbers(false);
        setShowPointLabel(false);
      }
    }
    
    // Track transformation mastery
    if (isCorrect) {
      setScore(prev => prev + 1);
      
      const transformationType = currentProblem.transformationType;
      const currentCount = transformationMastery[transformationType] || 0;
      const newCount = currentCount + 1;
      
      setTransformationMastery(prev => ({
        ...prev,
        [transformationType]: newCount
      }));
      
      // Hide rule after 3 correct answers for this transformation
      if (newCount >= 3 && !hiddenRules.has(transformationType)) {
        setHiddenRules(prev => new Set([...prev, transformationType]));
      }
    }
  }

  function handleNext() {
    generateNewProblem();
  }

  const handleChange = (field, value) => {
    setUserAnswer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFocus = (field) => {
    setShowPlaceholders(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleBlur = (field) => {
    if (!userAnswer[field]) {
      setShowPlaceholders(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  // Convert coordinate to SVG position (center at 200, 150)
  const coordToSVG = (x, y) => ({
    x: 200 + x * 27.27, // Adjusted for -5 to 5 range (300px / 11 units)
    y: 150 - y * 27.27  // Flip y-axis for SVG
  });

  // Show hint for mastered transformations
  const showTransformationHint = () => {
    if (hiddenRules.has(currentProblem.transformationType)) {
      const ruleText = getTransformationRule(currentProblem.transformationType);
      setHintContent(ruleText);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000); // Hide after 3 seconds
    }
  };

  // Get transformation rule text
  const getTransformationRule = (type) => {
    const rules = {
      'reflection_x': '(x, y) → (x, -y)',
      'reflection_y': '(x, y) → (-x, y)',
      'reflection_yx': '(x, y) → (y, x)',
      'reflection_ynx': '(x, y) → (-y, -x)',
      'rotation_90_cw': '(x, y) → (y, -x)',
      'rotation_90_ccw': '(x, y) → (-y, x)',
      'rotation_180': '(x, y) → (-x, -y)',
      'rotation_270_cw': '(x, y) → (-y, x)',
      'rotation_270_ccw': '(x, y) → (y, -x)',
      'translation': 'Translation by (a, b): (x, y) → (x + a, y + b)'
    };
    return rules[type] || '';
  };

  return (
    <div className="geometry-container">
      <header className="section-header">
        <button onClick={() => navigate('/geometry')} className="back-button">
          ← Back to List
        </button>
        <h1>Geometric Transformations</h1>
        <div className="score">
          Score: {score}/{totalQuestions}
        </div>
      </header>

      <div className="geometry-content">
        {currentProblem && (
          <div className="problem-container">
            <div className="diagram-container">
              <svg viewBox="0 0 400 300" className="geometry-diagram">
                {/* Grid lines */}
                {Array.from({ length: 13 }, (_, i) => i - 6).map(x => (
                  <line
                    key={`v-${x}`}
                    x1={200 + x * 27.27}
                    y1="20"
                    x2={200 + x * 27.27}
                    y2="280"
                    stroke="#e0e0e0"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 9 }, (_, i) => i - 4).map(y => (
                  <line
                    key={`h-${y}`}
                    x1="20"
                    y1={150 - y * 27.27}
                    x2="380"
                    y2={150 - y * 27.27}
                    stroke="#e0e0e0"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Axes */}
                <line x1="20" y1="150" x2="380" y2="150" stroke="#333" strokeWidth="2" />
                <line x1="200" y1="20" x2="200" y2="280" stroke="#333" strokeWidth="2" />
                
                {/* Axis arrows - x-axis arrow on the right, y-axis arrow on top */}
                <polygon points="375,145 380,150 375,155" fill="#333" />
                <polygon points="25,145 20,150 25,155" fill="#333" />
                <polygon points="195,25 200,20 205,25" fill="#333" />
                <polygon points="195,275 200,280 205,275" fill="#333" />
                
                {/* Grid labels - only show if showGridNumbers is true */}
                {showGridNumbers && Array.from({ length: 13 }, (_, i) => i - 6).map(x => (
                  x !== 0 && (
                    <text
                      key={`x-label-${x}`}
                      x={200 + x * 27.27}
                      y="165"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#666"
                    >
                      {x}
                    </text>
                  )
                ))}
                {showGridNumbers && Array.from({ length: 9 }, (_, i) => i - 4).map(y => (
                  y !== 0 && (
                    <text
                      key={`y-label-${y}`}
                      x="190"
                      y={150 - y * 27.27 + 4}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#666"
                    >
                      {y}
                    </text>
                  )
                ))}

                {/* Reflection lines - only for reflection transformations */}
                {currentProblem.transformationType.startsWith('reflection') && (
                  <>
                    {currentProblem.transformationType === 'reflection_x' && (
                      <line x1="20" y1="150" x2="380" y2="150" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="5,5" />
                    )}
                    {currentProblem.transformationType === 'reflection_y' && (
                      <line x1="200" y1="20" x2="200" y2="280" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="5,5" />
                    )}
                    {currentProblem.transformationType === 'reflection_yx' && (
                      <line x1="63.65" y1="286.35" x2="336.35" y2="13.65" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="5,5" />
                    )}
                    {currentProblem.transformationType === 'reflection_ynx' && (
                      <line x1="63.65" y1="13.65" x2="336.35" y2="286.35" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="5,5" />
                    )}
                  </>
                )}
                
                {/* Point */}
                {(() => {
                  const svgPos = coordToSVG(currentProblem.pointA.x, currentProblem.pointA.y);
                  return (
                    <>
                      <circle
                        cx={svgPos.x}
                        cy={svgPos.y}
                        r="8"
                        fill="#ff6b6b"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                      {showPointLabel && (
                        <text
                          x={svgPos.x}
                          y={svgPos.y + 25}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#666"
                        >
                          ({currentProblem.pointA.x}, {currentProblem.pointA.y})
                        </text>
                      )}
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="question-container">
              <div className="question-header">
                <h2>What are the coordinates of point A after a {currentProblem.transformationName.toLowerCase()}?</h2>
                {hiddenRules.has(currentProblem.transformationType) && (
                  <button 
                    className="hint-button"
                    onClick={showTransformationHint}
                    title="Get hint for this transformation"
                  >
                    💡 Hint
                  </button>
                )}
              </div>
              
              {/* Hint popup */}
              {showHint && (
                <div className="hint-popup">
                  <div className="hint-content">
                    <strong>Hint:</strong> {hintContent}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="coordinate-inputs">
                  <div className="parentheses-input">
                    <span className="parentheses">(</span>
                    <input
                      ref={xInputRef}
                      type="number"
                      value={userAnswer.x}
                      onChange={(e) => handleChange('x', e.target.value)}
                      onFocus={() => handleFocus('x')}
                      onBlur={() => handleBlur('x')}
                      placeholder={showPlaceholders.x ? "x" : ""}
                      className="coordinate-input"
                    />
                    <span className="comma">,</span>
                    <input
                      type="number"
                      value={userAnswer.y}
                      onChange={(e) => handleChange('y', e.target.value)}
                      onFocus={() => handleFocus('y')}
                      onBlur={() => handleBlur('y')}
                      placeholder={showPlaceholders.y ? "y" : ""}
                      className="coordinate-input"
                    />
                    <span className="parentheses">)</span>
                  </div>
                </div>

                {!showResult ? (
                  <button 
                    className="submit-button" 
                    type="submit"
                    disabled={userAnswer.x === '' || userAnswer.y === '' || 
                             isNaN(Number(userAnswer.x)) || isNaN(Number(userAnswer.y))}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div className="result-container">
                    <div
                      className={`result ${
                        Number(userAnswer.x) === currentProblem.transformedPoint.x && 
                        Number(userAnswer.y) === currentProblem.transformedPoint.y ? "correct" : "incorrect"
                      }`}
                    >
                      {Number(userAnswer.x) === currentProblem.transformedPoint.x && 
                       Number(userAnswer.y) === currentProblem.transformedPoint.y ? "✅ Correct!" : "❌ Incorrect!"}
                    </div>
                    
                    <div className="solution">
                      <h4>Correct Answer:</h4>
                      <div className="correct-answer">
                        ({currentProblem.transformedPoint.x}, {currentProblem.transformedPoint.y})
                      </div>
                      <p className="explanation">{currentProblem.explanation}</p>
                    </div>

                    <button className="next-button" onClick={handleNext}>
                      Next Problem
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        <div className="transformations-reference">
          <h3>Transformation Rules Reference</h3>
          <div className="transformations-grid">
            <div className="transformation-rule">
              <h4>Reflections</h4>
              <ul>
                <li className={hiddenRules.has('reflection_x') ? 'hidden-rule' : ''}>
                  <strong>Over x-axis:</strong> (x, y) → (x, -y)
                </li>
                <li className={hiddenRules.has('reflection_y') ? 'hidden-rule' : ''}>
                  <strong>Over y-axis:</strong> (x, y) → (-x, y)
                </li>
                <li className={hiddenRules.has('reflection_yx') ? 'hidden-rule' : ''}>
                  <strong>Over y = x:</strong> (x, y) → (y, x)
                </li>
                <li className={hiddenRules.has('reflection_ynx') ? 'hidden-rule' : ''}>
                  <strong>Over y = -x:</strong> (x, y) → (-y, -x)
                </li>
              </ul>
            </div>
            
            <div className="transformation-rule">
              <h4>Rotations</h4>
              <ul>
                <li className={hiddenRules.has('rotation_90_cw') ? 'hidden-rule' : ''}>
                  <strong>90° clockwise:</strong> (x, y) → (y, -x)
                </li>
                <li className={hiddenRules.has('rotation_90_ccw') ? 'hidden-rule' : ''}>
                  <strong>90° counter-clockwise:</strong> (x, y) → (-y, x)
                </li>
                <li className={hiddenRules.has('rotation_180') ? 'hidden-rule' : ''}>
                  <strong>180°:</strong> (x, y) → (-x, -y)
                </li>
                <li className={hiddenRules.has('rotation_270_cw') ? 'hidden-rule' : ''}>
                  <strong>270° clockwise:</strong> (x, y) → (-y, x)
                </li>
                <li className={hiddenRules.has('rotation_270_ccw') ? 'hidden-rule' : ''}>
                  <strong>270° counter-clockwise:</strong> (x, y) → (y, -x)
                </li>
              </ul>
            </div>
            
            <div className="transformation-rule">
              <h4>Translations</h4>
              <ul>
                <li className={hiddenRules.has('translation') ? 'hidden-rule' : ''}>
                  <strong>By (a, b):</strong> (x, y) → (x + a, y + b)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
