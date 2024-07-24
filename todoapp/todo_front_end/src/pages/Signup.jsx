import { useState } from "react";
import { signUpApi } from "../services/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import '../index.css';

export default function Signup() {
    const { auth, signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await signUpApi(name, email, password, passwordConfirmation);
            console.log("User registered successfully:", data);
            const token = data.access_token;
            signup(token);
            navigate('/');
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.message);
        }
    };

    if (auth) {
        return <Navigate to="/" />;
    }

    const login = () => {
        navigate('/login');
    };

    return (
        <div className="signup-container">
            <h2 className="signup-header">Signup for free</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                {error && <div className="error-message">{error}</div>} {/* Display error message */}
                <div className="form-group">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        required
                        placeholder="Password Confirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="submit-button">Signup</button>
                </div>
            </form>
            <button onClick={login} className="login-button">Login</button>
        </div>
    );
}
