import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

export default function Home() {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    const handleStart = (e) => {
        e.preventDefault();
        if (userId.trim()) {
            localStorage.setItem('pixel_quiz_user_id', userId.trim());
            navigate('/game');
        }
    };

    return (
        <div className="pixel-box" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h1>
                <Gamepad2 size={48} style={{ display: 'block', margin: '0 auto 1rem' }} />
                像素闯关游戏
            </h1>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>请输入您的挑战ID</p>

            <form onSubmit={handleStart}>
                <input
                    type="text"
                    className="pixel-input"
                    placeholder="ENTER ID..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <button type="submit" className="pixel-button">
                    START GAME
                </button>
            </form>
        </div>
    );
}
