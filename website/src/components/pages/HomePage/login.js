import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        setError("");

        const stored = localStorage.getItem('user');
        if (!stored) {
            setError("No account found. Please sign up.");
            return;
        }

        const parsed = JSON.parse(stored);
        if (parsed.email === email && parsed.password === password) {
            localStorage.setItem('isLoggedIn', 'true');
            setUser(parsed);
            navigate('/profile');
        } else {
            setError("Invalid email or password.");
        }
    }

    return (<>
        <div className="background-layer"></div>

            <section className="login">
                <div className="login-card">
                    <h2>Login Page</h2>
                    <p id="login">Please login to your account.</p>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Form onSubmit={handleSubmit} className="login-form">
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Enter email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label >Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                    <p style={{ marginTop: '15px' }}>
                        Don't have an account? <Link to="/signup" style={{ color: '#007bff' }}>Sign up here</Link>
                    </p>
                </div>
            </section>
     </>);
}

export default Login;
