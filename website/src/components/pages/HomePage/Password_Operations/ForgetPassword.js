import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Something went wrong.');
            } else {
                setMessage(data.message);
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
                    <h2>Forgot Password</h2>
                    <p id="login">Enter your email and we'll send you a reset link.</p>

                    {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px' }}>Email address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <p style={{ marginTop: '15px' }}>
                        Remember your password? <Link to="/login" style={{ color: '#007bff' }}>Back to Login</Link>
                    </p>
                </div>
            </section>
        </>
    );
}

export default ForgetPassword;