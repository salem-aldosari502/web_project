import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function Login({ setUser }){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(e){
        e.preventDefault();
        setError("");

        try {
            const response = await fetch('http://localhost:5001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            console.log("Login response status:", response.status);

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('isLoggedIn', 'true');
            const fullUser = {...data.user, avatar: data.user.avatar || null};
            localStorage.setItem('user', JSON.stringify(fullUser));
            localStorage.setItem(`profileAvatar_${data.user.id}`, fullUser.avatar);
            
            setUser(fullUser);
            
            login(data.token, data.user.name, data.user.role, data.user.id);
            
            navigate('/home');
        } catch (err) {
            if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
                setError("⚠️ Server is currently offline. Please try again later.");
            } else {
                setError("Connection error. Please try again.");
            }
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

