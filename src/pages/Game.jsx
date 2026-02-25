import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../api';

export default function Game() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startTime, setStartTime] = useState(null);

    const navigate = useNavigate();
    const userId = localStorage.getItem('pixel_quiz_user_id');

    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        setStartTime(Date.now());

        fetchQuestions()
            .then(data => {
                setQuestions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('无法载入题目，请检查网络或配置');
                setLoading(false);
            });
    }, [userId, navigate]);

    const handleAnswer = (selectedOption) => {
        const currentQuestion = questions[currentIndex];
        let newScore = score;

        // Check answer against the current question's correct option string (e.g. "A")
        if (selectedOption === currentQuestion.answer) {
            newScore += 1;
        }
        setScore(newScore);

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Game over, calculate time and go to result
            const timeTaken = Math.floor((Date.now() - startTime) / 1000); // in seconds
            navigate('/result', {
                state: {
                    score: newScore,
                    total: questions.length,
                    timeTaken
                }
            });
        }
    };

    if (loading) return <div className="loading">LOADING...</div>;
    if (error) return <div className="pixel-box"><p style={{ color: 'var(--error)' }}>{error}</p></div>;
    if (!questions.length) return <div className="pixel-box" style={{ textAlign: 'center' }}>没有题目</div>;

    const currentQuestion = questions[currentIndex];
    // Calculate a seeded string for deterministic boss per level
    const seed = `${userId}-boss-${currentQuestion.id || currentIndex}`;

    return (
        <div className="pixel-box" style={{ width: '100%', maxWidth: '600px' }}>
            <div className="stats-bar">
                <span>PLAYER: {userId}</span>
                <span>LEVEL: {currentIndex + 1}/{questions.length}</span>
                <span>SCORE: {score}</span>
            </div>

            <div className="sprite-container">
                <img
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&size=150`}
                    alt={`Boss ${currentIndex + 1}`}
                />
            </div>

            <div className="question-text">
                {currentQuestion.question}
            </div>

            <div className="grid grid-cols-2">
                {['A', 'B', 'C', 'D'].map(opt => (
                    currentQuestion[opt] && (
                        <button
                            key={opt}
                            className="choice-btn pixel-button"
                            onClick={() => handleAnswer(opt)}
                            style={{ marginTop: 0 }}
                        >
                            {opt}. {currentQuestion[opt]}
                        </button>
                    )
                ))}
            </div>
        </div>
    );
}
