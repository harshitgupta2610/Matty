import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Updated login handler with role-based redirect
  // In Login.js - Update the handleLogin function
const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', form);
    
    // Store user data
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.user.role);
    localStorage.setItem('name', res.data.user.name);
    localStorage.setItem('email', res.data.user.email);
    
    toast.success('Login successful! Redirecting...', {
      position: 'top-right',
      autoClose: 2000,
    });

    // Redirect to single dashboard (it will show different content based on role)
    setTimeout(() => {
      navigate('/dashboard'); // Changed from role-specific routes
    }, 1500);

  } catch (err) {
    toast.error(`❌ ${err.response?.data?.message || 'Login failed'}`, {
      position: 'top-right',
      autoClose: 4000,
    });
  }
};


  return (
    <div className="login-root">
      {/* Left side: login form */}
      <div className="login-container">
        <button className="home-button" onClick={() => navigate('/')}>🏠 Home</button>
        <ToastContainer />
        <div className="login-logo">{/* You can put a logo SVG here if you want */}</div>
        <h2 className="login-title">Welcome back!</h2>
        <p className="login-subtitle">Login to your Customer Feedback System account</p>
        
        <label className="login-label">Email*</label>
        <input
          className="login-input"
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        
        <label className="login-label">Password*</label>
        <input
          className="login-input"
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        
        <div className="login-options">
          <label>
            <input type="checkbox" name="remember" className="login-checkbox"/>
            Remember me
          </label>
          <span className="login-forgot">Forgot your password?</span>
        </div>
        
        <button className="login-button" onClick={handleLogin}>
          Log In
        </button>
        
        <div className="login-divider">Or, Login with</div>
        <button className="google-button">Sign up with Google</button>
        <div className="login-bottom-text">
          Don't have an account? <Link className="login-register-link" to="/register">Register here</Link>
        </div>
      </div>
      
      {/* Right side: abstract/graphic illustration area */}
      <div className="login-art-panel">
        {/* Put SVG or even background-image here for graphics if wanted — use pure CSS for now */}
        <div className="geometric-bg"></div>
      </div>
    </div>
  );
};

export default Login;
