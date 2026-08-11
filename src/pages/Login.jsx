import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isSignUp) {
                signUp(email, password, username);
            } else {
                login(email, password);
            }
            navigate('/decks');
        } catch (err) {
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">{isSignUp ? 'Sign Up' : 'Login'}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {isSignUp && (
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                )}
                <button type="submit" className="submit-btn">
                    {isSignUp ? 'Sign Up' : 'Login'}
                </button>
            </form>
            <button className="toggle-btn" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
};

export default Login;