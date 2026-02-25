import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitScore, PASS_THRESHOLD } from '../api';
import { Trophy, Skull } from 'lucide-react';

export default function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(true);
    const [submitError, setSubmitError] = useState(null);

    const userId = localStorage.getItem('pixel_quiz_user_id');
    const { score, total, timeTaken } = location.state || { score: 0, total: 0, timeTaken: 0 };

    const passed = score >= PASS_THRESHOLD;

    const submittedRef = React.useRef(false);

    useEffect(() => {
        if (!userId || !location.state) {
            navigate('/');
            return;
        }

        if (submittedRef.current) return;
        submittedRef.current = true;

        // Attempt count from localStorage
        const attrKey = `pixel_quiz_attempts_${userId}`;
        const previousAttempts = parseInt(localStorage.getItem(attrKey) || "0", 10);
        const newAttempts = previousAttempts + 1;
        localStorage.setItem(attrKey, newAttempts.toString());

        submitScore({
            userId,
            score,
            totalQuestions: total,
            passed,
            attempts: newAttempts,
            timeTaken
        })
            .then(() => setSubmitting(false))
            .catch(err => {
                console.error(err);
                setSubmitError('成绩上传失败: ' + err.message);
                setSubmitting(false);
            });
    }, [userId, location.state, navigate, score, total, passed, timeTaken]);

    return (
        <div className="pixel-box" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            {passed ? (
                <Trophy size={64} color="#fbbf24" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
            ) : (
                <Skull size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem', display: 'block' }} />
            )}

            <h1 style={{ color: passed ? '#10b981' : '#ef4444' }}>
                {passed ? 'STAGE CLEAR!' : 'GAME OVER'}
            </h1>

            <div style={{ margin: '2rem 0', fontSize: '1.2rem' }}>
                <p>SCORE: {score} / {total}</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    (通关门槛: {PASS_THRESHOLD} 分)
                </p>
            </div>

            {submitting ? (
                <p className="loading" style={{ color: '#fbbf24', marginBottom: '1.5rem' }}>上传成绩中...</p>
            ) : submitError ? (
                <p style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem', wordBreak: 'break-all' }}>{submitError}</p>
            ) : (
                <p style={{ color: '#10b981', marginBottom: '1.5rem' }}>成绩已记录！</p>
            )}

            <button className="pixel-button" onClick={() => navigate('/', { replace: true, state: null })}>
                RETRY
            </button>
        </div>
    );
}

