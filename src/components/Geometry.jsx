import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ANGLE_VOCAB = {
  'corresponding': 'corresponding angles',
  'consecutive': 'consecutive exterior angles', 
  'consecutive interior': 'consecutive interior angles', 
  'alternate': 'alternate exterior angles',
  'alternate interior': 'alternate interior angles',
  'vertical': 'vertical angles',
  'linear pair': 'linear pair'
};

const ANGLE_RELATIONSHIPS = {
  'A': { 'B': 'linear pair', 'C': 'linear pair', 'D': 'vertical', 'E': 'corresponding', 'G': 'consecutive'},
  'B': { 'C': 'vertical', 'D': 'linear pair', 'H': 'consective', 'G': 'alternate' },
  'C': { 'D': 'linear pair', 'E': 'consecutive interior', 'F': 'alternate interior', 'G': 'corresponding' },
  'D': { 'E': 'alternate interior', 'F': 'consecutive interior', 'H': 'corresponding' },
  'E': { 'F': 'linear pair', 'G': 'linear pair', 'H': 'vertical'},
  'F': { 'G': 'vertical', 'H': 'linear pair' },
  'G': { 'H': 'linear pair' },
};

export default function Geometry() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    generateNewQuestion();
  }, []);

  function generateNewQuestion() {
    const angles = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const angle1 = angles[Math.floor(Math.random() * angles.length)];
    const possiblePairs = Object.keys(ANGLE_RELATIONSHIPS[angle1]);
    const angle2 = possiblePairs[Math.floor(Math.random() * possiblePairs.length)];
    const correctAnswer = ANGLE_RELATIONSHIPS[angle1][angle2];
    
    // Generate wrong answers
    const wrongAnswers = Object.keys(ANGLE_VOCAB)
      .filter(term => term !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allAnswers = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      angle1,
      angle2,
      correctAnswer,
      allAnswers,
      explanation: getExplanation(angle1, angle2, correctAnswer)
    });
    setSelectedAnswer('');
    setShowResult(false);
  }

  function getExplanation(angle1, angle2, relationship) {
    const explanations = {
      'corresponding': `${angle1} and ${angle2} are corresponding angles - they are in the same relative position on different parallel lines.`,
      'consecutive': `${angle1} and ${angle2} are consecutive angles - they are on same side of transversal, but at different intersections, and add to 180°.`,
      'alternative': `${angle1} and ${angle2} are alternative angles - they are on opposite sides of the transversal.`,
      'alternative interior': `${angle1} and ${angle2} are alternative interior angles - they are on opposite sides of the transversal and between the parallel lines.`,
      'vertical': `${angle1} and ${angle2} are vertical angles - they oppose each other through an intersection.`,
      'linear pair': `${angle1} and ${angle2} are a linear pair - they are side-by-side, forming a straight line (180°).`
    };
    return explanations[relationship] || '';
  }

  function handleAnswerSelect(answer) {
    if (showResult) return;
    setSelectedAnswer(answer);
  }

  function handleSubmit() {
    if (!selectedAnswer) return;
    
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  }

  function handleNext() {
    generateNewQuestion();
  }

  return (
    <div className="geometry-container">
      <header className="section-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>Geometry Practice</h1>
        <div className="score">
          Score: {score}/{totalQuestions}
        </div>
      </header>

      <div className="geometry-content">
        <div className="diagram-container">
          <svg viewBox="0 0 400 300" className="geometry-diagram">
            {/* Parallel lines */}
            <line x1="25" y1="125" x2="350" y2="125" stroke="#333" strokeWidth="3" />
            <line x1="25" y1="200" x2="350" y2="200" stroke="#333" strokeWidth="3" />
            
            {/* Transversal */}
            <line x1="50" y1="70" x2="325" y2="250" stroke="#666" strokeWidth="3" />
            
            {/* Angle labels */}
            <text textAnchor="middle" dominantBaseline="middle" x="100" y="115" className="angle-label">A</text>
            <text textAnchor="middle" dominantBaseline="middle" x="140" y="117" className="angle-label">B</text>
            <text textAnchor="middle" dominantBaseline="middle" x="125" y="143" className="angle-label">C</text>
            <text textAnchor="middle" dominantBaseline="middle" x="170" y="138" className="angle-label">D</text>
            <text textAnchor="middle" dominantBaseline="middle" x="215" y="192" className="angle-label">E</text>
            <text textAnchor="middle" dominantBaseline="middle" x="253" y="190" className="angle-label">F</text>
            <text textAnchor="middle" dominantBaseline="middle" x="235" y="215" className="angle-label">G</text>
            <text textAnchor="middle" dominantBaseline="middle" x="290" y="218" className="angle-label">H</text>

            {currentQuestion && (
              <>
                {currentQuestion.angle1 === 'A' && <circle cx="100" cy="115" r="15" fill="rgba(255, 0, 0, 0.3)" />}
                {currentQuestion.angle1 === 'B' && <circle cx="140" cy="117" r="15" fill="rgba(255, 0, 0, 0.3)" />}
                {currentQuestion.angle1 === 'C' && <circle cx="125" cy="143" r="15" fill="rgba(255, 0, 0, 0.3)" />}
                {currentQuestion.angle1 === 'D' && <circle cx="170" cy="138" r="15" fill="rgba(255, 0, 0, 0.3)" />}
                {currentQuestion.angle1 === 'E' && <circle cx="215" cy="192" r="15" fill="rgba(255, 0, 0, 0.3)" />}
                {currentQuestion.angle1 === 'F' && <circle cx="253" cy="190" r="15" fill="rgba(255, 0, 0, 0.3)" />}
                {currentQuestion.angle1 === 'G' && <circle cx="235" cy="215" r="15" fill="rgba(255, 0, 0, 0.3)" />}
                {currentQuestion.angle1 === 'H' && <circle cx="290" cy="218" r="15" fill="rgba(255, 0, 0, 0.3)" />}
                
                {currentQuestion.angle2 === 'A' && <circle cx="100" cy="115" r="15" fill="rgba(0, 255, 0, 0.3)" />}
                {currentQuestion.angle2 === 'B' && <circle cx="140" cy="117" r="15" fill="rgba(0, 255, 0, 0.3)" />}
                {currentQuestion.angle2 === 'C' && <circle cx="125" cy="143" r="15" fill="rgba(0, 255, 0, 0.3)" />}
                {currentQuestion.angle2 === 'D' && <circle cx="170" cy="138" r="15" fill="rgba(0, 255, 0, 0.3)" />}
                {currentQuestion.angle2 === 'E' && <circle cx="215" cy="192" r="15" fill="rgba(0, 255, 0, 0.3)" />}
                {currentQuestion.angle2 === 'F' && <circle cx="253" cy="190" r="15" fill="rgba(0, 255, 0, 0.3)" />}
                {currentQuestion.angle2 === 'G' && <circle cx="235" cy="215" r="15" fill="rgba(0, 255, 0, 0.3)" />}
                {currentQuestion.angle2 === 'H' && <circle cx="290" cy="218" r="15" fill="rgba(0, 255, 0, 0.3)" />}
              </>
            )}
          </svg>
        </div>

        {currentQuestion && (
          <div className="question-container">
            <h2>What is the relationship between angles {currentQuestion.angle1} and {currentQuestion.angle2}?</h2>
            
            <div className="answers">
              {currentQuestion.allAnswers.map((answer, index) => (
                <button
                  key={index}
                  className={`answer-button ${
                    selectedAnswer === answer ? 'selected' : ''
                  } ${
                    showResult 
                      ? answer === currentQuestion.correctAnswer 
                        ? 'correct' 
                        : selectedAnswer === answer 
                          ? 'incorrect' 
                          : ''
                      : ''
                  }`}
                  onClick={() => handleAnswerSelect(answer)}
                >
                  {ANGLE_VOCAB[answer]}
                </button>
              ))}
            </div>

            {!showResult ? (
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={!selectedAnswer}
              >
                Submit Answer
              </button>
            ) : (
              <div className="result-container">
                <div className={`result ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect!'}
                </div>
                <p className="explanation">{currentQuestion.explanation}</p>
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
