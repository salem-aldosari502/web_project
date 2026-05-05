import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/users/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Reset failed.');
            } else {
                setMessage(data.message);
                setDone(true);
                setTimeout(() => navigate('/login'), 2500);
            }
        } catch (err) {
            setError('⚠️ Server is currently offline. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="background-layer"></div>
            <section className="login">
                <div className="login-card">
                    <h2>Reset Password</h2>
                    <p id="login">Enter your new password below.</p>

                    {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    {!done && (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px' }}>New Password</label>
                                <input
                                    type="password"
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Repeat your new password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#0d6efd',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <p style={{ marginTop: '15px' }}>
                        <Link to="/login" style={{ color: '#007bff' }}>Back to Login</Link>
                    </p>
                </div>
            </section>
        </>
    );
}

export default ResetPassword;