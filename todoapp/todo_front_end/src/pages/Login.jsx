import { Navigate, useNavigate } from "react-router-dom";
import { loginApi } from "../services/auth";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";

export default function Login() {
    const { auth, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginApi(email, password);
            console.log("User logged in successfully:", data);
            const token = data.access_token;
            login(token);
            navigate('/');
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message); 
        }
    };

    const signUp = () => {
        navigate('/signup');
    };

    if (auth) {
        return <Navigate to="/" />;
    }

    return (
        <div className="login-container">
            <h2 className="login-header">Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                {error && <div className="error-message">{error}</div>} {/* Display error message */}
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
                    <button type="submit" className="submit-button">Login</button>
                </div>
            </form>
            <button onClick={signUp}className="login-button">Signup</button>
        </div>
    );
}
